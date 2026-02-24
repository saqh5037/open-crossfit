import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import { logScoreAudit } from "@/lib/audit"
import { z } from "zod"

const validateSchema = z.object({
  score_ids: z.array(z.string()).min(1),
  action: z.enum(["confirm", "reject"]),
  rejection_reason: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const auth = await requireRole(["coach", "admin", "owner"])
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(request.url)
  const wod_id = searchParams.get("wod_id")
  const division = searchParams.get("division")
  const status = searchParams.get("status") || "pending"

  const where: Record<string, unknown> = {}
  if (wod_id && wod_id !== "all") where.wod_id = wod_id
  if (status && status !== "all") where.status = status

  const scores = await prisma.score.findMany({
    where,
    include: { athlete: true, wod: true },
    orderBy: { created_at: "desc" },
  })

  // Filter by division client-side (athlete.division is not a direct score field)
  let filtered = scores
  if (division && division !== "all") {
    filtered = scores.filter((s) => s.athlete.division === division)
  }

  // Batch fetch scorer info
  const scorerIds = Array.from(new Set(filtered.map((s) => s.scored_by).filter(Boolean))) as string[]
  const scorers = scorerIds.length > 0
    ? await prisma.adminUser.findMany({
        where: { id: { in: scorerIds } },
        select: { id: true, email: true, role: true },
      })
    : []
  const scorerMap = Object.fromEntries(scorers.map((s) => [s.id, s]))

  const enriched = filtered.map((s) => ({
    ...s,
    scorer: s.scored_by ? scorerMap[s.scored_by] || null : null,
  }))

  return NextResponse.json({ data: enriched })
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(["coach", "admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = validateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { score_ids, action, rejection_reason } = parsed.data

    if (action === "confirm") {
      // Batch confirm
      await prisma.score.updateMany({
        where: { id: { in: score_ids }, status: "pending" },
        data: { status: "confirmed", confirmed_by: auth.userId },
      })

      // Log audit for each
      for (const scoreId of score_ids) {
        logScoreAudit({
          scoreId,
          action: "confirmed",
          newValues: { status: "confirmed" },
          performedBy: auth.userId,
        }).catch(console.error)
      }

      return NextResponse.json({
        success: true,
        message: `${score_ids.length} score(s) confirmado(s)`,
      })
    }

    if (action === "reject") {
      // Fetch scores before deleting for audit
      const scores = await prisma.score.findMany({
        where: { id: { in: score_ids } },
        include: { athlete: true, wod: true },
      })

      // Delete rejected scores
      await prisma.score.deleteMany({
        where: { id: { in: score_ids } },
      })

      // Log audit for each
      for (const score of scores) {
        logScoreAudit({
          scoreId: score.id,
          action: "rejected",
          oldValues: {
            athlete_id: score.athlete_id,
            athlete_name: score.athlete.full_name,
            wod_id: score.wod_id,
            wod_name: score.wod.name,
            raw_score: Number(score.raw_score),
            display_score: score.display_score,
          },
          newValues: { rejection_reason: rejection_reason || "Sin razón especificada" },
          performedBy: auth.userId,
        }).catch(console.error)
      }

      return NextResponse.json({
        success: true,
        message: `${scores.length} score(s) rechazado(s)`,
      })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error) {
    console.error("Error validating scores:", error)
    return NextResponse.json({ error: "Error al validar scores" }, { status: 500 })
  }
}

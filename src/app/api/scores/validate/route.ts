import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import { logScoreAudit } from "@/lib/audit"
import { sendEmail } from "@/lib/email"
import { ScoreApprovedEmail } from "@/emails/score-approved"
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
      // Fetch scores with athlete/wod info before confirming (for emails)
      const scoresToConfirm = await prisma.score.findMany({
        where: { id: { in: score_ids }, status: { in: ["pending", "rejected"] } },
        include: { athlete: true, wod: true },
      })

      // Batch confirm (works for both pending and rejected scores)
      await prisma.score.updateMany({
        where: { id: { in: score_ids }, status: { in: ["pending", "rejected"] } },
        data: { status: "confirmed", confirmed_by: auth.userId, rejection_reason: null },
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

      // Get event name for emails
      const eventConfig = await prisma.eventConfig.findFirst()
      const eventName = eventConfig?.name || "GRIZZLYS Open"

      // Send score-approved emails (fire-and-forget)
      for (const score of scoresToConfirm) {
        if (!score.athlete.email) continue

        // Calculate placement: count confirmed scores in same WOD+division with better ranking
        const betterScores = await prisma.score.count({
          where: {
            wod_id: score.wod_id,
            status: "confirmed",
            athlete: { division: score.athlete.division },
            raw_score: score.wod.sort_order === "asc"
              ? { lt: score.raw_score }
              : { gt: score.raw_score },
          },
        })
        const totalInDivision = await prisma.score.count({
          where: {
            wod_id: score.wod_id,
            status: "confirmed",
            athlete: { division: score.athlete.division },
          },
        })

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
        sendEmail({
          to: score.athlete.email,
          subject: `Score Confirmado: ${score.wod.name} — ${score.display_score}`,
          react: ScoreApprovedEmail({
            athleteName: score.athlete.full_name,
            wodName: score.wod.name,
            displayScore: score.display_score,
            placement: betterScores + 1,
            totalInDivision,
            eventName,
            appUrl,
          }),
        }).catch(console.error)
      }

      return NextResponse.json({
        success: true,
        message: `${scoresToConfirm.length} score(s) confirmado(s)`,
      })
    }

    if (action === "reject") {
      const reason = rejection_reason || "Sin razón especificada"

      // Update scores to rejected status (keep the record for judge to correct)
      await prisma.score.updateMany({
        where: { id: { in: score_ids } },
        data: {
          status: "rejected",
          rejection_reason: reason,
        },
      })

      // Log audit for each
      for (const scoreId of score_ids) {
        logScoreAudit({
          scoreId,
          action: "rejected",
          newValues: { status: "rejected", rejection_reason: reason },
          performedBy: auth.userId,
        }).catch(console.error)
      }

      return NextResponse.json({
        success: true,
        message: `${score_ids.length} score(s) rechazado(s)`,
      })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error) {
    console.error("Error validating scores:", error)
    return NextResponse.json({ error: "Error al validar scores" }, { status: 500 })
  }
}

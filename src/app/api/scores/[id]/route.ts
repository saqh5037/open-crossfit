import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import { logScoreAudit } from "@/lib/audit"
import { z } from "zod"

const updateScoreSchema = z.object({
  raw_score: z.number().positive().optional(),
  display_score: z.string().min(1).optional(),
  is_rx: z.boolean().optional(),
  evidence_url: z.string().optional(),
  judge_notes: z.string().optional(),
  status: z.enum(["pending", "confirmed"]).optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const score = await prisma.score.findUnique({
    where: { id: params.id },
    include: { athlete: true, wod: true },
  })

  if (!score) {
    return NextResponse.json({ error: "Score no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ data: score })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["coach", "admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = updateScoreSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Fetch current score for audit trail
    const existing = await prisma.score.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Score no encontrado" }, { status: 404 })
    }

    // Guard: judges cannot edit confirmed scores
    if (existing.status === "confirmed" && auth.role === "judge") {
      return NextResponse.json(
        { error: "Este score ya fue confirmado. Solo un coach puede modificarlo." },
        { status: 403 }
      )
    }

    // If confirming, set confirmed_by
    const updateData: Record<string, unknown> = {
      ...parsed.data,
      scored_by: auth.userId,
    }
    if (parsed.data.status === "confirmed") {
      updateData.confirmed_by = auth.userId
    }

    const score = await prisma.score.update({
      where: { id: params.id },
      data: updateData,
    })

    // Determine audit action
    const auditAction = parsed.data.status === "confirmed" ? "confirmed" : "updated"

    logScoreAudit({
      scoreId: score.id,
      action: auditAction,
      oldValues: {
        raw_score: Number(existing.raw_score),
        display_score: existing.display_score,
        is_rx: existing.is_rx,
        status: existing.status,
      },
      newValues: parsed.data,
      performedBy: auth.userId,
    }).catch(console.error)

    return NextResponse.json({ data: score })
  } catch {
    return NextResponse.json({ error: "Error al actualizar score" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    // Fetch score before deleting for audit
    const existing = await prisma.score.findUnique({ where: { id: params.id } })

    await prisma.score.delete({ where: { id: params.id } })

    if (existing) {
      logScoreAudit({
        scoreId: params.id,
        action: "deleted",
        oldValues: {
          athlete_id: existing.athlete_id,
          wod_id: existing.wod_id,
          raw_score: Number(existing.raw_score),
          display_score: existing.display_score,
          is_rx: existing.is_rx,
          status: existing.status,
        },
        performedBy: auth.userId,
      }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar score" }, { status: 500 })
  }
}

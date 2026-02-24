import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { scoreSchema } from "@/lib/validations/score"
import { requireRole } from "@/lib/auth-helpers"
import { logScoreAudit } from "@/lib/audit"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wod_id = searchParams.get("wod_id")

  const where: Record<string, unknown> = {}
  if (wod_id) where.wod_id = wod_id

  const scores = await prisma.score.findMany({
    where,
    include: { athlete: true, wod: true },
    orderBy: { created_at: "desc" },
  })

  return NextResponse.json({ data: scores })
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(["judge", "coach", "admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = scoreSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Check if score already exists
    const existing = await prisma.score.findUnique({
      where: {
        athlete_id_wod_id: {
          athlete_id: parsed.data.athlete_id,
          wod_id: parsed.data.wod_id,
        },
      },
      include: { athlete: true },
    })

    if (existing && !parsed.data.overwrite) {
      return NextResponse.json(
        {
          error: "Score ya existe",
          existing: {
            display_score: existing.display_score,
            athlete_name: existing.athlete.full_name,
          },
        },
        { status: 409 }
      )
    }

    // Guard: judges cannot overwrite confirmed scores
    if (existing && existing.status === "confirmed" && auth.role === "judge") {
      return NextResponse.json(
        { error: "Este score ya fue confirmado. Solo un coach puede modificarlo." },
        { status: 403 }
      )
    }

    const score = await prisma.score.upsert({
      where: {
        athlete_id_wod_id: {
          athlete_id: parsed.data.athlete_id,
          wod_id: parsed.data.wod_id,
        },
      },
      update: {
        raw_score: parsed.data.raw_score,
        display_score: parsed.data.display_score,
        is_rx: parsed.data.is_rx,
        scored_by: auth.userId,
        evidence_url: parsed.data.evidence_url ?? undefined,
        judge_notes: parsed.data.judge_notes ?? undefined,
      },
      create: {
        athlete_id: parsed.data.athlete_id,
        wod_id: parsed.data.wod_id,
        raw_score: parsed.data.raw_score,
        display_score: parsed.data.display_score,
        is_rx: parsed.data.is_rx,
        scored_by: auth.userId,
        evidence_url: parsed.data.evidence_url ?? null,
        judge_notes: parsed.data.judge_notes ?? null,
      },
    })

    // Audit log
    logScoreAudit({
      scoreId: score.id,
      action: existing ? "updated" : "created",
      oldValues: existing
        ? { raw_score: Number(existing.raw_score), display_score: existing.display_score, is_rx: existing.is_rx }
        : null,
      newValues: { raw_score: parsed.data.raw_score, display_score: parsed.data.display_score, is_rx: parsed.data.is_rx },
      performedBy: auth.userId,
    }).catch(console.error)

    return NextResponse.json({ data: score }, { status: 201 })
  } catch (error) {
    console.error("Error creating score:", error)
    return NextResponse.json({ error: "Error al guardar score" }, { status: 500 })
  }
}

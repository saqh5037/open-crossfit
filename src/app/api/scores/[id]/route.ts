import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
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

    const score = await prisma.score.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        scored_by: auth.userId,
      },
    })

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
    await prisma.score.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar score" }, { status: 500 })
  }
}

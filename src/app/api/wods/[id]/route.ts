import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { wodSchema } from "@/lib/validations/wod"
import { getSortOrder } from "@/lib/score-utils"
import { requireRole } from "@/lib/auth-helpers"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const wod = await prisma.wod.findUnique({ where: { id: params.id } })
  if (!wod) return NextResponse.json({ error: "WOD no encontrado" }, { status: 404 })
  return NextResponse.json({ data: wod })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["coach", "admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = wodSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const wod = await prisma.wod.update({
      where: { id: params.id },
      data: {
        name: parsed.data.name,
        day_number: parsed.data.day_number,
        description: parsed.data.description || null,
        score_type: parsed.data.score_type,
        time_cap_seconds: parsed.data.time_cap_seconds ?? null,
        sort_order: getSortOrder(parsed.data.score_type),
      },
    })

    return NextResponse.json({ data: wod })
  } catch {
    return NextResponse.json({ error: "Error al actualizar WOD" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["coach", "admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    // Check if WOD has scores
    const scoreCount = await prisma.score.count({ where: { wod_id: params.id } })
    if (scoreCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: tiene ${scoreCount} scores asociados` },
        { status: 409 }
      )
    }

    await prisma.wod.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar WOD" }, { status: 500 })
  }
}

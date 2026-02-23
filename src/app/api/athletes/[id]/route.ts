import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const athlete = await prisma.athlete.findUnique({
    where: { id: params.id },
    include: { scores: { include: { wod: true } } },
  })

  if (!athlete) {
    return NextResponse.json({ error: "Atleta no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ data: athlete })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const athlete = await prisma.athlete.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json({ data: athlete })
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["admin", "owner"])
  if (auth instanceof NextResponse) return auth

  try {
    await prisma.athlete.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}

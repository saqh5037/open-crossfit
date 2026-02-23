import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"
import { requireRole } from "@/lib/auth-helpers"
import { updateAdminUserSchema } from "@/lib/validations/admin-user"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = updateAdminUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const targetUser = await prisma.adminUser.findUnique({ where: { id: params.id } })
    if (!targetUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (targetUser.role === "owner" && parsed.data.role) {
      return NextResponse.json(
        { error: "No se puede cambiar el rol de un owner" },
        { status: 403 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (parsed.data.role) updateData.role = parsed.data.role
    if (parsed.data.password) {
      updateData.password_hash = await hash(parsed.data.password, 12)
    }

    const user = await prisma.adminUser.update({
      where: { id: params.id },
      data: updateData,
      select: { id: true, email: true, role: true, created_at: true },
    })

    return NextResponse.json({ data: user })
  } catch {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["owner"])
  if (auth instanceof NextResponse) return auth

  if (params.id === auth.userId) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta" },
      { status: 403 }
    )
  }

  const targetUser = await prisma.adminUser.findUnique({ where: { id: params.id } })
  if (targetUser?.role === "owner") {
    return NextResponse.json(
      { error: "No se puede eliminar a otro owner" },
      { status: 403 }
    )
  }

  try {
    await prisma.adminUser.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}

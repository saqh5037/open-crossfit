import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"
import { requireRole } from "@/lib/auth-helpers"
import { createAdminUserSchema } from "@/lib/validations/admin-user"

export async function GET() {
  const auth = await requireRole(["owner"])
  if (auth instanceof NextResponse) return auth

  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: { created_at: "desc" },
  })

  return NextResponse.json({ data: users })
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(["owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = createAdminUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await prisma.adminUser.findUnique({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 }
      )
    }

    const password_hash = await hash(parsed.data.password, 12)

    const user = await prisma.adminUser.create({
      data: {
        email: parsed.data.email,
        password_hash,
        role: parsed.data.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

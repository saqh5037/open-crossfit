import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import { hash } from "bcryptjs"

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

  const judge = await prisma.adminUser.findUnique({
    where: { email: athlete.email },
    select: { role: true },
  })

  return NextResponse.json({
    data: athlete,
    isJudge: judge?.role === "judge",
  })
}

const ALLOWED_FIELDS = [
  "full_name", "email", "phone", "birth_date",
  "gender", "division", "photo_url",
] as const

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["admin", "owner", "coach"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()

    // Whitelist fields
    const data: Record<string, unknown> = {}
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        data[field] = field === "birth_date" ? new Date(body[field]) : body[field]
      }
    }

    const athlete = await prisma.athlete.update({
      where: { id: params.id },
      data,
    })

    // Handle judge conversion
    let isJudge = false
    if (body.judge_password && typeof body.judge_password === "string" && body.judge_password.length >= 8) {
      const existing = await prisma.adminUser.findUnique({
        where: { email: athlete.email },
      })
      if (existing) {
        isJudge = existing.role === "judge"
      } else {
        const password_hash = await hash(body.judge_password, 12)
        await prisma.adminUser.create({
          data: {
            email: athlete.email,
            password_hash,
            role: "judge",
          },
        })
        isJudge = true
      }
    } else {
      const existing = await prisma.adminUser.findUnique({
        where: { email: athlete.email },
        select: { role: true },
      })
      isJudge = existing?.role === "judge"
    }

    return NextResponse.json({ data: athlete, isJudge })
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["admin", "owner", "coach"])
  if (auth instanceof NextResponse) return auth

  try {
    await prisma.athlete.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}

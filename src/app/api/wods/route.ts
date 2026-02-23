import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { wodSchema } from "@/lib/validations/wod"
import { getSortOrder } from "@/lib/score-utils"
import { requireRole } from "@/lib/auth-helpers"

export async function GET() {
  const wods = await prisma.wod.findMany({
    orderBy: { display_order: "asc" },
  })
  return NextResponse.json({ data: wods })
}

export async function POST(request: NextRequest) {
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

    const wod = await prisma.wod.create({
      data: {
        name: parsed.data.name,
        day_number: parsed.data.day_number,
        description: parsed.data.description || null,
        score_type: parsed.data.score_type,
        time_cap_seconds: parsed.data.time_cap_seconds ?? null,
        sort_order: getSortOrder(parsed.data.score_type),
      },
    })

    return NextResponse.json({ data: wod }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al crear WOD"
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Ya existe un WOD para ese día" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

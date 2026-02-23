import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { athleteSchema } from "@/lib/validations/athlete"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const division = searchParams.get("division")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {}
  if (division) where.division = division
  if (search) where.full_name = { contains: search, mode: "insensitive" }

  const athletes = await prisma.athlete.findMany({
    where,
    orderBy: { participant_number: "asc" },
  })

  return NextResponse.json({ data: athletes })
}

export async function POST(request: NextRequest) {
  try {
    // Check registration is open
    const config = await prisma.eventConfig.findFirst()
    if (!config?.registration_open) {
      return NextResponse.json(
        { error: "El registro está cerrado" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = athleteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Check for duplicate by email
    const existing = await prisma.athlete.findUnique({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un registro con ese email" },
        { status: 409 }
      )
    }

    const athlete = await prisma.athlete.create({
      data: {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        birth_date: parsed.data.birth_date ? new Date(parsed.data.birth_date) : null,
        gender: parsed.data.gender,
        division: parsed.data.division,
        photo_url: parsed.data.photo_url || null,
      },
    })

    return NextResponse.json(
      { data: athlete, participantNumber: athlete.participant_number },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating athlete:", error)
    return NextResponse.json(
      { error: "Error al registrar atleta" },
      { status: 500 }
    )
  }
}

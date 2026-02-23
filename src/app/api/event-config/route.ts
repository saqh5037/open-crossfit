export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"

export async function GET() {
  const config = await prisma.eventConfig.findFirst()
  return NextResponse.json({ data: config })
}

export async function PUT(request: NextRequest) {
  const auth = await requireRole(["owner"])
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const config = await prisma.eventConfig.findFirst()

    if (!config) {
      return NextResponse.json({ error: "Config no encontrada" }, { status: 404 })
    }

    const updated = await prisma.eventConfig.update({
      where: { id: config.id },
      data: body,
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error("Error updating config:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}

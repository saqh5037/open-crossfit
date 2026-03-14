import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST — público, trackea un click en el badge WBI
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { athlete_id, source_page } = body

    await prisma.wbiBadgeClick.create({
      data: {
        athlete_id: athlete_id || null,
        source_page: source_page || "recap",
        user_agent: req.headers.get("user-agent") || null,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error tracking click" }, { status: 500 })
  }
}

// GET — solo admin/owner, retorna métricas de clicks
export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!role || !["admin", "owner"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const [totalClicks, clicksByAthlete, recentClicks] = await Promise.all([
      prisma.wbiBadgeClick.count(),
      prisma.wbiBadgeClick.groupBy({
        by: ["athlete_id"],
        _count: { id: true },
        _max: { created_at: true },
        where: { athlete_id: { not: null } },
        orderBy: { _count: { id: "desc" } },
        take: 50,
      }),
      prisma.wbiBadgeClick.findMany({
        orderBy: { created_at: "desc" },
        take: 20,
        include: { athlete: { select: { full_name: true } } },
      }),
    ])

    // Resolve athlete names for grouped data
    const athleteIds = clicksByAthlete
      .map((c) => c.athlete_id)
      .filter(Boolean) as string[]
    const athletes = await prisma.athlete.findMany({
      where: { id: { in: athleteIds } },
      select: { id: true, full_name: true },
    })
    const nameMap = Object.fromEntries(athletes.map((a) => [a.id, a.full_name]))

    const byAthlete = clicksByAthlete.map((c) => ({
      athlete_id: c.athlete_id,
      athlete_name: c.athlete_id ? nameMap[c.athlete_id] || "Desconocido" : null,
      clicks: c._count.id,
      last_click: c._max.created_at,
    }))

    return NextResponse.json({
      total: totalClicks,
      by_athlete: byAthlete,
      recent: recentClicks.map((c) => ({
        id: c.id,
        athlete_name: c.athlete?.full_name || null,
        source_page: c.source_page,
        created_at: c.created_at,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Error fetching metrics" }, { status: 500 })
  }
}

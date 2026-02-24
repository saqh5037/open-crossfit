import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, birth_date } = await request.json()

    if (!email || !birth_date) {
      return NextResponse.json(
        { error: "Email y fecha de nacimiento son requeridos" },
        { status: 400 }
      )
    }

    // Find athlete by email
    const athlete = await prisma.athlete.findUnique({
      where: { email },
    })

    if (!athlete) {
      return NextResponse.json(
        { error: "No encontramos un atleta con ese email" },
        { status: 404 }
      )
    }

    // Verify birth date matches
    if (athlete.birth_date) {
      const athleteBirthDate = athlete.birth_date.toISOString().split("T")[0]
      if (athleteBirthDate !== birth_date) {
        return NextResponse.json(
          { error: "La fecha de nacimiento no coincide" },
          { status: 401 }
        )
      }
    }

    // Get all active WODs
    const activeWods = await prisma.wod.findMany({
      where: { is_active: true },
      orderBy: { display_order: "asc" },
    })

    // Get confirmed scores for this athlete
    const confirmedScores = await prisma.score.findMany({
      where: {
        athlete_id: athlete.id,
        status: "confirmed",
        wod: { is_active: true },
      },
      include: { wod: true },
      orderBy: { wod: { display_order: "asc" } },
    })

    // Check if all WODs are confirmed
    const confirmedWodIds = new Set(confirmedScores.map((s) => s.wod_id))
    const allWodsConfirmed = activeWods.every((w) => confirmedWodIds.has(w.id))

    if (!allWodsConfirmed) {
      const missing = activeWods
        .filter((w) => !confirmedWodIds.has(w.id))
        .map((w) => w.name)
      return NextResponse.json(
        {
          error: "Aún no tienes todos los WODs confirmados",
          missing_wods: missing,
          confirmed: confirmedScores.length,
          total: activeWods.length,
        },
        { status: 403 }
      )
    }

    // Get leaderboard position for this athlete's division
    const division = athlete.division
    const leaderboard: Array<{
      id: string
      overall_rank: number
      total_points: number
      total_athletes: number
    }> = await prisma.$queryRaw`
      WITH wod_rankings AS (
        SELECT
          s.athlete_id,
          s.wod_id,
          w.name as wod_name,
          s.raw_score,
          s.display_score,
          RANK() OVER (
            PARTITION BY s.wod_id
            ORDER BY
              CASE WHEN w.sort_order = 'asc' THEN s.raw_score END ASC,
              CASE WHEN w.sort_order = 'desc' THEN s.raw_score END DESC
          ) as placement
        FROM scores s
        JOIN wods w ON s.wod_id = w.id
        JOIN athletes a ON s.athlete_id = a.id
        WHERE a.division = ${division}
          AND w.is_active = true
          AND s.status = 'confirmed'
      ),
      total_points AS (
        SELECT
          athlete_id,
          SUM(placement)::int as total_points
        FROM wod_rankings
        GROUP BY athlete_id
      )
      SELECT
        a.id,
        RANK() OVER (ORDER BY COALESCE(tp.total_points, 999999) ASC)::int as overall_rank,
        COALESCE(tp.total_points, 0)::int as total_points,
        COUNT(*) OVER ()::int as total_athletes
      FROM athletes a
      LEFT JOIN total_points tp ON a.id = tp.athlete_id
      WHERE a.division = ${division}
      ORDER BY COALESCE(tp.total_points, 999999) ASC
    `

    const athleteRank = leaderboard.find((r) => r.id === athlete.id)
    const totalInDivision = leaderboard.length

    // Get event config
    const config = await prisma.eventConfig.findFirst()

    // Get per-WOD placements
    const placements: Array<{
      wod_id: string
      wod_name: string
      display_score: string
      placement: number
    }> = await prisma.$queryRaw`
      WITH wod_rankings AS (
        SELECT
          s.athlete_id,
          s.wod_id,
          w.name as wod_name,
          w.display_order,
          s.display_score,
          RANK() OVER (
            PARTITION BY s.wod_id
            ORDER BY
              CASE WHEN w.sort_order = 'asc' THEN s.raw_score END ASC,
              CASE WHEN w.sort_order = 'desc' THEN s.raw_score END DESC
          )::int as placement
        FROM scores s
        JOIN wods w ON s.wod_id = w.id
        JOIN athletes a ON s.athlete_id = a.id
        WHERE a.division = ${division}
          AND w.is_active = true
          AND s.status = 'confirmed'
      )
      SELECT wod_id, wod_name, display_score, placement
      FROM wod_rankings
      WHERE athlete_id = ${athlete.id}
      ORDER BY display_order
    `

    return NextResponse.json({
      data: {
        athlete: {
          id: athlete.id,
          full_name: athlete.full_name,
          participant_number: athlete.participant_number,
          division: athlete.division,
          photo_url: athlete.photo_url,
        },
        event: {
          name: config?.name || "GRIZZLYS OPEN 2026",
          start_date: config?.start_date?.toLocaleDateString("es-MX") || "",
          end_date: config?.end_date?.toLocaleDateString("es-MX") || "",
        },
        results: placements,
        overall_rank: Number(athleteRank?.overall_rank ?? 0),
        total_points: Number(athleteRank?.total_points ?? 0),
        total_athletes: totalInDivision,
      },
    })
  } catch (error) {
    console.error("Certificate error:", error)
    return NextResponse.json(
      { error: "Error al generar certificado" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const division = searchParams.get("division") || "rx_male"
  const includePending = searchParams.get("include_pending") === "true"

  const statusFilter = includePending
    ? Prisma.sql``
    : Prisma.sql`AND s.status = 'confirmed'`

  try {
    const leaderboard = await prisma.$queryRaw`
      WITH wod_rankings AS (
        SELECT
          s.athlete_id,
          s.wod_id,
          w.name as wod_name,
          w.sort_order,
          w.display_order,
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
          ${statusFilter}
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
        a.full_name,
        a.division,
        COALESCE(tp.total_points, 0) as total_points,
        RANK() OVER (ORDER BY COALESCE(tp.total_points, 999999) ASC)::int as overall_rank,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'wod_id', wr2.wod_id,
                'wod_name', wr2.wod_name,
                'display_score', wr2.display_score,
                'placement', wr2.placement
              ) ORDER BY wr2.display_order
            )
            FROM wod_rankings wr2
            WHERE wr2.athlete_id = a.id
          ),
          '[]'::json
        ) as wod_results
      FROM athletes a
      LEFT JOIN total_points tp ON a.id = tp.athlete_id
      WHERE a.division = ${division}
      ORDER BY COALESCE(tp.total_points, 999999) ASC, a.full_name ASC
    `

    // Get WOD list for column headers
    const wods = await prisma.wod.findMany({
      where: { is_active: true },
      orderBy: { display_order: "asc" },
      select: { id: true, name: true, score_type: true },
    })

    return NextResponse.json({ data: leaderboard, wods })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Error al calcular leaderboard" }, { status: 500 })
  }
}

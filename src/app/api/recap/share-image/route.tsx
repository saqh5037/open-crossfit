/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og"
import { NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { getDivisionLabel } from "@/lib/divisions"
import { analyzeAthlete, type WodResult } from "@/lib/athlete-insights"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ORANGE = "#FF6600"
const WIDTH = 1080
const HEIGHT = 1350

async function imageToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "image/png"
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const athleteId = request.nextUrl.searchParams.get("id")
    if (!athleteId) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: {
        scores: {
          where: { status: "confirmed" },
          include: { wod: true },
          orderBy: { wod: { display_order: "asc" } },
        },
      },
    })

    if (!athlete || athlete.scores.length === 0) {
      return NextResponse.json({ error: "Athlete not found or no scores" }, { status: 404 })
    }

    // Rankings
    const division = athlete.division
    const isStaff = division === "equipo_grizzlys"
    const divisionFilter = isStaff
      ? Prisma.sql`a.is_staff = true`
      : Prisma.sql`a.division = ${division}`

    const rankingData: Array<{
      athlete_id: string; wod_id: string; wod_name: string; display_order: number
      raw_score: number; display_score: string; placement: number; total_in_div: number
    }> = await prisma.$queryRaw`
      WITH wod_rankings AS (
        SELECT s.athlete_id, s.wod_id, w.name as wod_name, w.display_order,
          s.raw_score::float as raw_score, s.display_score,
          RANK() OVER (PARTITION BY s.wod_id ORDER BY
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,
            CASE WHEN w.sort_order='desc' THEN s.raw_score END DESC
          )::int as placement,
          COUNT(*) OVER (PARTITION BY s.wod_id)::int as total_in_div
        FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id
        WHERE ${divisionFilter} AND a.is_active=true AND w.is_active=true AND s.status='confirmed'
      ) SELECT * FROM wod_rankings WHERE athlete_id=${athlete.id} ORDER BY display_order
    `

    const overallData: Array<{
      athlete_id: string; total_points: number; overall_rank: number; total_athletes: number
    }> = await prisma.$queryRaw`
      WITH wod_rankings AS (
        SELECT s.athlete_id, s.wod_id,
          RANK() OVER (PARTITION BY s.wod_id ORDER BY
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,
            CASE WHEN w.sort_order='desc' THEN s.raw_score END DESC
          ) as placement
        FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id
        WHERE ${divisionFilter} AND a.is_active=true AND w.is_active=true AND s.status='confirmed'
      ),
      athlete_points AS (
        SELECT athlete_id, SUM(GREATEST(0,100-(placement::int-1)*3))::int as total_points
        FROM wod_rankings GROUP BY athlete_id
      ),
      ranked AS (
        SELECT athlete_id, total_points, RANK() OVER (ORDER BY total_points DESC)::int as overall_rank,
          COUNT(*) OVER ()::int as total_athletes
        FROM athlete_points
      ) SELECT * FROM ranked WHERE athlete_id=${athlete.id}
    `

    const overall = overallData[0] || { total_points: 0, overall_rank: 0, total_athletes: 0 }
    const divLabel = getDivisionLabel(division)

    const finisherData: Array<{ display_order: number; finished_count: number }> = await prisma.$queryRaw`
      SELECT w.display_order, COUNT(*)::int as finished_count
      FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id
      WHERE ${divisionFilter} AND a.is_active=true AND w.is_active=true AND s.status='confirmed' AND s.display_score LIKE '%:%'
      GROUP BY w.display_order
    `
    const finishedPerWod: Record<number, number> = {}
    for (const row of finisherData) finishedPerWod[row.display_order] = row.finished_count

    const wodResults: WodResult[] = rankingData.map((r) => ({
      wodName: r.wod_name, displayScore: r.display_score, rawScore: r.raw_score,
      rank: r.placement, totalInDivision: r.total_in_div,
      points: Math.max(0, 100 - (r.placement - 1) * 3),
      isFinished: r.display_score.includes(":"), displayOrder: r.display_order,
    }))

    const insight = analyzeAthlete(
      athlete.full_name, division, athlete.gender as "M" | "F",
      wodResults, overall.overall_rank, overall.total_athletes, 0, finishedPerWod,
    )

    // Load assets
    const fontPath = join(process.cwd(), "public", "fonts", "BebasNeue-Regular.ttf")
    const bebasNeueData = readFileSync(fontPath)
    const logoPath = join(process.cwd(), "public", "logo-200.png")
    const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`

    let photoBase64: string | null = null
    if (athlete.photo_url) photoBase64 = await imageToBase64(athlete.photo_url)

    const rankEmoji = overall.overall_rank === 1 ? "🏆" : overall.overall_rank === 2 ? "🥈" : overall.overall_rank === 3 ? "🥉" : ""

    return new ImageResponse(
      (
        <div style={{
          width: WIDTH, height: HEIGHT, display: "flex", flexDirection: "column",
          backgroundColor: "#0a0a0a", position: "relative", overflow: "hidden",
        }}>
          {/* Background gradient */}
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            background: "radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.15), transparent 60%)",
          }} />

          {/* Top bar */}
          <div style={{
            width: "100%", height: 6, display: "flex",
            background: "linear-gradient(to right, #ff6600, #ff3300, #ff8800)",
          }} />

          {/* Content */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "60px 80px 40px", flex: 1, position: "relative",
          }}>
            {/* Logo */}
            <img src={logoBase64} alt="" width={100} height={100}
              style={{ borderRadius: 16, border: "3px solid rgba(234,88,12,0.5)" }} />

            {/* GRIZZLYS */}
            <div style={{
              fontFamily: "Bebas Neue", fontSize: 72, letterSpacing: "0.08em",
              color: ORANGE, lineHeight: 1, marginTop: 16, display: "flex",
            }}>GRIZZLYS</div>

            <div style={{
              display: "flex", alignItems: "center", gap: 16, marginTop: 12,
            }}>
              <div style={{ width: 48, height: 2, backgroundColor: ORANGE, display: "flex" }} />
              <div style={{
                fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: "0.25em",
                color: "#9ca3af", display: "flex",
              }}>OPEN 2026 — MI RECAP</div>
              <div style={{ width: 48, height: 2, backgroundColor: ORANGE, display: "flex" }} />
            </div>

            {/* Orange divider */}
            <div style={{
              width: "80%", height: 1, marginTop: 32,
              background: "linear-gradient(to right, transparent, #ff6600, transparent)",
              display: "flex",
            }} />

            {/* Photo + Name */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32,
            }}>
              {photoBase64 && (
                <div style={{
                  width: 140, height: 140, borderRadius: "50%",
                  border: "4px solid rgba(234,88,12,0.6)", overflow: "hidden",
                  display: "flex", marginBottom: 20,
                }}>
                  <img src={photoBase64} alt="" width={140} height={140}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
              )}
              <div style={{
                fontFamily: "Bebas Neue", fontSize: 64, letterSpacing: "0.04em",
                color: "#ffffff", textAlign: "center", lineHeight: 1.05, display: "flex",
              }}>{athlete.full_name.toUpperCase()}</div>
              <div style={{
                backgroundColor: ORANGE, color: "#000", borderRadius: 8,
                padding: "6px 28px", fontSize: 18, fontWeight: 700,
                letterSpacing: "0.08em", marginTop: 16, display: "flex",
              }}>{divLabel}</div>
            </div>

            {/* Position block */}
            {overall.overall_rank > 0 && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40,
              }}>
                <div style={{
                  fontSize: 16, fontWeight: 700, letterSpacing: "0.3em",
                  color: ORANGE, display: "flex", textTransform: "uppercase",
                }}>Posición final</div>
                <div style={{
                  fontFamily: "Bebas Neue", fontSize: 140, color: "#fff",
                  lineHeight: 1, marginTop: 4, display: "flex",
                }}>{rankEmoji}#{overall.overall_rank}</div>
                <div style={{
                  fontSize: 22, color: "#9ca3af", display: "flex", marginTop: 4,
                }}>de {overall.total_athletes} atletas  •  {overall.total_points} pts</div>
              </div>
            )}

            {/* WOD Results strip */}
            <div style={{
              display: "flex", gap: 20, marginTop: 40, width: "100%",
              justifyContent: "center",
            }}>
              {wodResults.map((wod) => (
                <div key={wod.wodName} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  backgroundColor: "#111827", borderRadius: 16,
                  border: "1px solid #1f2937", padding: "20px 32px", flex: 1,
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700, letterSpacing: "0.15em",
                    color: ORANGE, display: "flex",
                  }}>{wod.wodName.toUpperCase()}</div>
                  <div style={{
                    fontFamily: "Bebas Neue", fontSize: 48, color: "#fff",
                    lineHeight: 1, marginTop: 8, display: "flex",
                  }}>{wod.displayScore}</div>
                  <div style={{
                    fontSize: 16, color: "#6b7280", marginTop: 6, display: "flex",
                  }}>#{wod.rank} de {wod.totalInDivision}</div>
                </div>
              ))}
            </div>

            {/* Best moment */}
            {insight.bestWod && (
              <div style={{
                marginTop: 36, display: "flex", flexDirection: "column",
                alignItems: "center", width: "100%",
              }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, letterSpacing: "0.2em",
                  color: "#d97706", display: "flex",
                }}>⭐ MEJOR MOMENTO</div>
                <div style={{
                  fontSize: 22, color: "#e5e7eb", marginTop: 8,
                  textAlign: "center", display: "flex", lineHeight: 1.4,
                  maxWidth: 800,
                }}>{insight.bestWodMessage}</div>
              </div>
            )}

            {/* Spacer */}
            <div style={{ flex: 1, display: "flex" }} />

            {/* Bottom */}
            <div style={{
              width: "80%", height: 1, marginBottom: 24,
              background: "linear-gradient(to right, transparent, #ff6600, transparent)",
              display: "flex",
            }} />

            <div style={{
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: "0.2em",
                color: "#6b7280", display: "flex",
              }}>@grizzlysmerida</div>
              <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#374151", display: "flex" }} />
              <div style={{
                fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: "0.2em",
                color: "#4b5563", display: "flex",
              }}>Designed by WBI México</div>
            </div>
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [{ name: "Bebas Neue", data: bebasNeueData, style: "normal" as const, weight: 400 as const }],
      }
    )
  } catch (error) {
    console.error("Share image error:", error)
    return NextResponse.json({ error: "Error generating image" }, { status: 500 })
  }
}

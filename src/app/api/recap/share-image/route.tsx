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

const W = 1080
const H = 1350

async function imageToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return `data:${res.headers.get("content-type") || "image/png"};base64,${Buffer.from(buf).toString("base64")}`
  } catch { return null }
}

export async function GET(request: NextRequest) {
  try {
    const athleteId = request.nextUrl.searchParams.get("id")
    if (!athleteId) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: { scores: { where: { status: "confirmed" }, include: { wod: true }, orderBy: { wod: { display_order: "asc" } } } },
    })
    if (!athlete || athlete.scores.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const division = athlete.division
    const isStaff = division === "equipo_grizzlys"
    const divisionFilter = isStaff ? Prisma.sql`a.is_staff = true` : Prisma.sql`a.division = ${division}`

    const rankingData: Array<{
      athlete_id: string; wod_id: string; wod_name: string; display_order: number
      raw_score: number; display_score: string; placement: number; total_in_div: number
    }> = await prisma.$queryRaw`
      WITH wr AS (
        SELECT s.athlete_id, s.wod_id, w.name as wod_name, w.display_order,
          s.raw_score::float as raw_score, s.display_score,
          RANK() OVER (PARTITION BY s.wod_id ORDER BY
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,
            CASE WHEN w.sort_order='desc' THEN s.raw_score END DESC
          )::int as placement, COUNT(*) OVER (PARTITION BY s.wod_id)::int as total_in_div
        FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id
        WHERE ${divisionFilter} AND a.is_active=true AND w.is_active=true AND s.status='confirmed'
      ) SELECT * FROM wr WHERE athlete_id=${athlete.id} ORDER BY display_order`

    const overallData: Array<{
      athlete_id: string; total_points: number; overall_rank: number; total_athletes: number
    }> = await prisma.$queryRaw`
      WITH wr AS (
        SELECT s.athlete_id, s.wod_id,
          RANK() OVER (PARTITION BY s.wod_id ORDER BY
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,
            CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,
            CASE WHEN w.sort_order='desc' THEN s.raw_score END DESC
          ) as placement
        FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id
        WHERE ${divisionFilter} AND a.is_active=true AND w.is_active=true AND s.status='confirmed'
      ), ap AS (
        SELECT athlete_id, SUM(GREATEST(0,100-(placement::int-1)*3))::int as total_points FROM wr GROUP BY athlete_id
      ), ranked AS (
        SELECT athlete_id, total_points, RANK() OVER (ORDER BY total_points DESC)::int as overall_rank, COUNT(*) OVER()::int as total_athletes FROM ap
      ) SELECT * FROM ranked WHERE athlete_id=${athlete.id}`

    const overall = overallData[0] || { total_points: 0, overall_rank: 0, total_athletes: 0 }
    const divLabel = getDivisionLabel(division)

    const finisherData: Array<{ display_order: number; finished_count: number }> = await prisma.$queryRaw`
      SELECT w.display_order, COUNT(*)::int as finished_count
      FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id
      WHERE ${divisionFilter} AND a.is_active=true AND w.is_active=true AND s.status='confirmed' AND s.display_score LIKE '%:%'
      GROUP BY w.display_order`
    const finishedPerWod: Record<number, number> = {}
    for (const r of finisherData) finishedPerWod[r.display_order] = r.finished_count

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

    const bebasData = readFileSync(join(process.cwd(), "public", "fonts", "BebasNeue-Regular.ttf"))
    const logoB64 = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", "logo-200.png")).toString("base64")}`
    const photoB64 = athlete.photo_url ? await imageToBase64(athlete.photo_url) : null

    const totalReps = insight.totalReps
    const bestWod = insight.bestWod
    const closing = insight.closingMessage

    // WOD card colors
    const wodColors = ["#ea580c", "#16a34a", "#2563eb"]

    return new ImageResponse(
      (
        <div style={{ width: W, height: H, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", backgroundColor: "#000" }}>
          {/* === BACKGROUND LAYERS === */}
          {/* Large radial glow top */}
          <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 1200, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,88,12,0.25) 0%, rgba(234,88,12,0.08) 40%, transparent 70%)", display: "flex" }} />
          {/* Subtle bottom glow */}
          <div style={{ position: "absolute", bottom: -100, left: "50%", transform: "translateX(-50%)", width: 1000, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 60%)", display: "flex" }} />
          {/* Noise texture overlay */}
          <div style={{ position: "absolute", inset: 0, background: "repeating-conic-gradient(rgba(255,255,255,0.01) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px", display: "flex" }} />

          {/* === TOP GRADIENT BAR === */}
          <div style={{ width: "100%", height: 8, display: "flex", background: "linear-gradient(90deg, #ff3d00, #ff6600, #ff8c00, #ff6600, #ff3d00)", flexShrink: 0 }} />

          {/* === MAIN CONTENT === */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 60px 0", position: "relative", flex: 1 }}>

            {/* Logo + Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img src={logoB64} alt="" width={72} height={72} style={{ borderRadius: 14, border: "2px solid rgba(234,88,12,0.4)" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 48, letterSpacing: "0.06em", color: "#ff6600", lineHeight: 1, display: "flex" }}>GRIZZLYS</div>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 16, letterSpacing: "0.3em", color: "#666", display: "flex" }}>OPEN 2026 — RECAP</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.4) 50%, transparent 100%)", marginTop: 36, display: "flex" }} />

            {/* === ATHLETE BLOCK === */}
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 36, width: "100%" }}>
              {/* Photo */}
              {photoB64 ? (
                <div style={{ width: 160, height: 160, borderRadius: "50%", border: "4px solid rgba(234,88,12,0.5)", overflow: "hidden", display: "flex", flexShrink: 0, boxShadow: "0 0 40px rgba(234,88,12,0.2)" }}>
                  <img src={photoB64} alt="" width={160} height={160} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
              ) : (
                <div style={{ width: 160, height: 160, borderRadius: "50%", border: "4px solid rgba(234,88,12,0.3)", background: "linear-gradient(135deg, #1a1a1a, #111)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 56, color: "#ff6600", display: "flex" }}>{athlete.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                </div>
              )}
              {/* Name + Division */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 54, letterSpacing: "0.03em", color: "#fff", lineHeight: 1.05, display: "flex", flexWrap: "wrap" }}>{athlete.full_name.toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <div style={{ backgroundColor: "#ff6600", color: "#000", borderRadius: 6, padding: "4px 16px", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", display: "flex" }}>{divLabel}</div>
                  <div style={{ fontSize: 15, color: "#666", display: "flex" }}>{overall.total_points} puntos</div>
                </div>
              </div>
            </div>

            {/* === POSITION — BIG NUMBER === */}
            {overall.overall_rank > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 40, gap: 8 }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 200, color: "#fff", lineHeight: 0.85, display: "flex", letterSpacing: "-0.02em" }}>#{overall.overall_rank}</div>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: 8 }}>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 24, color: "#ff6600", letterSpacing: "0.15em", display: "flex" }}>POSICIÓN</div>
                  <div style={{ fontSize: 18, color: "#888", display: "flex" }}>de {overall.total_athletes} atletas</div>
                </div>
              </div>
            )}

            {/* === WOD RESULTS CARDS === */}
            <div style={{ display: "flex", gap: 16, marginTop: 36, width: "100%" }}>
              {wodResults.map((wod, i) => (
                <div key={wod.wodName} style={{
                  display: "flex", flexDirection: "column", flex: 1,
                  borderRadius: 20, padding: "24px 20px", position: "relative", overflow: "hidden",
                  background: `linear-gradient(145deg, ${wodColors[i % 3]}15, ${wodColors[i % 3]}08)`,
                  border: `1px solid ${wodColors[i % 3]}30`,
                }}>
                  {/* Glow accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: wodColors[i % 3], display: "flex" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: wodColors[i % 3], display: "flex" }}>{wod.wodName.toUpperCase()}</div>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 52, color: "#fff", lineHeight: 1, marginTop: 8, display: "flex" }}>{wod.displayScore}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <div style={{ fontFamily: "Bebas Neue", fontSize: 22, color: wodColors[i % 3], display: "flex" }}>#{wod.rank}</div>
                    <div style={{ fontSize: 13, color: "#666", display: "flex" }}>de {wod.totalInDivision}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* === STATS ROW === */}
            <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 40, color: "#ff6600", lineHeight: 1, display: "flex" }}>{totalReps.toLocaleString()}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#666", fontWeight: 700, marginTop: 4, display: "flex" }}>REPS TOTALES</div>
              </div>
              {bestWod && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 40, color: "#fbbf24", lineHeight: 1, display: "flex" }}>{bestWod.displayScore}</div>
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#666", fontWeight: 700, marginTop: 4, display: "flex" }}>MEJOR WOD</div>
                </div>
              )}
            </div>

            {/* === CLOSING QUOTE === */}
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "24px 32px", borderRadius: 16, background: "linear-gradient(135deg, rgba(234,88,12,0.06), rgba(234,88,12,0.02))", border: "1px solid rgba(234,88,12,0.12)" }}>
              <div style={{ fontSize: 20, color: "#d4d4d4", textAlign: "center", lineHeight: 1.5, fontStyle: "italic", display: "flex", maxWidth: 800 }}>&ldquo;{closing}&rdquo;</div>
            </div>

            {/* === SPACER === */}
            <div style={{ flex: 1, display: "flex" }} />

            {/* === FOOTER === */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 48, gap: 12 }}>
              <div style={{ width: 200, height: 1, background: "linear-gradient(90deg, transparent, rgba(234,88,12,0.3), transparent)", display: "flex" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: "0.15em", color: "#555", display: "flex" }}>@grizzlysmerida</div>
                <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#333", display: "flex" }} />
                <div style={{ fontFamily: "Bebas Neue", fontSize: 16, letterSpacing: "0.15em", color: "#444", display: "flex" }}>WBI México</div>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: W, height: H, fonts: [{ name: "Bebas Neue", data: bebasData, style: "normal" as const, weight: 400 as const }] }
    )
  } catch (error) {
    console.error("Share image error:", error)
    return NextResponse.json({ error: "Error generating image" }, { status: 500 })
  }
}

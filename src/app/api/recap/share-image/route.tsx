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

const W = 1080, H = 1350
const OG = "#FF6600"
const wodAccent = ["#ea580c", "#16a34a", "#2563eb"]

async function img2b64(url: string): Promise<string | null> {
  try { const r = await fetch(url); if (!r.ok) return null; return `data:${r.headers.get("content-type")||"image/png"};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}` } catch { return null }
}

interface D {
  name: string; photo: string | null; divLabel: string; rank: number; totalAthletes: number; totalPts: number
  wods: WodResult[]; totalReps: number; bestWod: WodResult | null; bestMsg: string; closing: string
  storyBullets: string[]; logoB64: string; initials: string
}

// ═══════════════════════ VARIANT 1 — EL RANKING ═══════════════════════
function V1(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
      {/* Spotlight glow */}
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0.05) 40%, transparent 70%)", display: "flex" }} />
      {/* Top bar */}
      <div style={{ width: "100%", height: 6, background: `linear-gradient(90deg, transparent, ${OG}, transparent)`, display: "flex", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 60px", flex: 1, position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={d.logoB64} alt="" width={48} height={48} style={{ borderRadius: 10 }} />
          <div style={{ fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: "0.3em", color: "#555", display: "flex" }}>GRIZZLYS OPEN 2026</div>
        </div>
        {/* Athlete row */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: 36, gap: 24 }}>
          <div style={{ width: 5, height: 64, backgroundColor: OG, borderRadius: 4, display: "flex", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 56, color: "#fff", lineHeight: 1, display: "flex" }}>{d.name.toUpperCase()}</div>
            <div style={{ fontSize: 16, color: "#666", marginTop: 6, display: "flex" }}>{d.divLabel}</div>
          </div>
          {d.photo ? (
            <div style={{ width: 90, height: 90, borderRadius: "50%", border: `3px solid ${OG}40`, overflow: "hidden", display: "flex", flexShrink: 0 }}>
              <img src={d.photo} alt="" width={90} height={90} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          ) : null}
        </div>
        {/* GIANT NUMBER */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", marginTop: -20 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 360, color: "#fff", lineHeight: 0.8, display: "flex", letterSpacing: "-0.03em", textShadow: `4px 4px 0 ${OG}` }}>#{d.rank}</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 28, letterSpacing: "0.3em", color: OG, display: "flex", marginTop: 8 }}>POSICIÓN GENERAL</div>
          <div style={{ fontSize: 20, color: "#888", display: "flex", marginTop: 8 }}>de {d.totalAthletes} atletas  •  {d.totalPts} puntos</div>
        </div>
        {/* WOD points strip */}
        <div style={{ display: "flex", width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid #222" }}>
          {d.wods.map((w, i) => (
            <div key={w.wodName} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, padding: "20px 0", borderRight: i < d.wods.length - 1 ? "1px solid #222" : "none", background: `${wodAccent[i]}08` }}>
              <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#666", fontWeight: 700, display: "flex" }}>{w.wodName.toUpperCase()}</div>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 44, color: "#fff", lineHeight: 1, marginTop: 6, display: "flex" }}>{w.displayScore}</div>
              <div style={{ fontSize: 13, color: wodAccent[i], marginTop: 4, display: "flex", fontWeight: 700 }}>#{w.rank} • {w.points}pts</div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.15em", color: "#444", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
        </div>
      </div>
      <div style={{ width: "100%", height: 6, background: `linear-gradient(90deg, transparent, ${OG}, transparent)`, display: "flex", flexShrink: 0 }} />
    </div>
  )
}

// ═══════════════════════ VARIANT 2 — LA HISTORIA ═══════════════════════
function V2(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: "#0a0a0a", position: "relative", overflow: "hidden" }}>
      {/* Warm glow */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 1000, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 60%)", display: "flex" }} />
      {/* Top bar */}
      <div style={{ width: "100%", height: 6, background: `linear-gradient(90deg, #ff3d00, ${OG}, #ff8c00)`, display: "flex", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 72px", flex: 1, position: "relative" }}>
        {/* Small logo */}
        <img src={d.logoB64} alt="" width={56} height={56} style={{ borderRadius: 12, border: `2px solid ${OG}30` }} />
        {/* Photo */}
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {d.photo ? (
            <div style={{ width: 140, height: 140, borderRadius: "50%", border: `4px solid ${OG}50`, overflow: "hidden", display: "flex", boxShadow: `0 0 50px ${OG}20` }}>
              <img src={d.photo} alt="" width={140} height={140} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          ) : (
            <div style={{ width: 140, height: 140, borderRadius: "50%", border: `4px solid ${OG}30`, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 48, color: OG, display: "flex" }}>{d.initials}</div>
            </div>
          )}
          <div style={{ fontFamily: "Bebas Neue", fontSize: 36, color: "#fff", marginTop: 16, display: "flex" }}>{d.name.toUpperCase()}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4, display: "flex" }}>#{d.rank} de {d.totalAthletes} • {d.divLabel}</div>
        </div>
        {/* Dots separator */}
        <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: `${OG}60`, display: "flex" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: OG, display: "flex" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: `${OG}60`, display: "flex" }} />
        </div>
        {/* BIG QUOTE */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32, flex: 1, justifyContent: "center", maxWidth: 900, position: "relative" }}>
          {/* Open quote mark */}
          <div style={{ fontFamily: "Bebas Neue", fontSize: 140, color: `${OG}15`, lineHeight: 0.6, display: "flex", position: "absolute", top: -20, left: 0 }}>&ldquo;</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 44, color: "#e5e5e5", textAlign: "center", lineHeight: 1.3, display: "flex", padding: "0 40px" }}>{d.closing}</div>
          {/* Close quote mark */}
          <div style={{ fontFamily: "Bebas Neue", fontSize: 140, color: `${OG}15`, lineHeight: 0.6, display: "flex", position: "absolute", bottom: -60, right: 0 }}>&rdquo;</div>
        </div>
        {/* Best moment card */}
        {d.bestWod && (
          <div style={{ display: "flex", width: "100%", borderRadius: 14, overflow: "hidden", marginTop: 20 }}>
            <div style={{ width: 5, backgroundColor: "#fbbf24", display: "flex", flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "18px 24px", background: "#111" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#fbbf24", fontWeight: 700, display: "flex" }}>MEJOR MOMENTO</div>
                <div style={{ fontSize: 16, color: "#999", marginTop: 4, display: "flex" }}>{d.bestWod.wodName}</div>
              </div>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 44, color: "#fff", display: "flex" }}>{d.bestWod.displayScore}</div>
            </div>
          </div>
        )}
        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.15em", color: "#444", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#333", display: "flex" }} />
          <div style={{ fontSize: 12, letterSpacing: "0.15em", color: "#333", display: "flex" }}>WBI México</div>
        </div>
      </div>
      <div style={{ width: "100%", height: 6, background: `linear-gradient(90deg, #ff3d00, ${OG}, #ff8c00)`, display: "flex", flexShrink: 0 }} />
    </div>
  )
}

// ═══════════════════════ VARIANT 3 — EL DESGLOSE ═══════════════════════
function V3(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: "#060606", position: "relative", overflow: "hidden" }}>
      {/* Top accent */}
      <div style={{ width: "100%", height: 6, background: `linear-gradient(90deg, ${wodAccent[0]}, ${wodAccent[1]}, ${wodAccent[2]})`, display: "flex", flexShrink: 0 }} />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "28px 56px", gap: 16 }}>
        <img src={d.logoB64} alt="" width={44} height={44} style={{ borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, color: "#fff", lineHeight: 1, display: "flex" }}>{d.name.toUpperCase()}</div>
          <div style={{ fontSize: 13, color: "#666", display: "flex", marginTop: 2 }}>{d.divLabel}</div>
        </div>
        {d.rank > 0 && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 48, color: OG, lineHeight: 1, display: "flex" }}>#{d.rank}</div>
            <div style={{ fontSize: 14, color: "#666", display: "flex" }}>/{d.totalAthletes}</div>
          </div>
        )}
      </div>
      {/* WOD LANES */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 56px", gap: 3 }}>
        {d.wods.map((w, i) => (
          <div key={w.wodName} style={{
            display: "flex", flex: 1, borderRadius: 20, overflow: "hidden", position: "relative",
            background: `linear-gradient(135deg, ${wodAccent[i]}12, ${wodAccent[i]}04)`,
            border: `1px solid ${wodAccent[i]}20`,
          }}>
            {/* Left accent */}
            <div style={{ width: 6, backgroundColor: wodAccent[i], display: "flex", flexShrink: 0, borderRadius: "20px 0 0 20px" }} />
            {/* Content */}
            <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 40px" }}>
              {/* WOD name */}
              <div style={{ display: "flex", flexDirection: "column", width: 180, flexShrink: 0 }}>
                <div style={{ fontSize: 13, letterSpacing: "0.25em", color: wodAccent[i], fontWeight: 700, display: "flex" }}>{w.wodName.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4, display: "flex" }}>#{w.rank} de {w.totalInDivision}</div>
              </div>
              {/* Score — big */}
              <div style={{ fontFamily: "Bebas Neue", fontSize: 96, color: "#fff", lineHeight: 1, display: "flex", flex: 1, justifyContent: "center" }}>{w.displayScore}</div>
              {/* Points */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: 100, flexShrink: 0 }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 48, color: wodAccent[i], lineHeight: 1, display: "flex" }}>{w.points}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#555", fontWeight: 700, display: "flex" }}>PUNTOS</div>
              </div>
            </div>
            {/* Large watermark number */}
            <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", fontFamily: "Bebas Neue", fontSize: 220, color: `${wodAccent[i]}06`, lineHeight: 1, display: "flex" }}>0{i + 1}</div>
          </div>
        ))}
      </div>
      {/* Stats footer */}
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 56px 20px", gap: 40, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 36, color: OG, lineHeight: 1, display: "flex" }}>{d.totalReps.toLocaleString()}</div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#555", fontWeight: 700, display: "flex" }}>REPS TOTALES</div>
        </div>
        <div style={{ width: 1, height: 32, backgroundColor: "#222", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 36, color: "#fff", lineHeight: 1, display: "flex" }}>{d.totalPts}</div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#555", fontWeight: 700, display: "flex" }}>PUNTOS</div>
        </div>
        <div style={{ width: 1, height: 32, backgroundColor: "#222", display: "flex" }} />
        <div style={{ fontSize: 14, letterSpacing: "0.12em", color: "#444", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
      </div>
      <div style={{ width: "100%", height: 6, background: `linear-gradient(90deg, ${wodAccent[0]}, ${wodAccent[1]}, ${wodAccent[2]})`, display: "flex", flexShrink: 0 }} />
    </div>
  )
}

// ═══════════════════════ VARIANT 4 — EL SELLO ═══════════════════════
function V4(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", inset: 24, borderRadius: 32, border: `1px solid ${OG}25`, display: "flex" }} />
      <div style={{ position: "absolute", inset: 32, borderRadius: 28, border: `1px solid ${OG}12`, display: "flex" }} />
      {/* Center glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${OG}15, transparent 60%)`, display: "flex" }} />
      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 80px", flex: 1, position: "relative" }}>
        {/* Brand */}
        <div style={{ fontFamily: "Bebas Neue", fontSize: 44, letterSpacing: "0.1em", color: OG, lineHeight: 1, display: "flex" }}>GRIZZLYS</div>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 16, letterSpacing: "0.4em", color: "#555", marginTop: 6, display: "flex" }}>CROSSFIT OPEN 2026</div>
        {/* Divider */}
        <div style={{ width: 200, height: 1, background: `linear-gradient(90deg, transparent, ${OG}50, transparent)`, marginTop: 28, display: "flex" }} />
        {/* Photo big */}
        <div style={{ marginTop: 32, display: "flex" }}>
          {d.photo ? (
            <div style={{ width: 200, height: 200, borderRadius: "50%", border: `5px solid ${OG}60`, overflow: "hidden", display: "flex", boxShadow: `0 0 60px ${OG}25, 0 0 120px ${OG}10` }}>
              <img src={d.photo} alt="" width={200} height={200} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: "50%", border: `5px solid ${OG}40`, background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${OG}15` }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 72, color: OG, display: "flex" }}>{d.initials}</div>
            </div>
          )}
        </div>
        {/* Name */}
        <div style={{ fontFamily: "Bebas Neue", fontSize: 52, color: "#fff", marginTop: 24, textAlign: "center", lineHeight: 1.05, display: "flex" }}>{d.name.toUpperCase()}</div>
        <div style={{ backgroundColor: OG, color: "#000", borderRadius: 6, padding: "5px 20px", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", marginTop: 12, display: "flex" }}>{d.divLabel}</div>
        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginTop: 36, width: "100%" }}>
          {[
            { val: `#${d.rank}`, lbl: "POSICIÓN" },
            { val: `${d.totalPts}`, lbl: "PUNTOS" },
            { val: d.totalReps.toLocaleString(), lbl: "REPS" },
          ].map((s) => (
            <div key={s.lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, padding: "20px 16px", borderRadius: 16, background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 44, color: OG, lineHeight: 1, display: "flex" }}>{s.val}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#555", fontWeight: 700, marginTop: 6, display: "flex" }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        {/* Divider */}
        <div style={{ width: 200, height: 1, background: `linear-gradient(90deg, transparent, ${OG}30, transparent)`, marginTop: 28, display: "flex" }} />
        {/* Best WOD */}
        {d.bestWod && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#fbbf24", fontWeight: 700, display: "flex" }}>MEJOR MOMENTO</div>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 28, color: "#fff", display: "flex" }}>{d.bestWod.wodName} — {d.bestWod.displayScore}</div>
          </div>
        )}
        {/* Quote */}
        <div style={{ fontSize: 17, color: "#777", fontStyle: "italic", textAlign: "center", marginTop: 20, lineHeight: 1.5, display: "flex", maxWidth: 700 }}>&ldquo;{d.closing.length > 100 ? d.closing.slice(0, 100) + "..." : d.closing}&rdquo;</div>
        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />
        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.15em", color: "#444", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#333", display: "flex" }} />
          <div style={{ fontSize: 12, color: "#333", display: "flex" }}>WBI México</div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════ MAIN HANDLER ═══════════════════════
export async function GET(request: NextRequest) {
  try {
    const athleteId = request.nextUrl.searchParams.get("id")
    const variant = parseInt(request.nextUrl.searchParams.get("v") || "1")
    if (!athleteId) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: { scores: { where: { status: "confirmed" }, include: { wod: true }, orderBy: { wod: { display_order: "asc" } } } },
    })
    if (!athlete || athlete.scores.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const division = athlete.division
    const isStaff = division === "equipo_grizzlys"
    const df = isStaff ? Prisma.sql`a.is_staff = true` : Prisma.sql`a.division = ${division}`

    const rankingData: Array<{ athlete_id: string; wod_id: string; wod_name: string; display_order: number; raw_score: number; display_score: string; placement: number; total_in_div: number }> = await prisma.$queryRaw`
      WITH wr AS (SELECT s.athlete_id,s.wod_id,w.name as wod_name,w.display_order,s.raw_score::float as raw_score,s.display_score,RANK()OVER(PARTITION BY s.wod_id ORDER BY CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,CASE WHEN w.sort_order='asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,CASE WHEN w.sort_order='desc' THEN s.raw_score END DESC)::int as placement,COUNT(*)OVER(PARTITION BY s.wod_id)::int as total_in_div FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id WHERE ${df} AND a.is_active=true AND w.is_active=true AND s.status='confirmed') SELECT * FROM wr WHERE athlete_id=${athlete.id} ORDER BY display_order`

    const overallData: Array<{ athlete_id: string; total_points: number; overall_rank: number; total_athletes: number }> = await prisma.$queryRaw`
      WITH wr AS (SELECT s.athlete_id,s.wod_id,RANK()OVER(PARTITION BY s.wod_id ORDER BY CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,CASE WHEN w.sort_order='asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,CASE WHEN w.sort_order='asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,CASE WHEN w.sort_order='desc' THEN s.raw_score END DESC) as placement FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id WHERE ${df} AND a.is_active=true AND w.is_active=true AND s.status='confirmed'),ap AS(SELECT athlete_id,SUM(GREATEST(0,100-(placement::int-1)*3))::int as total_points FROM wr GROUP BY athlete_id),ranked AS(SELECT athlete_id,total_points,RANK()OVER(ORDER BY total_points DESC)::int as overall_rank,COUNT(*)OVER()::int as total_athletes FROM ap)SELECT * FROM ranked WHERE athlete_id=${athlete.id}`

    const overall = overallData[0] || { total_points: 0, overall_rank: 0, total_athletes: 0 }

    const finisherData: Array<{ display_order: number; finished_count: number }> = await prisma.$queryRaw`SELECT w.display_order,COUNT(*)::int as finished_count FROM scores s JOIN wods w ON s.wod_id=w.id JOIN athletes a ON s.athlete_id=a.id WHERE ${df} AND a.is_active=true AND w.is_active=true AND s.status='confirmed' AND s.display_score LIKE '%:%' GROUP BY w.display_order`
    const fMap: Record<number, number> = {}
    for (const r of finisherData) fMap[r.display_order] = r.finished_count

    const wods: WodResult[] = rankingData.map((r) => ({ wodName: r.wod_name, displayScore: r.display_score, rawScore: r.raw_score, rank: r.placement, totalInDivision: r.total_in_div, points: Math.max(0, 100 - (r.placement - 1) * 3), isFinished: r.display_score.includes(":"), displayOrder: r.display_order }))

    const insight = analyzeAthlete(athlete.full_name, division, athlete.gender as "M" | "F", wods, overall.overall_rank, overall.total_athletes, 0, fMap)

    const bebasData = readFileSync(join(process.cwd(), "public", "fonts", "BebasNeue-Regular.ttf"))
    const logoB64 = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", "logo-200.png")).toString("base64")}`
    const photoB64 = athlete.photo_url ? await img2b64(athlete.photo_url) : null

    const d: D = {
      name: athlete.full_name, photo: photoB64, divLabel: getDivisionLabel(division),
      rank: overall.overall_rank, totalAthletes: overall.total_athletes, totalPts: overall.total_points,
      wods, totalReps: insight.totalReps, bestWod: insight.bestWod, bestMsg: insight.bestWodMessage,
      closing: insight.closingMessage, storyBullets: insight.storyBullets, logoB64,
      initials: athlete.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2),
    }

    const renders: Record<number, React.ReactElement> = { 1: V1(d), 2: V2(d), 3: V3(d), 4: V4(d) }
    const jsx = renders[variant] || renders[1]

    return new ImageResponse(jsx, { width: W, height: H, fonts: [{ name: "Bebas Neue", data: bebasData, style: "normal" as const, weight: 400 as const }] })
  } catch (error) {
    console.error("Share image error:", error)
    return NextResponse.json({ error: "Error generating image" }, { status: 500 })
  }
}

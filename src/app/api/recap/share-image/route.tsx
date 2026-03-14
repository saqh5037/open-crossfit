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
const wC = ["#ea580c", "#16a34a", "#2563eb"]

async function img2b64(url: string): Promise<string | null> {
  try { const r = await fetch(url); if (!r.ok) return null; return `data:${r.headers.get("content-type")||"image/png"};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}` } catch { return null }
}

interface D {
  name: string; photo: string | null; divLabel: string; rank: number; totalAthletes: number; totalPts: number
  wods: WodResult[]; totalReps: number; bestWod: WodResult | null; bestMsg: string; closing: string; logoB64: string; initials: string
}

// ═══════════════════════ V1 — MI POSICIÓN ═══════════════════════
function V1(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: "#050505", position: "relative", overflow: "hidden" }}>
      {/* Geometric radiating lines */}
      <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, display: "flex" }}>
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", width: 900, height: 1, background: `linear-gradient(90deg, transparent 0%, ${OG}08 30%, ${OG}15 50%, ${OG}08 70%, transparent 100%)`, transform: `translate(-50%,-50%) rotate(${deg}deg)`, display: "flex" }} />
        ))}
      </div>
      {/* Big center glow */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${OG}20 0%, ${OG}08 30%, transparent 60%)`, display: "flex" }} />
      {/* Top fire bar */}
      <div style={{ width: "100%", height: 8, background: `linear-gradient(90deg, #ff3d00, ${OG}, #ffab00, ${OG}, #ff3d00)`, display: "flex", flexShrink: 0 }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 64px", flex: 1, position: "relative" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 16 }}>
          <img src={d.logoB64} alt="" width={48} height={48} style={{ borderRadius: 10 }} />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: "0.25em", color: "#555", display: "flex" }}>GRIZZLYS OPEN 2026</div>
          </div>
        </div>

        {/* Photo + Name row */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: 24, gap: 20 }}>
          {d.photo ? (
            <div style={{ width: 100, height: 100, borderRadius: "50%", border: `3px solid ${OG}60`, overflow: "hidden", display: "flex", flexShrink: 0, boxShadow: `0 0 30px ${OG}30` }}>
              <img src={d.photo} alt="" width={100} height={100} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 48, color: "#fff", lineHeight: 1, display: "flex" }}>{d.name.toUpperCase()}</div>
            <div style={{ fontSize: 15, color: "#666", marginTop: 6, display: "flex" }}>{d.divLabel} • {d.totalPts} puntos</div>
          </div>
        </div>

        {/* ═══ THE GIANT NUMBER ═══ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center" }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 400, color: "#fff", lineHeight: 0.75, display: "flex", letterSpacing: "-0.04em" }}>#{d.rank}</div>
          {/* Underline accent */}
          <div style={{ width: 180, height: 6, backgroundColor: OG, borderRadius: 4, marginTop: 12, display: "flex" }} />
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, letterSpacing: "0.4em", color: OG, display: "flex", marginTop: 16 }}>POSICIÓN</div>
          <div style={{ fontSize: 22, color: "#777", display: "flex", marginTop: 8 }}>de {d.totalAthletes} atletas</div>
        </div>

        {/* WOD strip */}
        <div style={{ display: "flex", width: "100%", gap: 12 }}>
          {d.wods.map((w, i) => (
            <div key={w.wodName} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, padding: "20px 12px", borderRadius: 16, background: `linear-gradient(180deg, ${wC[i]}18, ${wC[i]}06)`, border: `1px solid ${wC[i]}25` }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: wC[i], fontWeight: 700, display: "flex" }}>{w.wodName.toUpperCase()}</div>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 40, color: "#fff", lineHeight: 1, marginTop: 6, display: "flex" }}>{w.displayScore}</div>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 18, color: wC[i], marginTop: 4, display: "flex" }}>#{w.rank}</div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.15em", color: "#444", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
        </div>
      </div>
      <div style={{ width: "100%", height: 8, background: `linear-gradient(90deg, #ff3d00, ${OG}, #ffab00, ${OG}, #ff3d00)`, display: "flex", flexShrink: 0 }} />
    </div>
  )
}

// ═══════════════════════ V2 — MI HISTORIA ═══════════════════════
function V2(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #0f0a04 0%, #0a0702 50%, #0d0805 100%)" }}>
      {/* Warm ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,0,0.06) 0%, transparent 60%)", display: "flex" }} />
      {/* Top bar gold */}
      <div style={{ width: "100%", height: 6, background: "linear-gradient(90deg, transparent, #d97706, #fbbf24, #d97706, transparent)", display: "flex", flexShrink: 0 }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 72px", flex: 1, position: "relative" }}>
        {/* Logo small */}
        <img src={d.logoB64} alt="" width={48} height={48} style={{ borderRadius: 10, opacity: 0.7 }} />

        {/* Photo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 28 }}>
          {d.photo ? (
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "3px solid rgba(251,191,36,0.35)", overflow: "hidden", display: "flex", flexShrink: 0, boxShadow: "0 0 40px rgba(251,191,36,0.15)" }}>
              <img src={d.photo} alt="" width={120} height={120} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 42, color: "#fff", lineHeight: 1, display: "flex" }}>{d.name.toUpperCase()}</div>
            <div style={{ fontSize: 14, color: "#665533", marginTop: 6, display: "flex" }}>#{d.rank} de {d.totalAthletes} • {d.divLabel}</div>
          </div>
        </div>

        {/* Gold dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
          {[0.3, 0.6, 1, 0.6, 0.3].map((o, i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#fbbf24", opacity: o, display: "flex" }} />
          ))}
        </div>

        {/* ═══ BIG QUOTE ═══ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", position: "relative", maxWidth: 880, padding: "0 20px" }}>
          {/* Giant open quote */}
          <div style={{ fontFamily: "Bebas Neue", fontSize: 200, color: "rgba(251,191,36,0.1)", lineHeight: 0.5, display: "flex", position: "absolute", top: -20, left: -10 }}>&ldquo;</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 52, color: "#f5f0e8", textAlign: "center", lineHeight: 1.25, display: "flex", position: "relative" }}>
            {d.closing.toUpperCase()}
          </div>
          {/* Giant close quote */}
          <div style={{ fontFamily: "Bebas Neue", fontSize: 200, color: "rgba(251,191,36,0.1)", lineHeight: 0.5, display: "flex", position: "absolute", bottom: -80, right: -10 }}>&rdquo;</div>
        </div>

        {/* Best moment */}
        {d.bestWod && (
          <div style={{ display: "flex", width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div style={{ width: 5, backgroundColor: "#fbbf24", display: "flex", flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "20px 28px", background: "rgba(251,191,36,0.04)" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#fbbf24", fontWeight: 700, display: "flex" }}>MEJOR MOMENTO</div>
                <div style={{ fontSize: 15, color: "#887755", marginTop: 4, display: "flex" }}>{d.bestWod.wodName} — #{d.bestWod.rank} de {d.bestWod.totalInDivision}</div>
              </div>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 48, color: "#fbbf24", display: "flex" }}>{d.bestWod.displayScore}</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 28 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.12em", color: "#443322", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#332211", display: "flex" }} />
          <div style={{ fontSize: 12, color: "#332211", display: "flex" }}>WBI México</div>
        </div>
      </div>
      <div style={{ width: "100%", height: 6, background: "linear-gradient(90deg, transparent, #d97706, #fbbf24, #d97706, transparent)", display: "flex", flexShrink: 0 }} />
    </div>
  )
}

// ═══════════════════════ V3 — MIS WODS ═══════════════════════
function V3(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: "#050505", position: "relative", overflow: "hidden" }}>
      {/* Rainbow top bar */}
      <div style={{ width: "100%", height: 8, background: `linear-gradient(90deg, ${wC[0]}, ${wC[1]}, ${wC[2]})`, display: "flex", flexShrink: 0 }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "24px 48px", gap: 14 }}>
        <img src={d.logoB64} alt="" width={44} height={44} style={{ borderRadius: 8 }} />
        {d.photo ? (
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", overflow: "hidden", display: "flex", flexShrink: 0 }}>
            <img src={d.photo} alt="" width={56} height={56} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
        ) : null}
        <div style={{ fontFamily: "Bebas Neue", fontSize: 30, color: "#fff", lineHeight: 1, display: "flex", flex: 1 }}>{d.name.toUpperCase()}</div>
        {d.rank > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 18px", borderRadius: 8, backgroundColor: `${OG}18`, border: `1px solid ${OG}30` }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 32, color: OG, lineHeight: 1, display: "flex" }}>#{d.rank}</div>
            <div style={{ fontSize: 13, color: "#888", display: "flex" }}>/{d.totalAthletes}</div>
          </div>
        )}
      </div>

      {/* ═══ WOD LANES ═══ */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 48px", gap: 8 }}>
        {d.wods.map((w, i) => {
          const pct = Math.round((1 - (w.rank - 1) / Math.max(w.totalInDivision - 1, 1)) * 100)
          return (
            <div key={w.wodName} style={{
              display: "flex", flexDirection: "column", flex: 1, borderRadius: 24, overflow: "hidden", position: "relative",
              background: `linear-gradient(135deg, ${wC[i]}10, transparent)`, border: `1px solid ${wC[i]}20`,
            }}>
              {/* Top color bar */}
              <div style={{ width: "100%", height: 5, background: `linear-gradient(90deg, ${wC[i]}, ${wC[i]}60)`, display: "flex", flexShrink: 0 }} />

              <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 36px", gap: 24 }}>
                {/* Left: WOD info */}
                <div style={{ display: "flex", flexDirection: "column", width: 140, flexShrink: 0 }}>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: "0.15em", color: wC[i], display: "flex" }}>{w.wodName.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 4, display: "flex" }}>#{w.rank} de {w.totalInDivision}</div>
                  {/* Progress bar */}
                  <div style={{ width: 120, height: 6, borderRadius: 4, backgroundColor: "#1a1a1a", marginTop: 10, display: "flex", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, backgroundColor: wC[i], display: "flex" }} />
                  </div>
                </div>

                {/* Center: SCORE big */}
                <div style={{ fontFamily: "Bebas Neue", fontSize: 110, color: "#fff", lineHeight: 1, display: "flex", flex: 1, justifyContent: "center" }}>{w.displayScore}</div>

                {/* Right: Points */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 90, flexShrink: 0 }}>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 56, color: wC[i], lineHeight: 1, display: "flex" }}>{w.points}</div>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#555", fontWeight: 700, display: "flex" }}>PTS</div>
                </div>
              </div>

              {/* Watermark */}
              <div style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", fontFamily: "Bebas Neue", fontSize: 260, color: `${wC[i]}05`, lineHeight: 1, display: "flex" }}>0{i + 1}</div>
            </div>
          )
        })}
      </div>

      {/* Stats footer */}
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 48px 16px", gap: 36, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, color: OG, lineHeight: 1, display: "flex" }}>{d.totalReps.toLocaleString()}</div>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#555", fontWeight: 700, display: "flex" }}>REPS</div>
        </div>
        <div style={{ width: 1, height: 24, backgroundColor: "#222", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, color: "#fff", lineHeight: 1, display: "flex" }}>{d.totalPts}</div>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#555", fontWeight: 700, display: "flex" }}>PTS</div>
        </div>
        <div style={{ width: 1, height: 24, backgroundColor: "#222", display: "flex" }} />
        <div style={{ fontSize: 13, letterSpacing: "0.12em", color: "#444", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
      </div>
      <div style={{ width: "100%", height: 8, background: `linear-gradient(90deg, ${wC[0]}, ${wC[1]}, ${wC[2]})`, display: "flex", flexShrink: 0 }} />
    </div>
  )
}

// ═══════════════════════ V4 — MI BADGE (gradiente naranja) ═══════════════════════
function V4(d: D) {
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #1a0800 0%, #cc4400 30%, #ff6600 50%, #ff8800 70%, #1a0800 100%)" }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", inset: 28, borderRadius: 36, border: "1px solid rgba(255,255,255,0.12)", display: "flex" }} />
      <div style={{ position: "absolute", inset: 36, borderRadius: 32, border: "1px solid rgba(255,255,255,0.06)", display: "flex" }} />
      {/* Light center */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%)", display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 72px 48px", flex: 1, position: "relative" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={d.logoB64} alt="" width={44} height={44} style={{ borderRadius: 8 }} />
          <div style={{ fontFamily: "Bebas Neue", fontSize: 36, letterSpacing: "0.08em", color: "#fff", lineHeight: 1, display: "flex" }}>GRIZZLYS</div>
        </div>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 14, letterSpacing: "0.4em", color: "rgba(255,255,255,0.5)", marginTop: 6, display: "flex" }}>CROSSFIT OPEN 2026</div>

        {/* Divider */}
        <div style={{ width: 200, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", marginTop: 28, display: "flex" }} />

        {/* ═══ BIG PHOTO ═══ */}
        <div style={{ marginTop: 32, display: "flex" }}>
          {d.photo ? (
            <div style={{ width: 240, height: 240, borderRadius: "50%", border: "5px solid rgba(255,255,255,0.3)", overflow: "hidden", display: "flex", boxShadow: "0 0 80px rgba(0,0,0,0.4), 0 0 120px rgba(255,102,0,0.2)" }}>
              <img src={d.photo} alt="" width={240} height={240} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          ) : (
            <div style={{ width: 240, height: 240, borderRadius: "50%", border: "5px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(0,0,0,0.4)" }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 80, color: "#fff", display: "flex" }}>{d.initials}</div>
            </div>
          )}
        </div>

        {/* Name */}
        <div style={{ fontFamily: "Bebas Neue", fontSize: 60, color: "#fff", marginTop: 28, textAlign: "center", lineHeight: 1.05, display: "flex", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>{d.name.toUpperCase()}</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginTop: 8, display: "flex" }}>{d.divLabel}</div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginTop: 32, width: "100%" }}>
          {[
            { val: `#${d.rank}`, lbl: "POSICIÓN" },
            { val: `${d.totalPts}`, lbl: "PUNTOS" },
            { val: d.totalReps.toLocaleString(), lbl: "REPS" },
          ].map((s) => (
            <div key={s.lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, padding: "20px 12px", borderRadius: 16, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 48, color: "#fff", lineHeight: 1, display: "flex" }}>{s.val}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 700, marginTop: 6, display: "flex" }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Best WOD */}
        {d.bestWod && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 700, display: "flex" }}>MEJOR WOD</div>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 28, color: "#fff", display: "flex" }}>{d.bestWod.wodName} — {d.bestWod.displayScore}</div>
          </div>
        )}

        {/* Quote */}
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", fontStyle: "italic", textAlign: "center", marginTop: 16, lineHeight: 1.5, display: "flex", maxWidth: 700 }}>&ldquo;{d.closing.length > 90 ? d.closing.slice(0, 90) + "..." : d.closing}&rdquo;</div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", fontWeight: 600, display: "flex" }}>@grizzlysmerida</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex" }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", display: "flex" }}>WBI México</div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════ HANDLER ═══════════════════════
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
      closing: insight.closingMessage, logoB64,
      initials: athlete.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2),
    }

    const renders: Record<number, React.ReactElement> = { 1: V1(d), 2: V2(d), 3: V3(d), 4: V4(d) }
    return new ImageResponse(renders[variant] || renders[1], { width: W, height: H, fonts: [{ name: "Bebas Neue", data: bebasData, style: "normal" as const, weight: 400 as const }] })
  } catch (error) {
    console.error("Share image error:", error)
    return NextResponse.json({ error: "Error generating image" }, { status: 500 })
  }
}

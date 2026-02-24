/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"

const ORANGE = "#FF6600"

interface ThemeColors {
  bg: string
  text: string
  textSecondary: string
  textMuted: string
  textFaint: string
  border: string
  cardBg: string
  tableHeaderBg: string
  tableRowEven: string
  tableRowOdd: string
  tableRowBorder: string
  dividerColor: string
}

const darkTheme: ThemeColors = {
  bg: "#0a0a0a",
  text: "#FFFFFF",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  textFaint: "#4b5563",
  border: "#1f2937",
  cardBg: "#111827",
  tableHeaderBg: "#111827",
  tableRowEven: "#0a0a0a",
  tableRowOdd: "#111111",
  tableRowBorder: "#1a1a1a",
  dividerColor: "#374151",
}

const lightTheme: ThemeColors = {
  bg: "#FFFFFF",
  text: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  textFaint: "#d1d5db",
  border: "#e5e7eb",
  cardBg: "#f9fafb",
  tableHeaderBg: "#f3f4f6",
  tableRowEven: "#FFFFFF",
  tableRowOdd: "#f9fafb",
  tableRowBorder: "#e5e7eb",
  dividerColor: "#d1d5db",
}

function getOrdinal(n: number) {
  if (n === 1) return "1ER"
  if (n === 2) return "2DO"
  if (n === 3) return "3ER"
  return `${n}TO`
}

function getRankEmoji(rank: number) {
  if (rank === 1) return "🏆"
  if (rank === 2) return "🥈"
  if (rank === 3) return "🥉"
  return "⭐"
}

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

interface WodResult {
  wod_id: string
  wod_name: string
  display_score: string
  placement: number
  points: number
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { athlete, event, results, overall_rank, total_points, total_athletes, divLabel, theme: themeParam } = data

    const isDark = themeParam !== "light"
    const t = isDark ? darkTheme : lightTheme
    const tableTextColor = isDark ? "#d1d5db" : "#374151"
    const scoreColor = ORANGE
    const pointsColor = isDark ? "#FFFFFF" : "#111827"

    const paddedNumber = String(athlete.participant_number).padStart(3, "0")

    // Load Bebas Neue font
    const fontPath = join(process.cwd(), "public", "fonts", "BebasNeue-Regular.ttf")
    const bebasNeueData = readFileSync(fontPath)

    // Load logo as base64
    const logoPath = join(process.cwd(), "public", "logo-200.png")
    const logoBuffer = readFileSync(logoPath)
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`

    // Load athlete photo as base64 (if exists)
    let photoBase64: string | null = null
    if (athlete.photo_url) {
      photoBase64 = await imageToBase64(athlete.photo_url)
    }

    const WIDTH = 540
    const baseHeight = 850
    const rowHeight = 42
    const photoExtraHeight = photoBase64 ? 130 : 0
    const HEIGHT = baseHeight + (results.length * rowHeight) + photoExtraHeight

    return new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: t.bg,
            position: "relative",
          }}
        >
          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 40px 30px",
              width: "100%",
            }}
          >
            {/* Logo */}
            <img
              src={logoBase64}
              alt=""
              width={80}
              height={80}
              style={{ borderRadius: 8, marginBottom: 12 }}
            />

            {/* Brand name */}
            <div
              style={{
                fontFamily: "Bebas Neue",
                fontSize: 52,
                letterSpacing: "0.05em",
                color: ORANGE,
                lineHeight: 1,
                display: "flex",
              }}
            >
              GRIZZLYS
            </div>

            {/* Decorative line + subtitle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 16,
              }}
            >
              <div style={{ width: 32, height: 2, backgroundColor: ORANGE, display: "flex" }} />
              <div
                style={{
                  fontFamily: "Bebas Neue",
                  fontSize: 14,
                  letterSpacing: "0.2em",
                  color: t.textSecondary,
                  display: "flex",
                }}
              >
                Competencia Interna
              </div>
              <div style={{ width: 32, height: 2, backgroundColor: ORANGE, display: "flex" }} />
            </div>

            {/* Event name */}
            <div
              style={{
                fontFamily: "Bebas Neue",
                fontSize: 26,
                letterSpacing: "0.05em",
                color: t.text,
                marginTop: 8,
                display: "flex",
              }}
            >
              {event.name}
            </div>

            {/* Dates */}
            {event.start_date && event.end_date && (
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4, display: "flex" }}>
                {event.start_date} — {event.end_date}
              </div>
            )}

            {/* Orange divider */}
            <div
              style={{
                width: "75%",
                height: 1,
                background: isDark
                  ? `linear-gradient(to right, transparent, ${ORANGE}, transparent)`
                  : `linear-gradient(to right, ${t.bg}, ${ORANGE}, ${t.bg})`,
                margin: "20px 0",
                display: "flex",
              }}
            />

            {/* Certificate title */}
            <div
              style={{
                fontFamily: "Bebas Neue",
                fontSize: 20,
                letterSpacing: "0.25em",
                color: ORANGE,
                display: "flex",
              }}
            >
              CERTIFICADO DE PARTICIPACIÓN
            </div>
            <div
              style={{
                fontSize: 13,
                fontStyle: "italic",
                color: t.textMuted,
                marginTop: 8,
                display: "flex",
              }}
            >
              Se otorga el presente certificado a
            </div>

            {/* Photo */}
            {photoBase64 && (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  border: `3px solid ${ORANGE}`,
                  overflow: "hidden",
                  marginTop: 20,
                  display: "flex",
                }}
              >
                <img
                  src={photoBase64}
                  alt=""
                  width={96}
                  height={96}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            )}

            {/* Athlete name */}
            <div
              style={{
                fontFamily: "Bebas Neue",
                fontSize: 40,
                letterSpacing: "0.05em",
                color: t.text,
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.1,
                marginTop: 16,
                display: "flex",
              }}
            >
              {athlete.full_name}
            </div>

            {/* Number */}
            <div
              style={{
                fontFamily: "Bebas Neue",
                fontSize: 22,
                letterSpacing: "0.05em",
                color: ORANGE,
                marginTop: 4,
                display: "flex",
              }}
            >
              #{paddedNumber}
            </div>

            {/* Division badge */}
            <div
              style={{
                backgroundColor: ORANGE,
                color: "#000000",
                borderRadius: 6,
                padding: "4px 20px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginTop: 12,
                display: "flex",
              }}
            >
              {divLabel}
            </div>

            {/* Gray divider */}
            <div
              style={{
                width: "50%",
                height: 1,
                background: isDark
                  ? `linear-gradient(to right, transparent, ${t.dividerColor}, transparent)`
                  : `linear-gradient(to right, ${t.bg}, ${t.dividerColor}, ${t.bg})`,
                margin: "20px 0",
                display: "flex",
              }}
            />

            {/* Overall position box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                backgroundColor: t.cardBg,
                padding: "16px 24px",
              }}
            >
              <div style={{ fontSize: 36, display: "flex" }}>
                {getRankEmoji(overall_rank)}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontFamily: "Bebas Neue",
                    fontSize: 32,
                    color: t.text,
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                    display: "flex",
                  }}
                >
                  {getOrdinal(overall_rank)} LUGAR
                </div>
                <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4, display: "flex" }}>
                  de {total_athletes} atletas en {divLabel}
                </div>
                <div
                  style={{
                    fontFamily: "Bebas Neue",
                    fontSize: 20,
                    color: ORANGE,
                    letterSpacing: "0.05em",
                    marginTop: 2,
                    display: "flex",
                  }}
                >
                  {total_points} PUNTOS
                </div>
              </div>
            </div>

            {/* WOD Results */}
            <div style={{ width: "100%", marginTop: 24, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: t.textFaint,
                  textAlign: "center",
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Resultados por WOD
              </div>
              <div
                style={{
                  borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: t.tableHeaderBg,
                    padding: "8px 16px",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: t.textMuted,
                  }}
                >
                  <div style={{ flex: 1, display: "flex" }}>WOD</div>
                  <div style={{ width: 90, display: "flex", justifyContent: "center" }}>Score</div>
                  <div style={{ width: 50, display: "flex", justifyContent: "center" }}>Pos</div>
                  <div style={{ width: 55, display: "flex", justifyContent: "center" }}>Pts</div>
                </div>
                {/* Rows */}
                {(results as WodResult[]).map((r, i) => (
                  <div
                    key={r.wod_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 16px",
                      backgroundColor: i % 2 === 0 ? t.tableRowEven : t.tableRowOdd,
                      borderTop: `1px solid ${t.tableRowBorder}`,
                    }}
                  >
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: tableTextColor, display: "flex" }}>
                      {r.wod_name}
                    </div>
                    <div
                      style={{
                        width: 90,
                        fontSize: 14,
                        fontWeight: 700,
                        color: scoreColor,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {r.display_score}
                    </div>
                    <div style={{ width: 50, fontSize: 12, color: t.textMuted, display: "flex", justifyContent: "center" }}>
                      {r.placement}°
                    </div>
                    <div style={{ width: 55, fontSize: 15, fontWeight: 900, color: pointsColor, display: "flex", justifyContent: "center" }}>
                      {r.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom orange divider */}
            <div
              style={{
                width: "75%",
                height: 1,
                background: isDark
                  ? `linear-gradient(to right, transparent, ${ORANGE}, transparent)`
                  : `linear-gradient(to right, ${t.bg}, ${ORANGE}, ${t.bg})`,
                margin: "24px 0",
                display: "flex",
              }}
            />

            {/* Tagline */}
            <div
              style={{
                fontFamily: "Bebas Neue",
                fontSize: 15,
                letterSpacing: "0.3em",
                color: ORANGE,
                display: "flex",
              }}
            >
              FORJANDO ATLETAS DE ÉLITE
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: t.textFaint,
                marginTop: 12,
                display: "flex",
              }}
            >
              Designed by WBI México
            </div>
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          {
            name: "Bebas Neue",
            data: bebasNeueData,
            style: "normal",
            weight: 400,
          },
        ],
      }
    )
  } catch (error) {
    console.error("Certificate image error:", error)
    return new Response(`Error generating certificate image: ${error}`, { status: 500 })
  }
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDivisionLabel } from "@/lib/divisions"
import { Download, Loader2, AlertCircle, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Brand colors (inline for html2canvas compatibility)
const ORANGE = "#FF6600"
const WHITE = "#ffffff"
const GRAY_300 = "#d1d5db"
const GRAY_400 = "#9ca3af"
const GRAY_500 = "#6b7280"
const GRAY_600 = "#4b5563"
const GRAY_800 = "#1f2937"
const DARK_BG = "#111827"
const BLACK = "#000000"

// Bebas Neue font stack — explicit for html2canvas
const FONT_DISPLAY = "'Bebas Neue', 'Arial Narrow', Impact, sans-serif"
const FONT_BODY = "Inter, -apple-system, sans-serif"
const FONT_MONO = "'Courier New', Courier, monospace"

interface WodResult {
  wod_id: string
  wod_name: string
  display_score: string
  placement: number
  points: number
}

interface CertificateData {
  athlete: {
    id: string
    full_name: string
    participant_number: number
    division: string
    photo_url: string | null
  }
  event: {
    name: string
    start_date: string
    end_date: string
  }
  results: WodResult[]
  overall_rank: number
  total_points: number
  total_athletes: number
}

export default function CertificadoPage() {
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingWods, setMissingWods] = useState<string[]>([])
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const certRef = useRef<HTMLDivElement>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMissingWods([])
    setLoading(true)

    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, birth_date: birthDate }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error)
        if (json.missing_wods) setMissingWods(json.missing_wods)
        setLoading(false)
        return
      }

      setCertificate(json.data)
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    }
    setLoading(false)
  }

  const downloadCertificate = async () => {
    if (!certRef.current || !certificate || downloading) return
    setDownloading(true)
    try {
      const { default: html2canvas } = await import("html2canvas")
      const el = certRef.current
      const canvas = await html2canvas(el, {
        backgroundColor: BLACK,
        scale: 3,
        useCORS: true,
        width: el.scrollWidth,
        height: el.scrollHeight,
      })
      const link = document.createElement("a")
      link.download = `certificado-${certificate.athlete.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const getOrdinal = (n: number) => {
    if (n === 1) return "1ER"
    if (n === 2) return "2DO"
    if (n === 3) return "3ER"
    return `${n}TO`
  }

  // ============ VERIFICATION FORM ============
  if (!certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md border-gray-800 bg-[#111]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex items-center gap-2">
              <Image src="/logo-80.png" alt="GRIZZLYS" width={40} height={40} className="rounded" />
              <span className="font-display text-2xl tracking-wider text-primary">GRIZZLYS</span>
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-lg">
              <Lock className="h-4 w-4 text-gray-500" />
              Descarga tu Certificado
            </CardTitle>
            <p className="text-sm text-gray-500">
              Verifica tu identidad para acceder a tu certificado de participación
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email">Email de registro</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p>{error}</p>
                    {missingWods.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-red-500">WODs faltantes:</p>
                        <ul className="mt-1 list-inside list-disc text-xs text-red-400">
                          {missingWods.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" disabled={loading} className="mt-2">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar y ver certificado"
                )}
              </Button>

              <div className="text-center">
                <Link href="/" className="text-xs text-gray-500 hover:text-primary">
                  Volver al inicio
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============ CERTIFICATE VIEW ============
  const { athlete, event, results, overall_rank, total_points, total_athletes } = certificate
  const divLabel = getDivisionLabel(athlete.division)
  const paddedNumber = String(athlete.participant_number).padStart(3, "0")

  return (
    <div className="flex min-h-screen flex-col items-center bg-black p-4 pb-20">
      {/* Controls */}
      <div className="mb-6 flex w-full max-w-[540px] items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
          Volver al inicio
        </Link>
        <Button
          onClick={downloadCertificate}
          disabled={downloading}
          className="gap-2 bg-primary font-display uppercase tracking-wider text-black hover:bg-orange-500"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Descargar
        </Button>
      </div>

      {/* ====== CERTIFICATE (all inline styles for html2canvas) ====== */}
      <div
        ref={certRef}
        style={{
          position: "relative",
          width: 540,
          overflow: "hidden",
          backgroundColor: BLACK,
          fontFamily: FONT_BODY,
        }}
      >
        {/* Background image */}
        <img
          src="/open2026.png"
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
          }}
          crossOrigin="anonymous"
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 40px 36px",
          }}
        >
          {/* Logo */}
          <img
            src="/logo-200.png"
            alt="GRIZZLYS"
            style={{ width: 80, height: 80, borderRadius: 8, marginBottom: 12 }}
            crossOrigin="anonymous"
          />

          {/* Brand name */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 52,
              letterSpacing: "0.12em",
              color: ORANGE,
              lineHeight: 1,
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
              marginTop: 6,
            }}
          >
            <div style={{ width: 32, height: 2, backgroundColor: ORANGE }} />
            <span
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 14,
                letterSpacing: "0.2em",
                color: GRAY_400,
              }}
            >
              Competencia Interna
            </span>
            <div style={{ width: 32, height: 2, backgroundColor: ORANGE }} />
          </div>

          {/* Event name */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 26,
              letterSpacing: "0.08em",
              color: WHITE,
              marginTop: 8,
            }}
          >
            {event.name}
          </div>

          {/* Dates */}
          {event.start_date && event.end_date && (
            <div
              style={{
                fontSize: 11,
                color: GRAY_500,
                marginTop: 4,
              }}
            >
              {event.start_date} — {event.end_date}
            </div>
          )}

          {/* Orange divider */}
          <div
            style={{
              width: "75%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
              margin: "20px 0",
            }}
          />

          {/* Certificate title */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 20,
              letterSpacing: "0.25em",
              color: ORANGE,
            }}
          >
            CERTIFICADO DE PARTICIPACIÓN
          </div>
          <div
            style={{
              fontSize: 13,
              color: GRAY_500,
              fontStyle: "italic",
              marginTop: 8,
            }}
          >
            Se otorga el presente certificado a
          </div>

          {/* Photo */}
          {athlete.photo_url && (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: `3px solid ${ORANGE}`,
                overflow: "hidden",
                marginTop: 20,
                boxShadow: "0 0 20px rgba(255, 102, 0, 0.3)",
              }}
            >
              <img
                src={athlete.photo_url}
                alt={athlete.full_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Athlete name */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 42,
              letterSpacing: "0.08em",
              color: WHITE,
              textAlign: "center",
              textTransform: "uppercase",
              marginTop: 16,
              lineHeight: 1.1,
            }}
          >
            {athlete.full_name}
          </div>

          {/* Participant number */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              letterSpacing: "0.1em",
              color: ORANGE,
              marginTop: 4,
            }}
          >
            #{paddedNumber}
          </div>

          {/* Division badge — always orange brand color */}
          <div
            style={{
              display: "inline-block",
              padding: "4px 20px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              color: BLACK,
              backgroundColor: ORANGE,
              marginTop: 12,
              letterSpacing: "0.05em",
            }}
          >
            {divLabel}
          </div>

          {/* Gray divider */}
          <div
            style={{
              width: "50%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GRAY_600}, transparent)`,
              margin: "20px 0",
            }}
          />

          {/* Overall position box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 28px",
              borderRadius: 10,
              border: `1px solid ${GRAY_800}`,
              backgroundColor: "rgba(17, 24, 39, 0.6)",
            }}
          >
            {/* Trophy emoji instead of SVG icon (html2canvas compatible) */}
            <div style={{ fontSize: 36, lineHeight: 1 }}>
              {overall_rank === 1 ? "🏆" : overall_rank === 2 ? "🥈" : overall_rank === 3 ? "🥉" : "⭐"}
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 32,
                  letterSpacing: "0.08em",
                  color: WHITE,
                  lineHeight: 1,
                }}
              >
                {getOrdinal(overall_rank)} LUGAR
              </div>
              <div style={{ fontSize: 12, color: GRAY_400, marginTop: 4 }}>
                de {total_athletes} atletas en {divLabel}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 20,
                  letterSpacing: "0.08em",
                  color: ORANGE,
                  marginTop: 2,
                }}
              >
                {total_points} PUNTOS
              </div>
            </div>
          </div>

          {/* WOD Results */}
          <div style={{ width: "100%", marginTop: 24 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: GRAY_600,
                textAlign: "center",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Resultados por WOD
            </div>
            <div
              style={{
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${GRAY_800}`,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  backgroundColor: DARK_BG,
                  padding: "8px 16px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: GRAY_500,
                }}
              >
                <span style={{ flex: 1 }}>WOD</span>
                <span style={{ width: 90, textAlign: "center" }}>Score</span>
                <span style={{ width: 50, textAlign: "center" }}>Pos</span>
                <span style={{ width: 55, textAlign: "center" }}>Pts</span>
              </div>
              {/* Rows */}
              {results.map((r, i) => (
                <div
                  key={r.wod_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    backgroundColor: i % 2 === 0 ? "rgba(0,0,0,0.4)" : "rgba(17,24,39,0.3)",
                    borderTop: `1px solid rgba(31,41,55,0.5)`,
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      color: GRAY_300,
                      fontFamily: FONT_BODY,
                    }}
                  >
                    {r.wod_name}
                  </span>
                  <span
                    style={{
                      width: 90,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: ORANGE,
                      fontFamily: FONT_MONO,
                    }}
                  >
                    {r.display_score}
                  </span>
                  <span
                    style={{
                      width: 50,
                      textAlign: "center",
                      fontSize: 12,
                      color: GRAY_500,
                    }}
                  >
                    {r.placement}°
                  </span>
                  <span
                    style={{
                      width: 55,
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: 900,
                      color: WHITE,
                    }}
                  >
                    {r.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom orange divider */}
          <div
            style={{
              width: "75%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
              margin: "24px 0",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 15,
              letterSpacing: "0.3em",
              color: ORANGE,
            }}
          >
            FORJANDO ATLETAS DE ÉLITE
          </div>

          {/* Footer */}
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: GRAY_600,
              marginTop: 12,
            }}
          >
            crossfit.52-55-189-120.sslip.io
          </div>
        </div>
      </div>
    </div>
  )
}

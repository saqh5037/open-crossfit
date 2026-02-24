"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDivisionLabel, getDivisionBadge } from "@/lib/divisions"
import { Download, Loader2, AlertCircle, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    if (!certRef.current || !certificate) return
    const { default: html2canvas } = await import("html2canvas")
    const canvas = await html2canvas(certRef.current, {
      backgroundColor: "#000000",
      scale: 2,
      useCORS: true,
      width: 816,
      height: 1056,
    })
    const link = document.createElement("a")
    link.download = `certificado-${certificate.athlete.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const getOrdinal = (n: number) => {
    if (n === 1) return "1er"
    if (n === 2) return "2do"
    if (n === 3) return "3er"
    return `${n}to`
  }

  // ============ VERIFICATION FORM ============
  if (!certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
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
  const divBadge = getDivisionBadge(athlete.division)
  const paddedNumber = String(athlete.participant_number).padStart(3, "0")

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#0a0a0a] p-4 pb-20">
      {/* Download controls */}
      <div className="mb-4 flex w-full max-w-[860px] items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-primary">
          Volver al inicio
        </Link>
        <Button onClick={downloadCertificate} className="gap-2">
          <Download className="h-4 w-4" />
          Descargar certificado
        </Button>
      </div>

      {/* Certificate - Letter size 8.5" x 11" */}
      <div
        ref={certRef}
        className="overflow-hidden"
        style={{
          width: 816,
          height: 1056,
          background: "linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)",
          position: "relative",
        }}
      >
        {/* Outer gold border */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            border: "2px solid #D4AF37",
            pointerEvents: "none",
          }}
        />
        {/* Inner gold border */}
        <div
          style={{
            position: "absolute",
            inset: 18,
            border: "1px solid rgba(212, 175, 55, 0.3)",
            pointerEvents: "none",
          }}
        />

        {/* Corner ornaments */}
        {[
          { top: 8, left: 8 },
          { top: 8, right: 8 },
          { bottom: 8, left: 8 },
          { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 24,
              height: 24,
              borderColor: "#D4AF37",
              borderWidth: 3,
              borderStyle: "solid",
              borderTopColor: pos.top !== undefined ? "#D4AF37" : "transparent",
              borderBottomColor: pos.bottom !== undefined ? "#D4AF37" : "transparent",
              borderLeftColor: pos.left !== undefined ? "#D4AF37" : "transparent",
              borderRightColor: pos.right !== undefined ? "#D4AF37" : "transparent",
            }}
          />
        ))}

        {/* Content */}
        <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
          {/* Header - Logo + Event Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
            <img src="/logo-200.png" alt="" style={{ width: 72, height: 72, borderRadius: 8 }} crossOrigin="anonymous" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display), system-ui", fontSize: 40, fontWeight: 800, letterSpacing: "0.1em", color: "#ffffff" }}>
                GRIZZLYS
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", color: "#D4AF37", marginTop: -4 }}>
                CROSSFIT
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "rgba(212, 175, 55, 0.6)", fontWeight: 600, marginBottom: 20 }}>
            FORJANDO ATLETAS DE ÉLITE
          </div>

          {/* Gold divider */}
          <div style={{ width: "70%", height: 1, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)", marginBottom: 20 }} />

          {/* Certificate title */}
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.25em", color: "#D4AF37", marginBottom: 4 }}>
            CERTIFICADO
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "rgba(212, 175, 55, 0.7)", fontWeight: 600, marginBottom: 16 }}>
            DE PARTICIPACIÓN
          </div>

          {/* "Se otorga a" */}
          <div style={{ fontSize: 13, color: "#888", marginBottom: 12, fontStyle: "italic" }}>
            Se otorga el presente certificado a
          </div>

          {/* Photo */}
          {athlete.photo_url && (
            <div style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              border: "3px solid #D4AF37",
              overflow: "hidden",
              marginBottom: 12,
            }}>
              <img
                src={athlete.photo_url}
                alt={athlete.full_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Athlete name */}
          <div style={{
            fontFamily: "var(--font-display), system-ui",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#F5E6A3",
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: 6,
            lineHeight: 1.1,
          }}>
            {athlete.full_name}
          </div>

          {/* Participant number */}
          <div style={{ fontFamily: "var(--font-display), system-ui", fontSize: 18, letterSpacing: "0.1em", color: "#D4AF37", marginBottom: 8 }}>
            #{paddedNumber}
          </div>

          {/* Division badge */}
          <div style={{
            display: "inline-flex",
            padding: "4px 16px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            backgroundColor: divBadge.bgColor || "rgba(255,255,255,0.1)",
            border: divBadge.bgColor ? "none" : "1px solid #555",
            marginBottom: 16,
          }}>
            {divLabel}
          </div>

          {/* Divider */}
          <div style={{ width: "50%", height: 1, background: "linear-gradient(90deg, transparent, #333, transparent)", marginBottom: 16 }} />

          {/* Overall position box */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 28px",
            borderRadius: 12,
            backgroundColor: "rgba(212, 175, 55, 0.08)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#F5E6A3", lineHeight: 1 }}>
              {getOrdinal(overall_rank)}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F5E6A3" }}>
                Lugar General
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                de {total_athletes} atletas en {divLabel}
              </div>
              <div style={{ fontSize: 11, color: "#D4AF37", fontWeight: 700 }}>
                {total_points} puntos totales
              </div>
            </div>
          </div>

          {/* WOD Results table */}
          <div style={{ width: "80%", marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#555", textAlign: "center", marginBottom: 8, textTransform: "uppercase" }}>
              Resultados por WOD
            </div>
            <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #222" }}>
              {/* Table header */}
              <div style={{ display: "flex", backgroundColor: "#161616", padding: "8px 16px", fontSize: 10, fontWeight: 700, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <div style={{ flex: 1 }}>WOD</div>
                <div style={{ width: 100, textAlign: "center" }}>Score</div>
                <div style={{ width: 60, textAlign: "center" }}>Pos.</div>
                <div style={{ width: 60, textAlign: "center" }}>Puntos</div>
              </div>
              {/* Table rows */}
              {results.map((r, i) => (
                <div
                  key={r.wod_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    backgroundColor: i % 2 === 0 ? "#0d0d0d" : "#111",
                    borderTop: "1px solid #1a1a1a",
                  }}
                >
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#ccc" }}>
                    {r.wod_name}
                  </div>
                  <div style={{ width: 100, textAlign: "center", fontSize: 13, fontFamily: "monospace", color: "#D4AF37", fontWeight: 700 }}>
                    {r.display_score}
                  </div>
                  <div style={{ width: 60, textAlign: "center", fontSize: 12, color: "#888" }}>
                    {r.placement}°
                  </div>
                  <div style={{ width: 60, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#F5E6A3" }}>
                    {r.points}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer to push footer down */}
          <div style={{ flex: 1 }} />

          {/* Event info */}
          <div style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 4 }}>
            {event.name}
          </div>
          {event.start_date && event.end_date && (
            <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginBottom: 12 }}>
              {event.start_date} — {event.end_date}
            </div>
          )}

          {/* Bottom gold divider */}
          <div style={{ width: "60%", height: 1, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)", marginBottom: 12 }} />

          {/* Footer */}
          <div style={{ fontSize: 9, color: "#444", textAlign: "center", letterSpacing: "0.1em" }}>
            Certificado generado digitalmente · GRIZZLYS CrossFit · crossfit.52-55-189-120.sslip.io
          </div>
        </div>
      </div>
    </div>
  )
}

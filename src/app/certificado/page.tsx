"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDivisionLabel, getDivisionBadge } from "@/lib/divisions"
import { Download, Loader2, AlertCircle, Trophy, Medal, Star, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface WodResult {
  wod_id: string
  wod_name: string
  display_score: string
  placement: number
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
      scale: 3,
      useCORS: true,
      width: certRef.current.scrollWidth,
      height: certRef.current.scrollHeight,
    })
    const link = document.createElement("a")
    link.download = `certificado-${certificate.athlete.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6" style={{ color: "#FFD700" }} />
    if (rank === 2) return <Medal className="h-6 w-6" style={{ color: "#C0C0C0" }} />
    if (rank === 3) return <Medal className="h-6 w-6" style={{ color: "#CD7F32" }} />
    return <Star className="h-6 w-6" style={{ color: "#D4AF37" }} />
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
      {/* Download button */}
      <div className="mb-4 flex w-full max-w-lg items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-primary">
          Volver al inicio
        </Link>
        <Button onClick={downloadCertificate} className="gap-2">
          <Download className="h-4 w-4" />
          Descargar certificado
        </Button>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="w-full max-w-lg overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #111111 30%, #0a0a0a 100%)",
        }}
      >
        {/* Top decorative bar */}
        <div
          className="h-2"
          style={{
            background: "linear-gradient(90deg, #D4AF37 0%, #F5E6A3 25%, #D4AF37 50%, #F5E6A3 75%, #D4AF37 100%)",
          }}
        />

        <div className="flex flex-col items-center px-6 pb-8 pt-6 sm:px-10">
          {/* Logo */}
          <div className="mb-1 flex items-center gap-3">
            <img src="/logo-80.png" alt="" className="h-10 w-10 rounded" />
            <span className="font-display text-3xl tracking-wider text-white">GRIZZLYS</span>
          </div>
          <p
            className="mb-6 text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "#D4AF37" }}
          >
            CERTIFICADO DE PARTICIPACIÓN
          </p>

          {/* Divider */}
          <div className="mb-6 flex w-full items-center gap-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
            <Star className="h-4 w-4" style={{ color: "#D4AF37" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
          </div>

          {/* Recognition text */}
          <p className="mb-2 text-center text-sm text-gray-400">
            Se otorga el presente certificado a
          </p>

          {/* Photo */}
          {athlete.photo_url && (
            <div className="my-4 h-24 w-24 overflow-hidden rounded-full" style={{ border: "3px solid #D4AF37" }}>
              <img
                src={athlete.photo_url}
                alt={athlete.full_name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Athlete name */}
          <h2
            className="mb-1 text-center font-display text-3xl uppercase tracking-wider sm:text-4xl"
            style={{ color: "#F5E6A3" }}
          >
            {athlete.full_name}
          </h2>
          <p className="mb-1 font-display text-xl tracking-wider text-primary">
            #{paddedNumber}
          </p>

          {/* Division */}
          <div className="mb-6">
            {divBadge.bgColor ? (
              <span
                className="rounded-md px-4 py-1 text-sm font-bold text-white"
                style={{ backgroundColor: divBadge.bgColor }}
              >
                {divLabel}
              </span>
            ) : (
              <span className="rounded-md border border-gray-600 px-4 py-1 text-sm font-medium text-gray-300">
                {divLabel}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="mb-6 flex w-full items-center gap-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #333, transparent)" }} />
          </div>

          {/* Overall position */}
          <div className="mb-6 flex items-center gap-3 rounded-xl px-6 py-4" style={{ backgroundColor: "rgba(212, 175, 55, 0.08)", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
            {getRankIcon(overall_rank)}
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: "#F5E6A3" }}>
                {getOrdinal(overall_rank)} Lugar
              </p>
              <p className="text-xs text-gray-400">
                de {total_athletes} atletas en {divLabel}
              </p>
              <p className="text-xs text-gray-500">
                {total_points} pts totales
              </p>
            </div>
          </div>

          {/* WOD Results */}
          <div className="mb-6 w-full">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
              Resultados por WOD
            </p>
            <div className="flex flex-col gap-2">
              {results.map((r) => (
                <div
                  key={r.wod_id}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#0d0d0d] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={
                        r.placement <= 3
                          ? { backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }
                          : { backgroundColor: "rgba(255,255,255,0.05)", color: "#888" }
                      }
                    >
                      {r.placement}
                    </span>
                    <span className="text-sm font-medium text-gray-300">{r.wod_name}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-primary">
                    {r.display_score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event info */}
          <p className="mb-1 text-center text-sm text-gray-400">
            {event.name}
          </p>
          {event.start_date && event.end_date && (
            <p className="mb-4 text-center text-xs text-gray-600">
              {event.start_date} — {event.end_date}
            </p>
          )}

          {/* Bottom divider */}
          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
            <Star className="h-4 w-4" style={{ color: "#D4AF37" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-gray-600">
            Certificado generado digitalmente · crossfit.52-55-189-120.sslip.io
          </p>
        </div>

        {/* Bottom decorative bar */}
        <div
          className="h-2"
          style={{
            background: "linear-gradient(90deg, #D4AF37 0%, #F5E6A3 25%, #D4AF37 50%, #F5E6A3 75%, #D4AF37 100%)",
          }}
        />
      </div>
    </div>
  )
}

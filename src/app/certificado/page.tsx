"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDivisionLabel, getDivisionBadge } from "@/lib/divisions"
import { Download, Loader2, AlertCircle, Lock, Trophy, Medal, Star } from "lucide-react"
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
        backgroundColor: "#000000",
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
    if (n === 1) return "1er"
    if (n === 2) return "2do"
    if (n === 3) return "3er"
    return `${n}to`
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-400" />
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-300" />
    if (rank === 3) return <Medal className="h-8 w-8 text-amber-600" />
    return <Star className="h-8 w-8 text-primary" />
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
  const divBadge = getDivisionBadge(athlete.division)
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

      {/* ====== CERTIFICATE ====== */}
      <div
        ref={certRef}
        className="relative w-full max-w-[540px] overflow-hidden bg-black"
      >
        {/* Background image (same as hero) */}
        <img
          src="/open2026.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          crossOrigin="anonymous"
        />
        {/* Gradient overlay (same as hero) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-8 py-10 sm:px-12">

          {/* Logo */}
          <img
            src="/logo-200.png"
            alt="GRIZZLYS"
            className="mb-3 h-20 w-20 rounded-lg"
            crossOrigin="anonymous"
          />

          {/* Brand name */}
          <h1 className="font-display text-5xl tracking-wider text-primary">
            GRIZZLYS
          </h1>

          {/* Decorative line + subtitle (same pattern as hero) */}
          <div className="mt-2 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="font-display text-sm tracking-[0.2em] text-gray-400">
              Competencia Interna
            </span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>

          {/* Event name */}
          <h2 className="mt-2 font-display text-2xl tracking-wider text-white">
            {event.name}
          </h2>

          {/* Dates */}
          {event.start_date && event.end_date && (
            <p className="mt-1 text-xs text-gray-500">
              {event.start_date} — {event.end_date}
            </p>
          )}

          {/* Divider */}
          <div className="my-5 h-px w-3/4 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Certificate title */}
          <p className="font-display text-lg tracking-[0.25em] text-primary">
            CERTIFICADO DE PARTICIPACIÓN
          </p>
          <p className="mt-2 text-sm italic text-gray-500">
            Se otorga el presente certificado a
          </p>

          {/* Photo */}
          {athlete.photo_url && (
            <div className="mt-5 h-24 w-24 overflow-hidden rounded-full border-[3px] border-primary shadow-[0_0_20px_rgba(255,102,0,0.3)]">
              <img
                src={athlete.photo_url}
                alt={athlete.full_name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Athlete name */}
          <h3 className="mt-4 text-center font-display text-4xl uppercase tracking-wider text-white sm:text-5xl">
            {athlete.full_name}
          </h3>

          {/* Number */}
          <p className="mt-1 font-display text-xl tracking-wider text-primary">
            #{paddedNumber}
          </p>

          {/* Division badge */}
          <div className="mt-3">
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
          <div className="my-5 h-px w-1/2 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          {/* Overall position (styled like hero date box) */}
          <div className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/50 px-6 py-4">
            {getRankIcon(overall_rank)}
            <div>
              <p className="font-display text-3xl tracking-wider text-white">
                {getOrdinal(overall_rank)} Lugar
              </p>
              <p className="text-xs text-gray-400">
                de {total_athletes} atletas en {divLabel}
              </p>
              <p className="mt-0.5 font-display text-lg tracking-wider text-primary">
                {total_points} puntos
              </p>
            </div>
          </div>

          {/* WOD Results */}
          <div className="mt-6 w-full">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              Resultados por WOD
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-800">
              {/* Header */}
              <div className="flex bg-gray-900 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <span className="flex-1">WOD</span>
                <span className="w-20 text-center">Score</span>
                <span className="w-12 text-center">Pos</span>
                <span className="w-14 text-center">Pts</span>
              </div>
              {/* Rows */}
              {results.map((r, i) => (
                <div
                  key={r.wod_id}
                  className={`flex items-center px-4 py-2.5 ${i % 2 === 0 ? "bg-black/40" : "bg-gray-900/30"}`}
                >
                  <span className="flex-1 text-sm font-medium text-gray-300">
                    {r.wod_name}
                  </span>
                  <span className="w-20 text-center font-mono text-sm font-bold text-primary">
                    {r.display_score}
                  </span>
                  <span className="w-12 text-center text-xs text-gray-500">
                    {r.placement}°
                  </span>
                  <span className="w-14 text-center text-sm font-black text-white">
                    {r.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom divider */}
          <div className="my-6 h-px w-3/4 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Tagline */}
          <p className="font-display text-sm tracking-[0.3em] text-primary">
            FORJANDO ATLETAS DE ÉLITE
          </p>

          {/* Footer */}
          <p className="mt-3 text-[10px] tracking-wider text-gray-700">
            crossfit.52-55-189-120.sslip.io
          </p>
        </div>
      </div>
    </div>
  )
}

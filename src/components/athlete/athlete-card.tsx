"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TimeInput } from "@/components/scores/time-input"
import { parseScore } from "@/lib/score-utils"
import {
  Printer, Trophy, Dumbbell, PenLine, Save, Loader2, X,
  ClipboardList, QrCode, ArrowLeft, CheckCircle,
} from "lucide-react"

interface Score {
  id: string
  display_score: string
  is_rx: boolean
  wod: {
    name: string
    score_type: string
  }
}

interface WodInfo {
  id: string
  name: string
  score_type: string
  time_cap_seconds: number | null
}

interface AtletaCardProps {
  athlete: {
    id: string
    participant_number: number
    full_name: string
    division: string
    birth_date: string | null
    photo_url: string | null
  }
  scores: Score[]
  eventName: string
  divisionLabel: string
  wods?: WodInfo[]
  isJudge?: boolean
}

export function AtletaCard({
  athlete,
  scores: initialScores,
  eventName,
  divisionLabel,
  wods = [],
  isJudge = false,
}: AtletaCardProps) {
  const router = useRouter()
  const [qrUrl, setQrUrl] = useState("")
  const [scores, setScores] = useState<Score[]>(initialScores)
  const [scoringWodId, setScoringWodId] = useState<string | null>(null)
  const [scoreInput, setScoreInput] = useState("")
  // Auto-detect RX based on athlete division
  const isAthleteRx = !athlete.division.startsWith("scaled_")
  const [scoreIsRx, setScoreIsRx] = useState(isAthleteRx)
  const [saving, setSaving] = useState(false)
  const [scoreError, setScoreError] = useState<string | null>(null)
  const [lastSavedWod, setLastSavedWod] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/event-config")
      .then((r) => r.json())
      .then((json) => {
        const base = json.data?.qr_base_url || window.location.origin + "/atleta/"
        const cleanBase = base.endsWith("/") ? base : base + "/"
        setQrUrl(`${cleanBase}${athlete.id}`)
      })
  }, [athlete.id])

  const age = athlete.birth_date
    ? Math.floor((Date.now() - new Date(athlete.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const paddedNumber = String(athlete.participant_number).padStart(3, "0")

  const openScoring = (wodId: string) => {
    setScoringWodId(wodId)
    setScoreInput("")
    setScoreIsRx(isAthleteRx)
    setScoreError(null)
    setLastSavedWod(null)
  }

  const cancelScoring = () => {
    setScoringWodId(null)
    setScoreInput("")
    setScoreError(null)
  }

  const saveScore = async (wod: WodInfo) => {
    setScoreError(null)
    setSaving(true)
    try {
      const { raw_score, display_score } = parseScore(scoreInput, wod.score_type as "time" | "reps" | "weight")
      const existingScore = scores.find((s) => s.wod.name === wod.name)

      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athlete_id: athlete.id,
          wod_id: wod.id,
          raw_score,
          display_score,
          is_rx: scoreIsRx,
          overwrite: !!existingScore,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        setScoreError(json.error || "Error al guardar")
        return
      }

      const newScore: Score = {
        id: existingScore?.id || "temp-" + Date.now(),
        display_score,
        is_rx: scoreIsRx,
        wod: { name: wod.name, score_type: wod.score_type },
      }

      if (existingScore) {
        setScores((prev) => prev.map((s) => (s.wod.name === wod.name ? newScore : s)))
      } else {
        setScores((prev) => [...prev, newScore])
      }

      setScoringWodId(null)
      setScoreInput("")
      setLastSavedWod(wod.name)

      // Clear success message after 3s
      setTimeout(() => setLastSavedWod(null), 3000)
    } catch (err) {
      setScoreError(err instanceof Error ? err.message : "Error al procesar score")
    } finally {
      setSaving(false)
    }
  }

  const getScoreTypeLabel = (type: string) => {
    switch (type) {
      case "time": return "For Time"
      case "reps": return "AMRAP / Reps"
      case "weight": return "Max Weight"
      default: return type
    }
  }

  const getScoreTypePlaceholder = (type: string) => {
    switch (type) {
      case "time": return "0:00"
      case "reps": return "Ej: 150"
      case "weight": return "Ej: 225"
      default: return ""
    }
  }

  const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462 * 10) / 10

  return (
    <>
      {/* === SCREEN VIEW === */}
      <div className="print:hidden">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </button>

        {/* Athlete info card */}
        <Card className="border-gray-800 bg-[#111]">
          <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
            <span className="font-display text-6xl tracking-wider text-primary sm:text-7xl">
              #{paddedNumber}
            </span>

            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-primary">
              {athlete.photo_url ? (
                <img
                  src={athlete.photo_url}
                  alt={athlete.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="/logo-80.png"
                  alt="GRIZZLYS"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover opacity-50"
                />
              )}
            </div>

            <h1 className="font-display text-3xl uppercase tracking-wider text-white sm:text-4xl">
              {athlete.full_name}
            </h1>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary">
                {divisionLabel}
              </Badge>
              {age && (
                <span className="text-sm text-gray-400">{age} años</span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => window.print()} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimir ficha
              </Button>
              {!isJudge && (
                <Button asChild className="gap-2">
                  <Link href={`/admin/login?callbackUrl=/atleta/${athlete.id}`}>
                    <ClipboardList className="h-4 w-4" />
                    Calificar
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scores / WODs */}
        <div className="mt-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl tracking-wider text-gray-300">
            <Trophy className="h-5 w-5 text-primary" />
            SCORES
          </h2>

          {/* Success toast */}
          {lastSavedWod && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-950 border border-green-800 px-4 py-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Score de {lastSavedWod} guardado
            </div>
          )}

          {/* If judge: show all WODs with score status */}
          {isJudge && wods.length > 0 ? (
            <div className="flex flex-col gap-3">
              {wods.map((wod) => {
                const existing = scores.find((s) => s.wod.name === wod.name)
                const isScoring = scoringWodId === wod.id

                return (
                  <Card key={wod.id} className="border-gray-800 bg-[#111]">
                    <CardContent className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{wod.name}</p>
                          <p className="text-xs text-gray-500">{getScoreTypeLabel(wod.score_type)}</p>
                        </div>
                        {existing && !isScoring ? (
                          <div className="flex items-center gap-2">
                            {wod.score_type === "weight" ? (
                              <div className="text-right">
                                <span className="font-display text-2xl text-primary">
                                  {existing.display_score}
                                </span>
                                <p className="text-xs text-gray-500">{lbsToKg(parseFloat(existing.display_score))} kg</p>
                              </div>
                            ) : (
                              <span className="font-display text-2xl text-primary">
                                {existing.display_score}
                              </span>
                            )}
                            <Badge
                              variant={existing.is_rx ? "default" : "outline"}
                              className={existing.is_rx ? "bg-green-600" : ""}
                            >
                              {existing.is_rx ? "RX" : "Scaled"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openScoring(wod.id)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : !isScoring ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1"
                            onClick={() => openScoring(wod.id)}
                          >
                            <PenLine className="h-3.5 w-3.5" />
                            Calificar
                          </Button>
                        ) : null}
                      </div>

                      {/* Inline score form */}
                      {isScoring && (
                        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-gray-700 bg-black p-3">
                          {wod.score_type === "time" ? (
                            <TimeInput
                              value={scoreInput}
                              onChange={setScoreInput}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder={getScoreTypePlaceholder(wod.score_type)}
                                value={scoreInput}
                                onChange={(e) => setScoreInput(e.target.value)}
                                className="text-center text-lg font-mono"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {wod.score_type === "reps" ? "reps" : "lbs"}
                              </span>
                            </div>
                          )}

                          {scoreError && (
                            <p className="text-xs text-red-400">{scoreError}</p>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-1"
                              disabled={!scoreInput || saving}
                              onClick={() => saveScore(wod)}
                            >
                              {saving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelScoring}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}

              {/* Judge navigation - always visible */}
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild size="lg" className="w-full gap-2 text-base">
                  <Link href="/judge">
                    <QrCode className="h-5 w-5" />
                    Escanear otro atleta
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full gap-2">
                  <Link href="/leaderboard">
                    <Trophy className="h-4 w-4" />
                    Ver Leaderboard
                  </Link>
                </Button>
              </div>
            </div>
          ) : scores.length === 0 ? (
            <Card className="border-gray-800 bg-[#111]">
              <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                <Dumbbell className="h-10 w-10 text-gray-600" />
                <p className="text-gray-500">Sin scores registrados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {scores.map((score) => (
                <Card key={score.id} className="border-gray-800 bg-[#111]">
                  <CardContent className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="font-semibold text-white">{score.wod.name}</p>
                      <p className="text-xs text-gray-500">{getScoreTypeLabel(score.wod.score_type)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {score.wod.score_type === "weight" ? (
                        <div className="text-right">
                          <span className="font-display text-2xl text-primary">
                            {score.display_score}
                          </span>
                          <p className="text-xs text-gray-500">{lbsToKg(parseFloat(score.display_score))} kg</p>
                        </div>
                      ) : (
                        <span className="font-display text-2xl text-primary">
                          {score.display_score}
                        </span>
                      )}
                      <Badge
                        variant={score.is_rx ? "default" : "outline"}
                        className={score.is_rx ? "bg-green-600" : ""}
                      >
                        {score.is_rx ? "RX" : "Scaled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Event branding */}
        <div className="mt-8 text-center">
          <Image src="/logo-80.png" alt="GRIZZLYS" width={40} height={40} className="mx-auto rounded opacity-50" />
          <p className="mt-2 text-xs text-gray-600">{eventName}</p>
        </div>
      </div>

      {/* === PRINT VIEW === */}
      <div className="hidden print:block">
        <div className="mx-auto flex max-w-sm flex-col items-center border-2 border-black bg-white px-8 py-6 text-black">
          <div className="mb-1 flex items-center gap-2">
            <img src="/logo-80.png" alt="" className="h-8 w-8 rounded" />
            <span className="text-2xl font-black tracking-wider">GRIZZLYS</span>
          </div>
          <p className="mb-4 text-xs uppercase tracking-wider text-gray-500">{eventName}</p>
          <div className="text-6xl font-black leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            #{paddedNumber}
          </div>
          <div className="my-4 h-32 w-32 overflow-hidden rounded-full border-2 border-black">
            {athlete.photo_url ? (
              <img src={athlete.photo_url} alt={athlete.full_name} className="h-full w-full object-cover" />
            ) : (
              <img src="/logo-80.png" alt="" className="h-full w-full object-cover opacity-30" />
            )}
          </div>
          <p className="text-center text-xl font-bold uppercase">{athlete.full_name}</p>
          <p className="mt-1 text-sm text-gray-600">{divisionLabel}</p>
          {age && <p className="text-sm text-gray-500">{age} años</p>}
          {qrUrl && (
            <div className="mt-4 rounded-lg border border-gray-300 bg-white p-3">
              <QRCodeSVG value={qrUrl} size={160} level="H" />
            </div>
          )}
          <p className="mt-2 text-center text-[10px] text-gray-400">
            Escanea el QR para ver el perfil del atleta
          </p>
        </div>
      </div>
    </>
  )
}

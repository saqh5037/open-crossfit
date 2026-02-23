"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeInput } from "./time-input"
import { parseScore } from "@/lib/score-utils"
import { Search, Save, Loader2, CheckCircle, Camera, X } from "lucide-react"
import type { ScoreType } from "@/types"

interface Wod {
  id: string
  name: string
  score_type: ScoreType
  time_cap_seconds: number | null
}

interface Athlete {
  id: string
  full_name: string
  division: string
}

export function JudgePanel() {
  const [wods, setWods] = useState<Wod[]>([])
  const [selectedWod, setSelectedWod] = useState<Wod | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [scoreInput, setScoreInput] = useState("")
  const [isRx, setIsRx] = useState(true)
  const [judgeNotes, setJudgeNotes] = useState("")
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [overwriteDialog, setOverwriteDialog] = useState<{
    open: boolean
    existingScore: string
    athleteName: string
  }>({ open: false, existingScore: "", athleteName: "" })
  const [error, setError] = useState<string | null>(null)

  // Progress
  const [totalAthletes, setTotalAthletes] = useState(0)
  const [scoredCount, setScoredCount] = useState(0)

  // Fetch WODs
  useEffect(() => {
    fetch("/api/wods")
      .then((r) => r.json())
      .then((json) => {
        const active = json.data?.filter((w: Wod & { is_active: boolean }) => w.is_active) ?? []
        setWods(active)
      })
  }, [])

  // Search athletes
  const searchAthletes = useCallback(async (query: string) => {
    if (query.length < 2) {
      setAthletes([])
      return
    }
    const res = await fetch(`/api/athletes?search=${encodeURIComponent(query)}`)
    const json = await res.json()
    setAthletes(json.data ?? [])
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => searchAthletes(searchQuery), 200)
    return () => clearTimeout(timer)
  }, [searchQuery, searchAthletes])

  // Update progress when WOD changes
  useEffect(() => {
    if (!selectedWod) return
    const updateProgress = async () => {
      const [athletesRes, scoresRes] = await Promise.all([
        fetch("/api/athletes"),
        fetch(`/api/scores?wod_id=${selectedWod.id}`),
      ])
      const [athletesJson, scoresJson] = await Promise.all([
        athletesRes.json(),
        scoresRes.json(),
      ])
      setTotalAthletes(athletesJson.data?.length ?? 0)
      setScoredCount(scoresJson.data?.length ?? 0)
    }
    updateProgress()
  }, [selectedWod, showSuccess])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("La foto excede 5MB")
      return
    }

    setEvidenceFile(file)
    const url = URL.createObjectURL(file)
    setEvidencePreview(url)
  }

  const clearEvidence = () => {
    setEvidenceFile(null)
    if (evidencePreview) URL.revokeObjectURL(evidencePreview)
    setEvidencePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (overwrite = false) => {
    if (!selectedAthlete || !selectedWod || !scoreInput) return

    setError(null)
    setSaving(true)

    try {
      const { raw_score, display_score } = parseScore(scoreInput, selectedWod.score_type)

      // Upload evidence photo first if present
      let evidence_url: string | undefined
      if (evidenceFile) {
        const formData = new FormData()
        formData.append("file", evidenceFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) {
          setError(uploadJson.error || "Error al subir la foto")
          setSaving(false)
          return
        }
        evidence_url = uploadJson.url
      }

      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athlete_id: selectedAthlete.id,
          wod_id: selectedWod.id,
          raw_score,
          display_score,
          is_rx: isRx,
          overwrite,
          evidence_url,
          judge_notes: judgeNotes || undefined,
        }),
      })

      const json = await res.json()

      if (res.status === 409 && !overwrite) {
        setOverwriteDialog({
          open: true,
          existingScore: json.existing?.display_score ?? "",
          athleteName: json.existing?.athlete_name ?? selectedAthlete.full_name,
        })
        setSaving(false)
        return
      }

      if (!res.ok) {
        setError(json.error || "Error al guardar")
        setSaving(false)
        return
      }

      // Success
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedAthlete(null)
        setScoreInput("")
        setSearchQuery("")
        setAthletes([])
        setJudgeNotes("")
        clearEvidence()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const progressPct = totalAthletes > 0 ? Math.round((scoredCount / totalAthletes) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* WOD Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">WOD Activo</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(id) => {
              const wod = wods.find((w) => w.id === id)
              setSelectedWod(wod ?? null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el WOD" />
            </SelectTrigger>
            <SelectContent>
              {wods.map((wod) => (
                <SelectItem key={wod.id} value={wod.id}>
                  {wod.name} — {wod.score_type === "time" ? "For Time" : wod.score_type === "reps" ? "Reps" : "Max Load"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Progress bar */}
          {selectedWod && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm text-gray-500">
                <span>Progreso</span>
                <span>
                  {scoredCount}/{totalAthletes} ({progressPct}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedWod && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Capturar Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Athlete Search */}
            <div>
              <Label>Buscar Atleta</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Escribe el nombre..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedAthlete(null)
                  }}
                  className="pl-10"
                />
              </div>

              {/* Search results */}
              {athletes.length > 0 && !selectedAthlete && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border">
                  {athletes.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setSelectedAthlete(a)
                        setSearchQuery(a.full_name)
                        setAthletes([])
                        setIsRx(a.division.startsWith("rx"))
                      }}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-gray-800 sm:px-4 sm:py-3"
                    >
                      <span className="truncate text-sm font-medium">{a.full_name}</span>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {a.division.replace(/_/g, " ")}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {selectedAthlete && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-950 px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{selectedAthlete.full_name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedAthlete.division.replace(/_/g, " ")}
                  </Badge>
                </div>
              )}
            </div>

            {/* Score Input */}
            {selectedAthlete && (
              <>
                <div>
                  <Label>
                    Score ({selectedWod.score_type === "time" ? "mm:ss" : selectedWod.score_type === "reps" ? "repeticiones" : "kg"})
                  </Label>
                  {selectedWod.score_type === "time" ? (
                    <TimeInput value={scoreInput} onChange={setScoreInput} />
                  ) : (
                    <Input
                      type="number"
                      inputMode={selectedWod.score_type === "weight" ? "decimal" : "numeric"}
                      step={selectedWod.score_type === "weight" ? "0.5" : "1"}
                      min="0"
                      placeholder={selectedWod.score_type === "reps" ? "Ej: 150" : "Ej: 95.5"}
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                      className="text-center text-lg font-mono"
                    />
                  )}
                </div>

                {/* RX Toggle */}
                <div className="flex items-center gap-3">
                  <Label>Modalidad:</Label>
                  <div className="flex gap-2">
                    {[true, false].map((rx) => (
                      <button
                        key={String(rx)}
                        type="button"
                        onClick={() => setIsRx(rx)}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                          isRx === rx
                            ? "bg-primary text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {rx ? "RX" : "Scaled"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Judge Notes */}
                <div>
                  <Label>Notas del juez (opcional)</Label>
                  <textarea
                    className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none"
                    rows={2}
                    placeholder="Ej: No-rep en rep 45, penalización de 5 reps"
                    value={judgeNotes}
                    onChange={(e) => setJudgeNotes(e.target.value)}
                  />
                </div>

                {/* Evidence Photo */}
                <div>
                  <Label>Foto de evidencia (opcional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!evidencePreview ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-1 w-full border-dashed border-gray-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Tomar foto / Seleccionar imagen
                    </Button>
                  ) : (
                    <div className="mt-1 relative">
                      <img
                        src={evidencePreview}
                        alt="Evidencia"
                        className="h-32 w-full rounded-lg border border-gray-700 object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearEvidence}
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-1 hover:bg-black"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-950 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {showSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-950 p-3 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Score guardado exitosamente
                  </div>
                )}

                <Button
                  size="lg"
                  onClick={() => handleSubmit(false)}
                  disabled={saving || !scoreInput}
                  className="mt-2"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar Score
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overwrite Dialog */}
      <Dialog
        open={overwriteDialog.open}
        onOpenChange={(open) => setOverwriteDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Score Existente</DialogTitle>
            <DialogDescription>
              {overwriteDialog.athleteName} ya tiene un score de{" "}
              <strong>{overwriteDialog.existingScore}</strong> para este WOD.
              ¿Deseas sobrescribirlo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOverwriteDialog((prev) => ({ ...prev, open: false }))}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOverwriteDialog((prev) => ({ ...prev, open: false }))
                handleSubmit(true)
              }}
            >
              Sobrescribir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

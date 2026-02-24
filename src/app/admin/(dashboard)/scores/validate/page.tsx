"use client"

import { useState, useEffect, useCallback } from "react"
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  ShieldCheck,
  Loader2,
  ChevronDown,
  ChevronUp,
  StickyNote,
} from "lucide-react"

interface ScoreRow {
  id: string
  display_score: string
  is_rx: boolean
  scored_by: string | null
  evidence_url: string | null
  judge_notes: string | null
  status: string
  created_at: string
  updated_at: string
  athlete: { id: string; full_name: string; division: string }
  wod: { id: string; name: string; score_type: string }
  scorer: { email: string; role: string } | null
}

interface Wod {
  id: string
  name: string
}

const DIVISION_LABELS: Record<string, string> = {
  rx_male: "RX M",
  rx_female: "RX F",
  scaled_male: "Scaled M",
  scaled_female: "Scaled F",
  foundation_male: "Found. M",
  foundation_female: "Found. F",
  masters35_male: "M35+ M",
  masters35_female: "M35+ F",
  masters45_male: "M45+ M",
  masters45_female: "M45+ F",
  teens_male: "Teens M",
  teens_female: "Teens F",
}

export default function ValidateScoresPage() {
  const [scores, setScores] = useState<ScoreRow[]>([])
  const [wods, setWods] = useState<Wod[]>([])
  const [filterWod, setFilterWod] = useState("")
  const [filterDivision, setFilterDivision] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; scoreIds: string[] }>({
    open: false,
    scoreIds: [],
  })
  const [rejectReason, setRejectReason] = useState("")
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/wods")
      .then((r) => r.json())
      .then((json) => setWods(json.data ?? []))
  }, [])

  const fetchScores = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterWod) params.set("wod_id", filterWod)
    if (filterDivision) params.set("division", filterDivision)
    if (filterStatus) params.set("status", filterStatus)
    const res = await fetch(`/api/scores/validate?${params}`)
    const json = await res.json()
    setScores(json.data ?? [])
    setSelected(new Set())
    setLoading(false)
  }, [filterWod, filterDivision, filterStatus])

  useEffect(() => {
    fetchScores()
  }, [fetchScores])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === scores.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(scores.map((s) => s.id)))
    }
  }

  const handleConfirm = async (scoreIds: string[]) => {
    setActionLoading(true)
    const res = await fetch("/api/scores/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score_ids: scoreIds, action: "confirm" }),
    })
    setActionLoading(false)
    if (res.ok) fetchScores()
    else {
      const json = await res.json()
      alert(json.error || "Error al confirmar")
    }
  }

  const openRejectDialog = (scoreIds: string[]) => {
    setRejectReason("")
    setRejectDialog({ open: true, scoreIds })
  }

  const handleReject = async () => {
    setActionLoading(true)
    const res = await fetch("/api/scores/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score_ids: rejectDialog.scoreIds,
        action: "reject",
        rejection_reason: rejectReason || undefined,
      }),
    })
    setActionLoading(false)
    setRejectDialog({ open: false, scoreIds: [] })
    if (res.ok) fetchScores()
    else {
      const json = await res.json()
      alert(json.error || "Error al rechazar")
    }
  }

  const pendingCount = scores.filter((s) => s.status === "pending").length
  const pendingOnly = scores.filter((s) => s.status === "pending")

  return (
    <div className="flex flex-col gap-4 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold lg:text-2xl">
            <ShieldCheck className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
            Validar Scores
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 lg:text-sm">
            {loading ? "Cargando..." : `${scores.length} scores — ${pendingCount} pendientes`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-400 lg:hidden"
        >
          Filtros
          {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Filters — always visible on desktop, toggle on mobile */}
      <div className={`flex flex-col gap-2 lg:flex-row lg:items-center ${showFilters ? "" : "hidden lg:flex"}`}>
        <Select value={filterWod} onValueChange={setFilterWod}>
          <SelectTrigger className="h-9 text-xs lg:w-44 lg:text-sm">
            <SelectValue placeholder="Todos los WODs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los WODs</SelectItem>
            {wods.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <select
          className="h-9 rounded-lg border border-gray-700 bg-[#111] px-3 text-xs text-white lg:w-48 lg:text-sm"
          value={filterDivision}
          onChange={(e) => setFilterDivision(e.target.value)}
        >
          <option value="">Todas las divisiones</option>
          <option value="rx_male">RX Masculino</option>
          <option value="rx_female">RX Femenino</option>
          <option value="scaled_male">Scaled Masculino</option>
          <option value="scaled_female">Scaled Femenino</option>
          <option value="foundation_male">Foundation Masculino</option>
          <option value="foundation_female">Foundation Femenino</option>
          <option value="masters35_male">Masters 35+ Masculino</option>
          <option value="masters35_female">Masters 35+ Femenino</option>
        </select>
        <select
          className="h-9 rounded-lg border border-gray-700 bg-[#111] px-3 text-xs text-white lg:w-36 lg:text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="all">Todos</option>
        </select>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 backdrop-blur-sm">
          <span className="text-xs font-medium text-gray-300">{selected.size} seleccionado(s)</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 gap-1 bg-green-700 text-xs hover:bg-green-600"
              onClick={() => handleConfirm(Array.from(selected))}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
              Aprobar ({selected.size})
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 gap-1 text-xs"
              onClick={() => openRejectDialog(Array.from(selected))}
              disabled={actionLoading}
            >
              <XCircle className="h-3 w-3" />
              Rechazar
            </Button>
          </div>
        </div>
      )}

      {/* Quick approve all pending */}
      {pendingOnly.length > 1 && selected.size === 0 && (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-green-800 bg-green-950/30 px-3 py-2">
          <span className="text-xs text-green-400">
            {pendingOnly.length} scores pendientes
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 border-gray-600 text-xs"
              onClick={toggleAll}
            >
              Seleccionar todos
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-green-700 text-xs hover:bg-green-600"
              onClick={() => handleConfirm(pendingOnly.map((s) => s.id))}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
              Aprobar todos
            </Button>
          </div>
        </div>
      )}

      {/* Score Cards — Mobile */}
      <div className="flex flex-col gap-3 lg:hidden">
        {scores.map((score) => (
          <div
            key={score.id}
            className={`rounded-xl border ${
              selected.has(score.id) ? "border-primary bg-primary/5" : "border-gray-800 bg-[#111]"
            } overflow-hidden`}
          >
            {/* Card header — tap to select */}
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
              onClick={() => toggleSelect(score.id)}
            >
              <input
                type="checkbox"
                checked={selected.has(score.id)}
                onChange={() => toggleSelect(score.id)}
                className="h-5 w-5 shrink-0 accent-primary"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-white">
                    {score.athlete.full_name}
                  </span>
                  <span className="font-mono text-lg font-bold text-primary">
                    {score.display_score}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                  <span className="rounded bg-gray-800 px-1.5 py-0.5 font-medium">
                    {score.wod.name}
                  </span>
                  <span>{DIVISION_LABELS[score.athlete.division] || score.athlete.division}</span>
                  <Badge
                    variant="outline"
                    className={`h-5 text-[10px] ${
                      score.status === "confirmed"
                        ? "border-green-700 text-green-400"
                        : "border-yellow-700 text-yellow-400"
                    }`}
                  >
                    {score.status === "confirmed" ? "OK" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            </button>

            {/* Card details row */}
            <div className="flex items-center justify-between border-t border-gray-800/50 px-4 py-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {score.scorer && <span>Juez: {score.scorer.email.split("@")[0]}</span>}
                {score.evidence_url && (
                  <button
                    onClick={() => setViewingImage(score.evidence_url)}
                    className="flex items-center gap-1 text-primary"
                  >
                    <ImageIcon className="h-3 w-3" />
                    Foto
                  </button>
                )}
                {score.judge_notes && (
                  <span className="flex items-center gap-1" title={score.judge_notes}>
                    <StickyNote className="h-3 w-3" />
                    Nota
                  </span>
                )}
              </div>

              {/* Individual actions */}
              {score.status === "pending" && (
                <div className="flex gap-1">
                  <button
                    className="rounded-lg bg-green-800 px-3 py-1.5 text-xs font-medium text-white active:bg-green-700"
                    onClick={() => handleConfirm([score.id])}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "..." : "Aprobar"}
                  </button>
                  <button
                    className="rounded-lg bg-red-900 px-3 py-1.5 text-xs font-medium text-red-300 active:bg-red-800"
                    onClick={() => openRejectDialog([score.id])}
                    disabled={actionLoading}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {!loading && scores.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No hay scores con los filtros actuales
          </div>
        )}
      </div>

      {/* Table — Desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-gray-800 bg-[#111] lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs uppercase text-gray-500">
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={scores.length > 0 && selected.size === scores.length}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-primary"
                />
              </th>
              <th className="px-3 py-3">Atleta</th>
              <th className="px-3 py-3">División</th>
              <th className="px-3 py-3">WOD</th>
              <th className="px-3 py-3">Score</th>
              <th className="px-3 py-3">Juez</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Info</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr
                key={score.id}
                className={`border-b border-gray-800/50 ${
                  selected.has(score.id) ? "bg-primary/5" : "hover:bg-gray-900/50"
                }`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(score.id)}
                    onChange={() => toggleSelect(score.id)}
                    className="h-4 w-4 accent-primary"
                  />
                </td>
                <td className="px-3 py-3 font-medium text-white">{score.athlete.full_name}</td>
                <td className="px-3 py-3 text-xs text-gray-400">
                  {DIVISION_LABELS[score.athlete.division] || score.athlete.division}
                </td>
                <td className="px-3 py-3">
                  <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
                    {score.wod.name}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono font-bold text-primary">{score.display_score}</td>
                <td className="px-3 py-3 text-xs text-gray-500">
                  {score.scorer?.email?.split("@")[0] || "—"}
                </td>
                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      score.status === "confirmed"
                        ? "border-green-700 bg-green-950 text-green-400"
                        : "border-yellow-700 text-yellow-400"
                    }`}
                  >
                    {score.status === "confirmed" ? "Confirmado" : "Pendiente"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    {score.evidence_url && (
                      <button
                        onClick={() => setViewingImage(score.evidence_url)}
                        className="text-primary hover:underline"
                        title="Ver evidencia"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    )}
                    {score.judge_notes && (
                      <span title={score.judge_notes}>
                        <StickyNote className="h-4 w-4 text-gray-500" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  {score.status === "pending" && (
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-xs text-green-400 hover:bg-green-950 hover:text-green-300"
                        onClick={() => handleConfirm([score.id])}
                        disabled={actionLoading}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-xs text-red-400 hover:bg-red-950 hover:text-red-300"
                        onClick={() => openRejectDialog([score.id])}
                        disabled={actionLoading}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && scores.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-500">
                  No hay scores con los filtros actuales
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => !open && setRejectDialog({ open: false, scoreIds: [] })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Score(s)</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <p className="text-sm text-gray-400">
              Se eliminarán {rejectDialog.scoreIds.length} score(s). El juez deberá recapturar.
            </p>
            <textarea
              className="rounded-lg border border-gray-700 bg-[#111] p-3 text-sm text-white placeholder:text-gray-600"
              rows={3}
              placeholder="Razón del rechazo (opcional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, scoreIds: [] })}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Evidencia</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <img src={viewingImage} alt="Evidencia del score" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

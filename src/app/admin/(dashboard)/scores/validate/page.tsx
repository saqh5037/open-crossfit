"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  CheckCheck,
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

const DIV_LABEL: Record<string, string> = {
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
  // Mobile: currently expanded score
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Track just-confirmed scores for green flash animation
  const [justConfirmed, setJustConfirmed] = useState<Set<string>>(new Set())

  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; scoreIds: string[] }>({
    open: false,
    scoreIds: [],
  })
  const [rejectReason, setRejectReason] = useState("")
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  const expandedRef = useRef<HTMLDivElement>(null)

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
    if (selected.size === scores.length) setSelected(new Set())
    else setSelected(new Set(scores.map((s) => s.id)))
  }

  // Mobile: confirm single score and auto-advance to next pending
  const handleConfirmMobile = async (scoreId: string) => {
    setActionLoading(true)
    const res = await fetch("/api/scores/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score_ids: [scoreId], action: "confirm" }),
    })
    setActionLoading(false)
    if (!res.ok) {
      const json = await res.json()
      alert(json.error || "Error al confirmar")
      return
    }

    // Flash green on confirmed score
    setJustConfirmed((prev) => new Set(prev).add(scoreId))

    // Update the score status locally for instant feedback
    setScores((prev) =>
      prev.map((s) => (s.id === scoreId ? { ...s, status: "confirmed" } : s))
    )

    // Auto-advance to next pending after a brief pause
    setTimeout(() => {
      setScores((currentScores) => {
        const pendingScores = currentScores.filter((s) => s.status === "pending" && s.id !== scoreId)
        if (pendingScores.length > 0) {
          setExpandedId(pendingScores[0].id)
          // Scroll to it
          setTimeout(() => expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100)
        } else {
          setExpandedId(null)
        }
        return currentScores
      })
    }, 300)
  }

  // Desktop/bulk confirm
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
    if (res.ok) {
      // On mobile, advance to next
      const rejectedIds = new Set(rejectDialog.scoreIds)
      setScores((prev) => prev.filter((s) => !rejectedIds.has(s.id)))
      setScores((currentScores) => {
        const pending = currentScores.filter((s) => s.status === "pending")
        if (pending.length > 0) setExpandedId(pending[0].id)
        else setExpandedId(null)
        return currentScores
      })
    } else {
      const json = await res.json()
      alert(json.error || "Error al rechazar")
    }
  }

  const pendingScores = scores.filter((s) => s.status === "pending")
  const confirmedInView = scores.filter((s) => s.status === "confirmed" || justConfirmed.has(s.id))

  return (
    <div className="flex flex-col gap-3 pb-24 lg:gap-4 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold lg:text-2xl">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Validar Scores
          </h1>
          <p className="text-xs text-gray-500">
            {loading ? "Cargando..." : `${pendingScores.length} pendientes de ${scores.length}`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 lg:hidden"
        >
          Filtros {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Filters */}
      <div className={`flex flex-col gap-2 lg:flex-row lg:items-center ${showFilters ? "" : "hidden lg:flex"}`}>
        <Select value={filterWod} onValueChange={setFilterWod}>
          <SelectTrigger className="h-9 text-xs lg:w-44 lg:text-sm">
            <SelectValue placeholder="Todos los WODs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los WODs</SelectItem>
            {wods.map((w) => (
              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
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

      {/* Quick approve all (both mobile and desktop) */}
      {pendingScores.length > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-green-800 bg-green-950/30 px-3 py-2">
          <span className="text-xs text-green-400">
            {pendingScores.length} pendientes
          </span>
          <Button
            size="sm"
            className="h-8 gap-1 bg-green-700 text-xs hover:bg-green-600"
            onClick={() => handleConfirm(pendingScores.map((s) => s.id))}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
            Aprobar todos
          </Button>
        </div>
      )}

      {/* ==================== MOBILE VIEW ==================== */}
      <div className="flex flex-col gap-2 lg:hidden">
        {scores.length === 0 && !loading && (
          <div className="py-16 text-center text-sm text-gray-500">
            No hay scores con los filtros actuales
          </div>
        )}

        {scores.map((score) => {
          const isExpanded = expandedId === score.id
          const isConfirmed = score.status === "confirmed"
          const wasJustConfirmed = justConfirmed.has(score.id)

          return (
            <div
              key={score.id}
              ref={isExpanded ? expandedRef : undefined}
              className={`rounded-xl border transition-all duration-300 ${
                wasJustConfirmed
                  ? "border-green-600 bg-green-950/40"
                  : isExpanded
                    ? "border-primary bg-[#111]"
                    : isConfirmed
                      ? "border-green-900/50 bg-green-950/20"
                      : "border-gray-800 bg-[#111]"
              }`}
            >
              {/* Row — always visible, tap to expand */}
              <button
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
                onClick={() => setExpandedId(isExpanded ? null : score.id)}
              >
                {/* Status indicator */}
                <div className={`h-10 w-1 shrink-0 rounded-full ${
                  isConfirmed ? "bg-green-600" : "bg-yellow-500"
                }`} />

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  {/* Row 1: Name + Score */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-white">
                      {score.athlete.full_name}
                    </span>
                    <span className="shrink-0 font-mono text-base font-bold text-primary">
                      {score.display_score}
                    </span>
                  </div>
                  {/* Row 2: WOD + Division */}
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-400">{score.wod.name}</span>
                    <span>·</span>
                    <span>{DIV_LABEL[score.athlete.division] || score.athlete.division}</span>
                    {isConfirmed && (
                      <CheckCircle className="ml-auto h-3.5 w-3.5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Expand indicator */}
                {!isConfirmed && (
                  <ChevronDown className={`h-4 w-4 shrink-0 text-gray-600 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`} />
                )}
              </button>

              {/* Expanded panel */}
              {isExpanded && !isConfirmed && (
                <div className="border-t border-gray-800 px-3 pb-3 pt-2">
                  {/* Details */}
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    {score.scorer && (
                      <span>Juez: <span className="text-gray-400">{score.scorer.email.split("@")[0]}</span></span>
                    )}
                    {score.evidence_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setViewingImage(score.evidence_url) }}
                        className="flex items-center gap-1 text-primary"
                      >
                        <ImageIcon className="h-3 w-3" /> Ver foto
                      </button>
                    )}
                    {score.judge_notes && (
                      <span className="flex items-center gap-1">
                        <StickyNote className="h-3 w-3" />
                        <span className="max-w-[200px] truncate">{score.judge_notes}</span>
                      </span>
                    )}
                    <span className="text-gray-600">
                      {new Date(score.updated_at).toLocaleDateString("es-MX", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Big action buttons */}
                  <div className="flex gap-2">
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-bold text-white active:bg-green-600 disabled:opacity-50"
                      onClick={() => handleConfirmMobile(score.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      APROBAR
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-900/80 px-5 py-3 text-sm font-bold text-red-300 active:bg-red-800 disabled:opacity-50"
                      onClick={() => openRejectDialog([score.id])}
                      disabled={actionLoading}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="hidden lg:block">
        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/95 px-4 py-2">
            <span className="text-sm text-gray-300">{selected.size} seleccionado(s)</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-1 bg-green-700 hover:bg-green-600"
                onClick={() => handleConfirm(Array.from(selected))}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                Aprobar ({selected.size})
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={() => openRejectDialog(Array.from(selected))}
                disabled={actionLoading}
              >
                <XCircle className="h-3 w-3" /> Rechazar
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111]">
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
                  className={`border-b border-gray-800/50 transition-colors ${
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
                    {DIV_LABEL[score.athlete.division] || score.athlete.division}
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
                          <CheckCircle className="h-3.5 w-3.5" /> Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-red-400 hover:bg-red-950 hover:text-red-300"
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
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, scoreIds: [] })}>
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

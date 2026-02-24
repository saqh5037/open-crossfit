"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
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
  AlertTriangle,
  User,
  IdCard,
} from "lucide-react"
import { getDivisionBadge } from "@/lib/divisions"
import { AthleteCredentialDialog, type CredentialAthlete } from "@/components/athlete/athlete-credential-dialog"

interface ScoreRow {
  id: string
  display_score: string
  is_rx: boolean
  scored_by: string | null
  evidence_url: string | null
  judge_notes: string | null
  rejection_reason: string | null
  status: string
  created_at: string
  updated_at: string
  athlete: { id: string; full_name: string; division: string }
  wod: { id: string; name: string; score_type: string }
  scorer: { email: string; role: string } | null
}

interface AthleteGroup {
  athleteId: string
  athleteName: string
  division: string
  scores: ScoreRow[]
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
  masters45_male: "M45+ M",
  masters45_female: "M45+ F",
  teens_male: "Teens M",
  teens_female: "Teens F",
}

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <Badge variant="outline" className="text-[10px] border-green-700 bg-green-950 text-green-400">
        Confirmado
      </Badge>
    )
  }
  if (status === "rejected") {
    return (
      <Badge variant="outline" className="text-[10px] border-red-700 bg-red-950 text-red-400">
        Rechazado
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-[10px] border-yellow-700 text-yellow-400">
      Pendiente
    </Badge>
  )
}

function statusColor(status: string) {
  if (status === "confirmed") return "bg-green-600"
  if (status === "rejected") return "bg-red-500"
  return "bg-yellow-500"
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
  const [expandedAthleteId, setExpandedAthleteId] = useState<string | null>(null)
  const [justConfirmed, setJustConfirmed] = useState<Set<string>>(new Set())

  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; scoreIds: string[] }>({
    open: false,
    scoreIds: [],
  })
  const [rejectReason, setRejectReason] = useState("")
  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [credentialAthlete, setCredentialAthlete] = useState<CredentialAthlete | null>(null)

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

  // Group scores by athlete
  const athleteGroups: AthleteGroup[] = useMemo(() => {
    const map = new Map<string, AthleteGroup>()
    for (const score of scores) {
      const key = score.athlete.id
      if (!map.has(key)) {
        map.set(key, {
          athleteId: key,
          athleteName: score.athlete.full_name,
          division: score.athlete.division,
          scores: [],
        })
      }
      map.get(key)!.scores.push(score)
    }
    // Sort each athlete's scores by WOD name
    const groups = Array.from(map.values())
    groups.forEach((group) => {
      group.scores.sort((a, b) => a.wod.name.localeCompare(b.wod.name))
    })
    return groups
  }, [scores])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAthleteSelect = (group: AthleteGroup) => {
    setSelected((prev) => {
      const next = new Set(prev)
      const actionableIds = group.scores.filter((s) => s.status !== "confirmed").map((s) => s.id)
      const allSelected = actionableIds.every((id) => next.has(id))
      if (allSelected) {
        actionableIds.forEach((id) => next.delete(id))
      } else {
        actionableIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  // Confirm scores
  const handleConfirm = async (scoreIds: string[]) => {
    setActionLoading(true)
    const res = await fetch("/api/scores/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score_ids: scoreIds, action: "confirm" }),
    })
    setActionLoading(false)
    if (res.ok) {
      // Flash green
      setJustConfirmed((prev) => {
        const next = new Set(prev)
        scoreIds.forEach((id) => next.add(id))
        return next
      })
      // Update locally
      setScores((prev) =>
        prev.map((s) =>
          scoreIds.includes(s.id) ? { ...s, status: "confirmed", rejection_reason: null } : s
        )
      )
      setSelected(new Set())
    } else {
      const json = await res.json()
      alert(json.error || "Error al confirmar")
    }
  }

  // Confirm all scores for an athlete at once (mobile)
  const handleConfirmAthlete = async (group: AthleteGroup) => {
    const pendingIds = group.scores
      .filter((s) => s.status === "pending" || s.status === "rejected")
      .map((s) => s.id)
    if (pendingIds.length === 0) return
    await handleConfirm(pendingIds)
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
      // Update locally — mark as rejected
      const rejectedIds = new Set(rejectDialog.scoreIds)
      setScores((prev) =>
        prev.map((s) =>
          rejectedIds.has(s.id)
            ? { ...s, status: "rejected", rejection_reason: rejectReason || "Sin razón especificada" }
            : s
        )
      )
      setSelected(new Set())
    } else {
      const json = await res.json()
      alert(json.error || "Error al rechazar")
    }
  }

  const showCredential = async (athleteId: string) => {
    const res = await fetch(`/api/athletes/${athleteId}`)
    if (res.ok) {
      const json = await res.json()
      setCredentialAthlete(json.data)
    }
  }

  const pendingScores = scores.filter((s) => s.status === "pending")
  const actionableScores = scores.filter((s) => s.status !== "confirmed")

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
            {loading
              ? "Cargando..."
              : `${pendingScores.length} pendientes · ${athleteGroups.length} atletas · ${scores.length} scores`}
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
          <option value="masters45_male">Masters 45+ Masculino</option>
          <option value="masters45_female">Masters 45+ Femenino</option>
          <option value="teens_male">Teens Masculino</option>
          <option value="teens_female">Teens Femenino</option>
        </select>
        <select
          className="h-9 rounded-lg border border-gray-700 bg-[#111] px-3 text-xs text-white lg:w-36 lg:text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="rejected">Rechazados</option>
          <option value="all">Todos</option>
        </select>
      </div>

      {/* Quick approve all */}
      {actionableScores.length > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-green-800 bg-green-950/30 px-3 py-2">
          <span className="text-xs text-green-400">
            {actionableScores.length} por validar
          </span>
          <Button
            size="sm"
            className="h-8 gap-1 bg-green-700 text-xs hover:bg-green-600"
            onClick={() => handleConfirm(actionableScores.map((s) => s.id))}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
            Aprobar todos
          </Button>
        </div>
      )}

      {/* ==================== MOBILE VIEW ==================== */}
      <div className="flex flex-col gap-3 lg:hidden">
        {athleteGroups.length === 0 && !loading && (
          <div className="py-16 text-center text-sm text-gray-500">
            No hay scores con los filtros actuales
          </div>
        )}

        {athleteGroups.map((group) => {
          const isExpanded = expandedAthleteId === group.athleteId
          const allConfirmed = group.scores.every((s) => s.status === "confirmed")
          const hasRejected = group.scores.some((s) => s.status === "rejected")
          const hasPending = group.scores.some((s) => s.status === "pending")
          const wasJustConfirmedAll = group.scores.every((s) => justConfirmed.has(s.id))
          const divBadge = getDivisionBadge(group.division)

          return (
            <div
              key={group.athleteId}
              ref={isExpanded ? expandedRef : undefined}
              className={`rounded-xl border transition-all duration-300 ${
                wasJustConfirmedAll
                  ? "border-green-600 bg-green-950/40"
                  : isExpanded
                    ? "border-primary bg-[#111]"
                    : allConfirmed
                      ? "border-green-900/50 bg-green-950/20"
                      : hasRejected
                        ? "border-red-900/50 bg-red-950/20"
                        : "border-gray-800 bg-[#111]"
              }`}
            >
              {/* Athlete header — tap to expand */}
              <button
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
                onClick={() => setExpandedAthleteId(isExpanded ? null : group.athleteId)}
              >
                {/* Status indicator */}
                <div className="flex flex-col gap-0.5">
                  {group.scores.map((s) => (
                    <div key={s.id} className={`h-2 w-1 rounded-full ${statusColor(s.status)}`} />
                  ))}
                </div>

                {/* Athlete info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="truncate text-sm font-semibold text-white">
                        {group.athleteName}
                      </span>
                    </div>
                    {divBadge.bgColor ? (
                      <span
                        className="rounded px-2 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: divBadge.bgColor }}
                      >
                        {divBadge.text}
                      </span>
                    ) : (
                      <span className="rounded border border-gray-600 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                        {divBadge.text}
                      </span>
                    )}
                  </div>
                  {/* WOD summary */}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {group.scores.map((s) => (
                      <span
                        key={s.id}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          s.status === "confirmed"
                            ? "bg-green-950 text-green-400"
                            : s.status === "rejected"
                              ? "bg-red-950 text-red-400"
                              : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {s.wod.name}: {s.display_score}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Credential + Expand */}
                <button
                  className="shrink-0 rounded-lg p-1.5 text-primary active:bg-gray-800"
                  onClick={(e) => { e.stopPropagation(); showCredential(group.athleteId) }}
                >
                  <IdCard className="h-4 w-4" />
                </button>
                <ChevronDown className={`h-4 w-4 shrink-0 text-gray-600 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`} />
              </button>

              {/* Expanded panel — show all WODs */}
              {isExpanded && (
                <div className="border-t border-gray-800 px-3 pb-3 pt-2">
                  {group.scores.map((score) => (
                    <div key={score.id} className="mb-2 rounded-lg border border-gray-800 bg-[#0a0a0a] p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-1 rounded-full ${statusColor(score.status)}`} />
                          <span className="text-sm font-medium text-gray-300">{score.wod.name}</span>
                        </div>
                        <span className="font-mono text-base font-bold text-primary">
                          {score.display_score}
                        </span>
                      </div>

                      {/* Rejection reason */}
                      {score.status === "rejected" && score.rejection_reason && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-950/50 p-2 text-xs text-red-300">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>{score.rejection_reason}</span>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <StatusBadge status={score.status} />
                        {score.scorer && (
                          <span>Juez: <span className="text-gray-400">{score.scorer.email.split("@")[0]}</span></span>
                        )}
                        {score.evidence_url && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewingImage(score.evidence_url) }}
                            className="flex items-center gap-1 text-primary"
                          >
                            <ImageIcon className="h-3 w-3" /> Foto
                          </button>
                        )}
                        {score.judge_notes && (
                          <span className="flex items-center gap-1" title={score.judge_notes}>
                            <StickyNote className="h-3 w-3" />
                            <span className="max-w-[150px] truncate">{score.judge_notes}</span>
                          </span>
                        )}
                      </div>

                      {/* Per-score actions (only if not confirmed) */}
                      {score.status !== "confirmed" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-700 py-2 text-xs font-bold text-white active:bg-green-600 disabled:opacity-50"
                            onClick={() => handleConfirm([score.id])}
                            disabled={actionLoading}
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Aprobar
                          </button>
                          <button
                            className="flex items-center justify-center gap-1 rounded-lg bg-red-900/80 px-4 py-2 text-xs font-bold text-red-300 active:bg-red-800 disabled:opacity-50"
                            onClick={() => openRejectDialog([score.id])}
                            disabled={actionLoading}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Batch actions for the whole athlete */}
                  {(hasPending || hasRejected) && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-bold text-white active:bg-green-600 disabled:opacity-50"
                        onClick={() => handleConfirmAthlete(group)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCheck className="h-5 w-5" />
                        )}
                        APROBAR TODOS
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-900/80 px-5 py-3 text-sm font-bold text-red-300 active:bg-red-800 disabled:opacity-50"
                        onClick={() =>
                          openRejectDialog(
                            group.scores.filter((s) => s.status !== "confirmed").map((s) => s.id)
                          )
                        }
                        disabled={actionLoading}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
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

        {/* Grouped by athlete */}
        <div className="flex flex-col gap-4">
          {athleteGroups.length === 0 && !loading && (
            <div className="py-12 text-center text-gray-500">
              No hay scores con los filtros actuales
            </div>
          )}

          {athleteGroups.map((group) => {
            const allConfirmed = group.scores.every((s) => s.status === "confirmed")
            const hasRejected = group.scores.some((s) => s.status === "rejected")
            const hasPending = group.scores.some((s) => s.status === "pending")
            const actionableIds = group.scores.filter((s) => s.status !== "confirmed").map((s) => s.id)
            const allGroupSelected = actionableIds.length > 0 && actionableIds.every((id) => selected.has(id))
            const divBadge = getDivisionBadge(group.division)

            return (
              <div
                key={group.athleteId}
                className={`overflow-hidden rounded-lg border ${
                  allConfirmed
                    ? "border-green-900/50 bg-green-950/10"
                    : hasRejected
                      ? "border-red-900/50 bg-red-950/10"
                      : "border-gray-800 bg-[#111]"
                }`}
              >
                {/* Athlete header */}
                <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
                  {actionableIds.length > 0 && (
                    <input
                      type="checkbox"
                      checked={allGroupSelected}
                      onChange={() => toggleAthleteSelect(group)}
                      className="h-4 w-4 accent-primary"
                    />
                  )}
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-white">{group.athleteName}</span>
                  <span className="text-xs text-gray-500">
                    {DIV_LABEL[group.division] || group.division}
                  </span>
                  {divBadge.bgColor ? (
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: divBadge.bgColor }}
                    >
                      {divBadge.text}
                    </span>
                  ) : (
                    <span className="rounded border border-gray-600 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                      {divBadge.text}
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-primary hover:bg-primary/10"
                      title="Ver credencial"
                      onClick={() => showCredential(group.athleteId)}
                    >
                      <IdCard className="h-3.5 w-3.5" />
                    </Button>
                    {(hasPending || hasRejected) && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 gap-1 text-xs text-green-400 hover:bg-green-950 hover:text-green-300"
                          onClick={() => handleConfirmAthlete(group)}
                          disabled={actionLoading}
                        >
                          <CheckCheck className="h-3.5 w-3.5" /> Aprobar todos
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-red-400 hover:bg-red-950 hover:text-red-300"
                          onClick={() => openRejectDialog(actionableIds)}
                          disabled={actionLoading}
                        >
                          <XCircle className="h-3.5 w-3.5" /> Rechazar
                        </Button>
                      </>
                    )}
                    {allConfirmed && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="h-3.5 w-3.5" /> Todo confirmado
                      </span>
                    )}
                  </div>
                </div>

                {/* Scores table */}
                <table className="w-full text-sm">
                  <tbody>
                    {group.scores.map((score) => (
                      <tr
                        key={score.id}
                        className={`border-b border-gray-800/30 transition-colors ${
                          justConfirmed.has(score.id)
                            ? "bg-green-950/30"
                            : selected.has(score.id)
                              ? "bg-primary/5"
                              : "hover:bg-gray-900/50"
                        }`}
                      >
                        <td className="w-10 px-3 py-2.5">
                          {score.status !== "confirmed" ? (
                            <input
                              type="checkbox"
                              checked={selected.has(score.id)}
                              onChange={() => toggleSelect(score.id)}
                              className="h-4 w-4 accent-primary"
                            />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
                            {score.wod.name}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-primary">
                          {score.display_score}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-500">
                          {score.scorer?.email?.split("@")[0] || "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={score.status} />
                        </td>
                        <td className="px-3 py-2.5">
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
                            {score.status === "rejected" && score.rejection_reason && (
                              <span
                                className="flex items-center gap-1 text-xs text-red-400"
                                title={score.rejection_reason}
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span className="max-w-[150px] truncate">{score.rejection_reason}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          {score.status !== "confirmed" && (
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 gap-1 text-xs text-green-400 hover:bg-green-950 hover:text-green-300"
                                onClick={() => handleConfirm([score.id])}
                                disabled={actionLoading}
                              >
                                <CheckCircle className="h-3.5 w-3.5" /> Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-red-400 hover:bg-red-950 hover:text-red-300"
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
                  </tbody>
                </table>
              </div>
            )
          })}
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
              Se rechazarán {rejectDialog.scoreIds.length} score(s). El juez podrá corregirlos y volver a enviar.
            </p>
            <textarea
              className="rounded-lg border border-gray-700 bg-[#111] p-3 text-sm text-white placeholder:text-gray-600"
              rows={3}
              placeholder="Razón del rechazo (requerido)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, scoreIds: [] })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
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

      {/* Athlete Credential */}
      <AthleteCredentialDialog
        athlete={credentialAthlete}
        onClose={() => setCredentialAthlete(null)}
      />
    </div>
  )
}

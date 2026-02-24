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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Filter, Image as ImageIcon, ShieldCheck, Loader2 } from "lucide-react"

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

export default function ValidateScoresPage() {
  const [scores, setScores] = useState<ScoreRow[]>([])
  const [wods, setWods] = useState<Wod[]>([])
  const [filterWod, setFilterWod] = useState("")
  const [filterDivision, setFilterDivision] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Validar Scores
        </h1>
        <p className="text-sm text-gray-400">
          Revisa y aprueba los scores capturados por los jueces.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Filter className="hidden h-4 w-4 text-gray-400 sm:block" />
        <Select value={filterWod} onValueChange={setFilterWod}>
          <SelectTrigger className="sm:w-48">
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
          className="rounded-lg border border-gray-700 bg-[#111] px-3 py-2 text-sm text-white sm:w-52"
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
          className="rounded-lg border border-gray-700 bg-[#111] px-3 py-2 text-sm text-white sm:w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="all">Todos</option>
        </select>
        <span className="text-sm text-gray-500">
          {loading ? "Cargando..." : `${scores.length} scores — ${pendingCount} pendientes`}
        </span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3">
          <span className="text-sm text-gray-300">{selected.size} seleccionado(s)</span>
          <Button
            size="sm"
            className="gap-1 bg-green-700 hover:bg-green-600"
            onClick={() => handleConfirm(Array.from(selected))}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Aprobar ({selected.size})
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-1"
            onClick={() => openRejectDialog(Array.from(selected))}
            disabled={actionLoading}
          >
            <XCircle className="h-4 w-4" />
            Rechazar ({selected.size})
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111]">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={scores.length > 0 && selected.size === scores.length}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-primary"
                />
              </TableHead>
              <TableHead>Atleta</TableHead>
              <TableHead>División</TableHead>
              <TableHead>WOD</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Modo</TableHead>
              <TableHead>Juez</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Evidencia</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score.id} className={selected.has(score.id) ? "bg-gray-900" : ""}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.has(score.id)}
                    onChange={() => toggleSelect(score.id)}
                    className="h-4 w-4 accent-primary"
                  />
                </TableCell>
                <TableCell className="font-medium">{score.athlete.full_name}</TableCell>
                <TableCell className="text-xs capitalize text-gray-400">
                  {score.athlete.division.replace(/_/g, " ")}
                </TableCell>
                <TableCell>{score.wod.name}</TableCell>
                <TableCell className="font-mono font-bold text-primary">
                  {score.display_score}
                </TableCell>
                <TableCell>
                  <Badge variant={score.is_rx ? "default" : "secondary"}>
                    {score.is_rx ? "RX" : "Scaled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {score.scorer?.email?.split("@")[0] || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={score.status === "confirmed" ? "default" : "outline"}
                    className={
                      score.status === "confirmed"
                        ? "border-green-700 bg-green-950 text-green-400"
                        : "border-yellow-700 text-yellow-400"
                    }
                  >
                    {score.status === "confirmed" ? "Confirmado" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {score.evidence_url ? (
                    <button
                      onClick={() => setViewingImage(score.evidence_url)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ImageIcon className="h-3 w-3" />
                      Ver
                    </button>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {score.judge_notes ? (
                    <span
                      className="block max-w-[100px] truncate text-xs text-gray-400"
                      title={score.judge_notes}
                    >
                      {score.judge_notes}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {new Date(score.updated_at).toLocaleString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {score.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Aprobar"
                          onClick={() => handleConfirm([score.id])}
                          disabled={actionLoading}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Rechazar"
                          onClick={() => openRejectDialog([score.id])}
                          disabled={actionLoading}
                        >
                          <XCircle className="h-4 w-4 text-red-400" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && scores.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="py-8 text-center text-gray-400">
                  No hay scores con los filtros actuales
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
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

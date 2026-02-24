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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Pencil, Filter, CheckCircle, Image as ImageIcon, History } from "lucide-react"
import { getDivisionBadge } from "@/lib/divisions"

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
}

interface Wod {
  id: string
  name: string
}

export default function ScoresManagePage() {
  const [scores, setScores] = useState<ScoreRow[]>([])
  const [wods, setWods] = useState<Wod[]>([])
  const [filterWod, setFilterWod] = useState("")
  const [filterDivision, setFilterDivision] = useState("")
  const [loading, setLoading] = useState(false)

  const [editingScore, setEditingScore] = useState<ScoreRow | null>(null)
  const [editDisplayScore, setEditDisplayScore] = useState("")
  const [editIsRx, setEditIsRx] = useState(true)
  const [editError, setEditError] = useState<string | null>(null)
  const [editSaving, setEditSaving] = useState(false)

  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [auditScoreId, setAuditScoreId] = useState<string | null>(null)
  const [auditData, setAuditData] = useState<Array<{
    id: string
    action: string
    old_values: Record<string, unknown> | null
    new_values: Record<string, unknown> | null
    performed_at: string
    performer: { email: string; role: string }
  }>>([])
  const [auditLoading, setAuditLoading] = useState(false)

  useEffect(() => {
    fetch("/api/wods")
      .then((r) => r.json())
      .then((json) => setWods(json.data ?? []))
  }, [])

  const fetchScores = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterWod) params.set("wod_id", filterWod)
    const res = await fetch(`/api/scores?${params}`)
    const json = await res.json()
    let data: ScoreRow[] = json.data ?? []

    if (filterDivision) {
      data = data.filter((s) => s.athlete.division === filterDivision)
    }
    setScores(data)
    setLoading(false)
  }, [filterWod, filterDivision])

  useEffect(() => {
    fetchScores()
  }, [fetchScores])

  const handleDelete = async (score: ScoreRow) => {
    if (!confirm(`¿Eliminar el score de ${score.athlete.full_name} en ${score.wod.name}?`))
      return
    const res = await fetch(`/api/scores/${score.id}`, { method: "DELETE" })
    if (res.ok) fetchScores()
    else {
      const json = await res.json()
      alert(json.error || "Error al eliminar")
    }
  }

  const handleConfirm = async (score: ScoreRow) => {
    const res = await fetch(`/api/scores/${score.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    })
    if (res.ok) fetchScores()
  }

  const openAudit = async (scoreId: string) => {
    setAuditScoreId(scoreId)
    setAuditLoading(true)
    setAuditData([])
    const res = await fetch(`/api/scores/${scoreId}/audit`)
    const json = await res.json()
    setAuditData(json.data ?? [])
    setAuditLoading(false)
  }

  const openEdit = (score: ScoreRow) => {
    setEditingScore(score)
    setEditDisplayScore(score.display_score)
    setEditIsRx(score.is_rx)
    setEditError(null)
  }

  const handleEditSave = async () => {
    if (!editingScore) return
    setEditSaving(true)
    setEditError(null)

    const res = await fetch(`/api/scores/${editingScore.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_score: editDisplayScore,
        is_rx: editIsRx,
      }),
    })

    const json = await res.json()
    setEditSaving(false)

    if (!res.ok) {
      setEditError(json.error || "Error al guardar")
      return
    }
    setEditingScore(null)
    fetchScores()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Gestión de Scores</h1>
        <p className="text-sm text-gray-400">
          Ver, editar y eliminar scores capturados.
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
          <option value="masters35_male">Masters 35+ Masculino</option>
          <option value="masters35_female">Masters 35+ Femenino</option>
        </select>
        <span className="text-sm text-gray-500">
          {loading ? "Cargando..." : `${scores.length} scores`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111]">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Atleta</TableHead>
              <TableHead>División</TableHead>
              <TableHead>WOD</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Modo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Evidencia</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score.id}>
                <TableCell className="font-medium">
                  {score.athlete.full_name}
                </TableCell>
                <TableCell className="text-xs capitalize text-gray-400">
                  {score.athlete.division.replace(/_/g, " ")}
                </TableCell>
                <TableCell>{score.wod.name}</TableCell>
                <TableCell className="font-mono font-bold text-primary">
                  {score.display_score}
                </TableCell>
                <TableCell>
                  {(() => {
                    const badge = getDivisionBadge(score.athlete.division)
                    return (
                      <Badge
                        variant={badge.bgColor ? "default" : "secondary"}
                        style={badge.bgColor ? { backgroundColor: badge.bgColor } : undefined}
                      >
                        {badge.text}
                      </Badge>
                    )
                  })()}
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
                      Ver foto
                    </button>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {score.judge_notes ? (
                    <span
                      className="max-w-[120px] truncate text-xs text-gray-400 block"
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
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Confirmar score"
                        onClick={() => handleConfirm(score)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Historial"
                      onClick={() => openAudit(score.id)}
                    >
                      <History className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(score)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(score)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && scores.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-8 text-center text-gray-400"
                >
                  No hay scores con los filtros actuales
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingScore}
        onOpenChange={(open) => !open && setEditingScore(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar Score — {editingScore?.athlete.full_name} /{" "}
              {editingScore?.wod.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label>Display Score</Label>
              <Input
                value={editDisplayScore}
                onChange={(e) => setEditDisplayScore(e.target.value)}
                className="font-mono"
                placeholder="Ej: 12:30 o 150 reps o 95 kg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Para cambios de ranking, elimina y recaptura el score.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label>Modalidad:</Label>
              <div className="flex gap-2">
                {[true, false].map((rx) => (
                  <button
                    key={String(rx)}
                    type="button"
                    onClick={() => setEditIsRx(rx)}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                      editIsRx === rx
                        ? "bg-primary text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {rx ? "RX" : "Scaled"}
                  </button>
                ))}
              </div>
            </div>
            {editError && (
              <p className="text-sm text-red-500">{editError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingScore(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave} disabled={editSaving}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog
        open={!!viewingImage}
        onOpenChange={(open) => !open && setViewingImage(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Evidencia</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <img
              src={viewingImage}
              alt="Evidencia del score"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Audit Trail Dialog */}
      <Dialog
        open={!!auditScoreId}
        onOpenChange={(open) => !open && setAuditScoreId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Cambios
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            {auditLoading ? (
              <p className="py-6 text-center text-sm text-gray-400">Cargando...</p>
            ) : auditData.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">Sin historial</p>
            ) : (
              <div className="flex flex-col gap-3">
                {auditData.map((audit) => (
                  <div
                    key={audit.id}
                    className="rounded-lg border border-gray-800 bg-gray-900 p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <Badge
                        className={
                          audit.action === "created"
                            ? "bg-blue-950 text-blue-400"
                            : audit.action === "confirmed"
                              ? "bg-green-950 text-green-400"
                              : audit.action === "rejected"
                                ? "bg-red-950 text-red-400"
                                : audit.action === "deleted"
                                  ? "bg-red-950 text-red-400"
                                  : "bg-yellow-950 text-yellow-400"
                        }
                      >
                        {audit.action === "created"
                          ? "Creado"
                          : audit.action === "confirmed"
                            ? "Confirmado"
                            : audit.action === "rejected"
                              ? "Rechazado"
                              : audit.action === "deleted"
                                ? "Eliminado"
                                : "Editado"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(audit.performed_at).toLocaleString("es-MX", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Por: {audit.performer.email} ({audit.performer.role})
                    </p>
                    {audit.old_values && (
                      <p className="mt-1 text-xs text-gray-500">
                        Anterior: {JSON.stringify(audit.old_values)}
                      </p>
                    )}
                    {audit.new_values && (
                      <p className="text-xs text-gray-500">
                        Nuevo: {JSON.stringify(audit.new_values)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

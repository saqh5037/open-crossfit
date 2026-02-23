"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface Wod {
  id: string
  name: string
  day_number: number
  description: string | null
  score_type: string
  time_cap_seconds: number | null
  is_active: boolean
}

export default function WodsPage() {
  const [wods, setWods] = useState<Wod[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Wod | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [dayNumber, setDayNumber] = useState("")
  const [description, setDescription] = useState("")
  const [scoreType, setScoreType] = useState("")
  const [timeCap, setTimeCap] = useState("")

  const fetchWods = async () => {
    const res = await fetch("/api/wods")
    const json = await res.json()
    setWods(json.data ?? [])
  }

  useEffect(() => {
    fetchWods()
  }, [])

  const resetForm = () => {
    setName("")
    setDayNumber("")
    setDescription("")
    setScoreType("")
    setTimeCap("")
    setEditing(null)
    setError(null)
  }

  const openEdit = (wod: Wod) => {
    setEditing(wod)
    setName(wod.name)
    setDayNumber(String(wod.day_number))
    setDescription(wod.description ?? "")
    setScoreType(wod.score_type)
    setTimeCap(wod.time_cap_seconds ? String(wod.time_cap_seconds) : "")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const body = {
      name,
      day_number: parseInt(dayNumber),
      description,
      score_type: scoreType,
      time_cap_seconds: timeCap ? parseInt(timeCap) : undefined,
    }

    try {
      const url = editing ? `/api/wods/${editing.id}` : "/api/wods"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Error al guardar")
        setSaving(false)
        return
      }

      setDialogOpen(false)
      resetForm()
      fetchWods()
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este WOD?")) return

    const res = await fetch(`/api/wods/${id}`, { method: "DELETE" })
    const json = await res.json()
    if (!res.ok) {
      alert(json.error || "Error al eliminar")
      return
    }
    fetchWods()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Gestión de WODs</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo WOD
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar WOD" : "Nuevo WOD"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div>
                <Label>Nombre</Label>
                <Input placeholder="Ej: 26.1" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Día</Label>
                <Input type="number" min="1" value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} />
              </div>
              <div>
                <Label>Tipo de Score</Label>
                <Select value={scoreType} onValueChange={setScoreType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Tiempo (For Time)</SelectItem>
                    <SelectItem value="reps">Repeticiones (AMRAP)</SelectItem>
                    <SelectItem value="weight">Peso (Max Load)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Cap (segundos, opcional)</Label>
                <Input type="number" value={timeCap} onChange={(e) => setTimeCap(e.target.value)} />
              </div>
              <div>
                <Label>Descripción</Label>
                <textarea
                  className="w-full rounded-lg border-2 border-gray-700 bg-black px-3 py-2 text-sm text-white"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button onClick={handleSave} disabled={saving || !name || !dayNumber || !scoreType}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111]">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Día</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Time Cap</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wods.map((wod) => (
              <TableRow key={wod.id}>
                <TableCell className="font-medium">{wod.name}</TableCell>
                <TableCell>{wod.day_number}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {wod.score_type === "time" ? "For Time" : wod.score_type === "reps" ? "Reps" : "Max Load"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {wod.time_cap_seconds ? `${Math.floor(wod.time_cap_seconds / 60)} min` : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={wod.is_active ? "default" : "secondary"}>
                    {wod.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(wod)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(wod.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {wods.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-gray-400">
                  No hay WODs creados. Crea el primero.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

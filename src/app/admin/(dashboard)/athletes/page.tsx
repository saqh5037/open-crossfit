"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getDivisionsByGender } from "@/lib/divisions"
import { Search, Trash2, Pencil, Loader2, Camera, X, Shield } from "lucide-react"

interface Athlete {
  id: string
  participant_number: number
  full_name: string
  email: string | null
  phone: string | null
  gender: string
  division: string
  birth_date: string | null
  photo_url: string | null
  created_at: string
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [search, setSearch] = useState("")
  const [divisionFilter, setDivisionFilter] = useState("")

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [isJudge, setIsJudge] = useState(false)

  // Edit form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [gender, setGender] = useState("")
  const [division, setDivision] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [makeJudge, setMakeJudge] = useState(false)
  const [judgePassword, setJudgePassword] = useState("")
  const photoInputRef = useRef<HTMLInputElement>(null)

  const fetchAthletes = async () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (divisionFilter) params.set("division", divisionFilter)

    const res = await fetch(`/api/athletes?${params}`)
    const json = await res.json()
    setAthletes(json.data ?? [])
  }

  useEffect(() => {
    fetchAthletes()
  }, [divisionFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(fetchAthletes, 300)
    return () => clearTimeout(timer)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name}? Se borrarán todos sus scores.`)) return

    const res = await fetch(`/api/athletes/${id}`, { method: "DELETE" })
    if (res.ok) fetchAthletes()
    else alert("Error al eliminar")
  }

  const openEdit = async (athlete: Athlete) => {
    setEditId(athlete.id)
    setEditError(null)
    setSaving(false)
    setMakeJudge(false)
    setJudgePassword("")
    setPhotoFile(null)
    setPhotoPreview(null)
    setEditOpen(true)
    setLoadingEdit(true)

    try {
      const res = await fetch(`/api/athletes/${athlete.id}`)
      const json = await res.json()
      const a = json.data
      setFullName(a.full_name)
      setEmail(a.email || "")
      setPhone(a.phone || "")
      setBirthDate(a.birth_date ? a.birth_date.split("T")[0] : "")
      setGender(a.gender)
      setDivision(a.division)
      setPhotoUrl(a.photo_url)
      setIsJudge(json.isJudge ?? false)
    } catch {
      setEditError("Error al cargar datos")
    } finally {
      setLoadingEdit(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setEditError("La foto excede 5MB")
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const clearPhoto = () => {
    setPhotoFile(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  const handleSave = async () => {
    if (!editId) return
    setSaving(true)
    setEditError(null)

    try {
      // Upload photo if new file selected
      let newPhotoUrl = photoUrl
      if (photoFile) {
        const formData = new FormData()
        formData.append("file", photoFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) {
          setEditError(uploadJson.error || "Error al subir foto")
          return
        }
        newPhotoUrl = uploadJson.url
      }

      const body: Record<string, unknown> = {
        full_name: fullName,
        email,
        phone,
        birth_date: birthDate,
        gender,
        division,
        photo_url: newPhotoUrl,
      }

      if (makeJudge && judgePassword.length >= 8) {
        body.judge_password = judgePassword
      }

      const res = await fetch(`/api/athletes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      if (!res.ok) {
        setEditError(json.error || "Error al guardar")
        return
      }

      setEditOpen(false)
      fetchAthletes()
    } catch {
      setEditError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  const filteredDivisions = gender
    ? getDivisionsByGender(gender as "M" | "F")
    : []

  const displayPhoto = photoPreview || photoUrl

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Atletas ({athletes.length})</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="rounded-md border border-gray-700 bg-[#111] px-3 py-2 text-sm text-white"
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
        >
          <option value="">Todas las divisiones</option>
          <option value="rx_male">RX Masculino</option>
          <option value="rx_female">RX Femenino</option>
          <option value="foundation_male">Principiante Masculino</option>
          <option value="foundation_female">Foundation Femenino</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111]">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>División</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athletes.map((a) => (
              <TableRow
                key={a.id}
                className="cursor-pointer"
                onClick={() => openEdit(a)}
              >
                <TableCell className="font-display text-primary">
                  {String(a.participant_number).padStart(3, "0")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {a.photo_url ? (
                      <img src={a.photo_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-[10px] text-gray-500">
                        {a.full_name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium">{a.full_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{a.gender}</Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {a.division.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="text-gray-400">{a.email || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Editar"
                      onClick={(e) => { e.stopPropagation(); openEdit(a) }}
                    >
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); handleDelete(a.id, a.full_name) }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {athletes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-gray-400">
                  No se encontraron atletas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Athlete Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) setEditOpen(false) }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Atleta</DialogTitle>
          </DialogHeader>

          {loadingEdit ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Photo */}
              <div>
                <Label>Foto</Label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="mt-1 flex items-center gap-3">
                  {displayPhoto ? (
                    <div className="relative">
                      <img
                        src={displayPhoto}
                        alt=""
                        className="h-16 w-16 rounded-full border-2 border-primary object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { clearPhoto(); setPhotoUrl(null) }}
                        className="absolute -right-1 -top-1 rounded-full bg-black p-0.5"
                      >
                        <X className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-900 text-xl text-gray-500">
                      {fullName.charAt(0) || "?"}
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Cambiar foto
                  </Button>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label>Nombre completo</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              {/* Phone */}
              <div>
                <Label>Teléfono</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              {/* Birth date */}
              <div>
                <Label>Fecha de nacimiento</Label>
                <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>

              {/* Gender */}
              <div>
                <Label>Género</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => {
                    setGender(v)
                    setDivision("") // reset division when gender changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Division */}
              <div>
                <Label>División</Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDivisions.map((d) => (
                      <SelectItem key={d.key} value={d.key}>
                        {d.label} ({d.description})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Judge section */}
              <div className="rounded-lg border border-gray-800 bg-[#0a0a0a] p-4">
                {isJudge ? (
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <Shield className="h-4 w-4" />
                    Este atleta ya es juez
                  </div>
                ) : (
                  <>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={makeJudge}
                        onChange={(e) => setMakeJudge(e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-gray-600 accent-primary"
                      />
                      <div>
                        <span className="font-semibold text-white">Hacer Juez</span>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Crear cuenta de juez para este atleta
                        </p>
                      </div>
                    </label>
                    {makeJudge && (
                      <div className="mt-3">
                        <Label>Contraseña de juez</Label>
                        <Input
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={judgePassword}
                          onChange={(e) => setJudgePassword(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {editError && <p className="text-sm text-red-500">{editError}</p>}

              <Button
                onClick={handleSave}
                disabled={saving || !fullName || !email || (makeJudge && judgePassword.length < 8)}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

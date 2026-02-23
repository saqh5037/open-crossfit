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
import { Plus, Pencil, Trash2, Loader2, KeyRound } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  role: "owner" | "admin" | "coach" | "judge"
  created_at: string
}

const roleLabel: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  coach: "Coach",
  judge: "Judge",
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "coach" | "judge">("judge")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => setCurrentUserId(json?.user?.id ?? null))
  }, [])

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users")
    const json = await res.json()
    setUsers(json.data ?? [])
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setRole("judge")
    setEditing(null)
    setError(null)
  }

  const openEdit = (user: AdminUser) => {
    setEditing(user)
    setEmail(user.email)
    setPassword("")
    setRole(user.role === "owner" ? "admin" : (user.role as "admin" | "coach" | "judge"))
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const body = editing
      ? { role, ...(password ? { password } : {}) }
      : { email, password, role }

    const url = editing ? `/api/admin/users/${editing.id}` : "/api/admin/users"
    const method = editing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Error al guardar")
        return
      }
      setDialogOpen(false)
      resetForm()
      fetchUsers()
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, userEmail: string) => {
    if (!confirm(`¿Eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`)) return

    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    const json = await res.json()
    if (!res.ok) {
      alert(json.error || "Error al eliminar")
      return
    }
    fetchUsers()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios Admin</h1>
          <p className="mt-1 text-sm text-gray-400">
            Crea y gestiona cuentas de admin y jueces.
          </p>
        </div>
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
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Usuario" : "Nuevo Usuario Admin"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {!editing && (
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="juez@tubox.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              {editing && (
                <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-gray-400">
                  {editing.email}
                </div>
              )}
              <div>
                <Label>
                  {editing
                    ? "Nueva contraseña (dejar vacío para no cambiar)"
                    : "Contraseña"}
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder={editing ? "••••••••" : "Mínimo 8 caracteres"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Rol</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as "admin" | "coach" | "judge")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="judge">
                      Judge — Solo captura scores
                    </SelectItem>
                    <SelectItem value="coach">
                      Coach — Scores + WODs + Atletas
                    </SelectItem>
                    <SelectItem value="admin">
                      Admin — Gestión completa (sin Users)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                onClick={handleSave}
                disabled={saving || (!editing && (!email || !password))}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Actualizar" : "Crear Usuario"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111]">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "owner"
                        ? "default"
                        : user.role === "admin"
                          ? "secondary"
                          : user.role === "coach"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {roleLabel[user.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">
                  {new Date(user.created_at).toLocaleDateString("es-MX")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.role !== "owner" ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={user.id === currentUserId}
                          onClick={() => handleDelete(user.id, user.email)}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </>
                    ) : (
                      <span className="px-3 py-1 text-xs text-gray-600">
                        Protegido
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-gray-400"
                >
                  No hay usuarios. Crea el primero.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

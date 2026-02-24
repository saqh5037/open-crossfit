"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2 } from "lucide-react"

interface Athlete {
  id: string
  participant_number: number
  full_name: string
  email: string | null
  phone: string | null
  gender: string
  division: string
  photo_url: string | null
  created_at: string
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [search, setSearch] = useState("")
  const [divisionFilter, setDivisionFilter] = useState("")

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
          <option value="scaled_male">Scaled Masculino</option>
          <option value="scaled_female">Scaled Femenino</option>
          <option value="foundation_male">Foundation Masculino</option>
          <option value="foundation_female">Foundation Femenino</option>
          <option value="masters35_male">Masters 35+ Masculino</option>
          <option value="masters35_female">Masters 35+ Femenino</option>
          <option value="masters45_male">Masters 45+ Masculino</option>
          <option value="masters45_female">Masters 45+ Femenino</option>
          <option value="teens_male">Teens Masculino</option>
          <option value="teens_female">Teens Femenino</option>
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
              <TableRow key={a.id}>
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(a.id, a.full_name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
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
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getDivisionBadge, getDivisionLabel } from "@/lib/divisions"
import { Search, Trash2, IdCard, Download } from "lucide-react"

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
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [qrBaseUrl, setQrBaseUrl] = useState("")
  const credentialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/event-config")
      .then((r) => r.json())
      .then((json) => {
        const base = json.data?.qr_base_url || window.location.origin + "/atleta/"
        setQrBaseUrl(base.endsWith("/") ? base : base + "/")
      })
  }, [])

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

  const getAge = (birthDate: string | null) => {
    if (!birthDate) return null
    return Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const downloadCredential = async () => {
    if (!credentialRef.current || !selectedAthlete) return

    // Use html2canvas for screenshot
    const { default: html2canvas } = await import("html2canvas")
    const canvas = await html2canvas(credentialRef.current, {
      backgroundColor: "#000000",
      scale: 2,
      useCORS: true,
    })

    const link = document.createElement("a")
    link.download = `credencial-${selectedAthlete.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
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
              <TableRow
                key={a.id}
                className="cursor-pointer"
                onClick={() => setSelectedAthlete(a)}
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
                      title="Ver credencial"
                      onClick={(e) => { e.stopPropagation(); setSelectedAthlete(a) }}
                    >
                      <IdCard className="h-4 w-4 text-primary" />
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

      {/* Credential Dialog */}
      <Dialog open={!!selectedAthlete} onOpenChange={(open) => !open && setSelectedAthlete(null)}>
        <DialogContent className="max-w-sm border-gray-800 bg-black p-0 sm:max-w-md">
          {selectedAthlete && (() => {
            const paddedNumber = String(selectedAthlete.participant_number).padStart(3, "0")
            const divBadge = getDivisionBadge(selectedAthlete.division)
            const divLabel = getDivisionLabel(selectedAthlete.division)
            const age = getAge(selectedAthlete.birth_date)
            const qrUrl = qrBaseUrl + selectedAthlete.id

            return (
              <>
                {/* Credential card */}
                <div ref={credentialRef} className="flex flex-col items-center bg-black px-6 pb-6 pt-8">
                  {/* Logo + Event */}
                  <div className="mb-1 flex items-center gap-2">
                    <img src="/logo-80.png" alt="" className="h-8 w-8 rounded" />
                    <span className="font-display text-2xl tracking-wider text-white">GRIZZLYS</span>
                  </div>
                  <p className="mb-4 text-[10px] uppercase tracking-widest text-gray-500">
                    OPEN 2026
                  </p>

                  {/* Number */}
                  <div className="font-display text-7xl tracking-wider text-primary">
                    #{paddedNumber}
                  </div>

                  {/* Photo */}
                  <div className="my-4 h-28 w-28 overflow-hidden rounded-full border-4 border-primary">
                    {selectedAthlete.photo_url ? (
                      <img
                        src={selectedAthlete.photo_url}
                        alt={selectedAthlete.full_name}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-900">
                        <img src="/logo-80.png" alt="" className="h-16 w-16 opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-center font-display text-3xl uppercase tracking-wider text-white">
                    {selectedAthlete.full_name}
                  </p>

                  {/* Division badge */}
                  <div className="mt-2 flex items-center gap-2">
                    {divBadge.bgColor ? (
                      <span
                        className="rounded-md px-3 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: divBadge.bgColor }}
                      >
                        {divLabel}
                      </span>
                    ) : (
                      <span className="rounded-md border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300">
                        {divLabel}
                      </span>
                    )}
                    {age && (
                      <span className="text-xs text-gray-500">{age} años</span>
                    )}
                  </div>

                  {/* QR Code */}
                  {qrUrl && (
                    <div className="mt-5 rounded-xl bg-white p-3">
                      <QRCodeSVG value={qrUrl} size={140} level="H" />
                    </div>
                  )}
                  <p className="mt-2 text-[10px] text-gray-600">
                    Escanea para ver el perfil
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-800 px-6 py-4">
                  <Button
                    className="flex-1 gap-2"
                    onClick={downloadCredential}
                  >
                    <Download className="h-4 w-4" />
                    Descargar imagen
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(`/atleta/${selectedAthlete.id}`, "_blank")}
                  >
                    Ver perfil
                  </Button>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

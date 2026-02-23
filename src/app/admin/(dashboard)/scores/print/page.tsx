"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Printer, Loader2 } from "lucide-react"

interface Wod {
  id: string
  name: string
  day_number: number
  description: string | null
  score_type: string
  time_cap_seconds: number | null
}

interface Athlete {
  id: string
  full_name: string
  division: string
  gender: string
}

const ATHLETES_PER_PAGE = 15

export default function PrintScoreSheetsPage() {
  const [wods, setWods] = useState<Wod[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedWodId, setSelectedWodId] = useState("")
  const [selectedDivision, setSelectedDivision] = useState("all")
  const [divisions, setDivisions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/wods").then((r) => r.json()),
      fetch("/api/athletes").then((r) => r.json()),
      fetch("/api/event-config").then((r) => r.json()),
    ]).then(([wodsJson, athletesJson, configJson]) => {
      const active = wodsJson.data?.filter((w: Wod & { is_active: boolean }) => w.is_active) ?? []
      setWods(active)
      setAthletes(athletesJson.data ?? [])
      setDivisions(configJson.data?.divisions ?? [])
      setLoading(false)
    })
  }, [])

  const selectedWod = wods.find((w) => w.id === selectedWodId)

  const filteredAthletes = athletes.filter((a) =>
    selectedDivision === "all" ? true : a.division === selectedDivision
  )

  // Split athletes into pages/heats
  const pages: Athlete[][] = []
  for (let i = 0; i < filteredAthletes.length; i += ATHLETES_PER_PAGE) {
    pages.push(filteredAthletes.slice(i, i + ATHLETES_PER_PAGE))
  }

  const scoreTypeLabel = (type: string) => {
    switch (type) {
      case "time": return "Tiempo (mm:ss)"
      case "reps": return "Repeticiones"
      case "weight": return "Peso (kg)"
      default: return type
    }
  }

  const formatTimeCap = (seconds: number | null) => {
    if (!seconds) return null
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return sec > 0 ? `${min}:${sec.toString().padStart(2, "0")}` : `${min} min`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div>
      {/* Controls (hidden when printing) */}
      <div className="mb-8 flex flex-col gap-4 print:hidden">
        <h1 className="text-2xl font-bold">Hojas de Score para Imprimir</h1>
        <p className="text-sm text-gray-400">
          Selecciona el WOD y la división para generar las hojas que los jueces llenarán a mano.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Label>WOD</Label>
            <Select value={selectedWodId} onValueChange={setSelectedWodId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona WOD" />
              </SelectTrigger>
              <SelectContent>
                {wods.map((wod) => (
                  <SelectItem key={wod.id} value={wod.id}>
                    Día {wod.day_number} — {wod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label>División</Label>
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las divisiones</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d.replace(/_/g, " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedWod && filteredAthletes.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {filteredAthletes.length} atletas · {pages.length} página{pages.length !== 1 ? "s" : ""}
            </span>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        )}

        {selectedWod && filteredAthletes.length === 0 && (
          <p className="text-sm text-gray-500">No hay atletas en esta división.</p>
        )}
      </div>

      {/* Printable Score Sheets */}
      {selectedWod && pages.map((pageAthletes, pageIndex) => (
        <div
          key={pageIndex}
          className="mb-8 break-after-page print:mb-0"
        >
          <div className="rounded-lg border border-gray-700 bg-white p-6 text-black print:rounded-none print:border print:border-black">
            {/* Sheet Header */}
            <div className="mb-4 border-b-2 border-black pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">GRIZZLYS</h2>
                  <p className="text-sm text-gray-600">CrossFit Open 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Día {selectedWod.day_number} — {selectedWod.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {scoreTypeLabel(selectedWod.score_type)}
                    {selectedWod.time_cap_seconds && ` · Time Cap: ${formatTimeCap(selectedWod.time_cap_seconds)}`}
                  </p>
                  {pages.length > 1 && (
                    <p className="text-xs text-gray-500">
                      Heat {pageIndex + 1} de {pages.length}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* WOD Description */}
            {selectedWod.description && (
              <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Descripción del WOD</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{selectedWod.description}</p>
              </div>
            )}

            {/* Score Table */}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-2 text-left w-8">#</th>
                  <th className="border border-gray-400 px-2 py-2 text-left">Nombre Atleta</th>
                  <th className="border border-gray-400 px-2 py-2 text-left w-28">División</th>
                  <th className="border border-gray-400 px-2 py-2 text-center w-24">Score</th>
                  <th className="border border-gray-400 px-2 py-2 text-center w-20">RX / Sc</th>
                  <th className="border border-gray-400 px-2 py-2 text-center w-24">Firma Atleta</th>
                  <th className="border border-gray-400 px-2 py-2 text-center w-24">Firma Juez</th>
                </tr>
              </thead>
              <tbody>
                {pageAthletes.map((athlete, i) => (
                  <tr key={athlete.id}>
                    <td className="border border-gray-400 px-2 py-3 text-center text-gray-500">
                      {pageIndex * ATHLETES_PER_PAGE + i + 1}
                    </td>
                    <td className="border border-gray-400 px-2 py-3 font-medium">
                      {athlete.full_name}
                    </td>
                    <td className="border border-gray-400 px-2 py-3 text-xs">
                      {athlete.division.replace(/_/g, " ").toUpperCase()}
                    </td>
                    <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                    <td className="border border-gray-400 px-2 py-3 text-center text-xs text-gray-400">
                      RX / Sc
                    </td>
                    <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                    <td className="border border-gray-400 px-2 py-3">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="mt-6 flex justify-between border-t border-gray-300 pt-4 text-sm">
              <div>
                <span className="text-gray-500">Juez: </span>
                <span className="inline-block w-48 border-b border-gray-400">&nbsp;</span>
              </div>
              <div>
                <span className="text-gray-500">Fecha: </span>
                <span className="inline-block w-32 border-b border-gray-400">&nbsp;</span>
              </div>
            </div>

            {/* Notes area */}
            <div className="mt-4">
              <p className="text-xs text-gray-500">Observaciones:</p>
              <div className="mt-1 h-16 rounded border border-gray-300">&nbsp;</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

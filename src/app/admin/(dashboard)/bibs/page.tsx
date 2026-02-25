"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
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

interface Athlete {
  id: string
  participant_number: number
  full_name: string
  division: string
  gender: string
  photo_url: string | null
}

const BIBS_PER_PAGE = 4

const divisionLabel: Record<string, string> = {
  rx_male: "RX Masculino",
  rx_female: "RX Femenino",
  foundation_male: "Foundation Masculino",
  foundation_female: "Foundation Femenino",
  masters45_male: "Masters 45+ M",
  masters45_female: "Masters 45+ F",
  teens_male: "Teens Masculino",
  teens_female: "Teens Femenino",
}

export default function BibsPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedDivision, setSelectedDivision] = useState("all")
  const [divisions, setDivisions] = useState<string[]>([])
  const [qrBaseUrl, setQrBaseUrl] = useState("")
  const [eventName, setEventName] = useState("CrossFit Open 2026")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/athletes").then((r) => r.json()),
      fetch("/api/event-config").then((r) => r.json()),
    ]).then(([athletesJson, configJson]) => {
      setAthletes(athletesJson.data ?? [])
      setDivisions(configJson.data?.divisions ?? [])
      setQrBaseUrl(configJson.data?.qr_base_url ?? "")
      setEventName(configJson.data?.name ?? "CrossFit Open 2026")
      setLoading(false)
    })
  }, [])

  const filteredAthletes = athletes
    .filter((a) => selectedDivision === "all" ? true : a.division === selectedDivision)
    .sort((a, b) => a.participant_number - b.participant_number)

  const pages: Athlete[][] = []
  for (let i = 0; i < filteredAthletes.length; i += BIBS_PER_PAGE) {
    pages.push(filteredAthletes.slice(i, i + BIBS_PER_PAGE))
  }

  const getQrUrl = (athleteId: string) => {
    const base = qrBaseUrl || (typeof window !== "undefined" ? window.location.origin + "/atleta/" : "/atleta/")
    const cleanBase = base.endsWith("/") ? base : base + "/"
    return `${cleanBase}${athleteId}`
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
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 print:hidden">
        <h1 className="text-2xl font-bold">Credenciales de Atletas</h1>
        <p className="text-sm text-gray-400">
          Genera e imprime las credenciales con número, foto y QR para cada atleta.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
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
                    {divisionLabel[d] ?? d.replace(/_/g, " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAthletes.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {filteredAthletes.length} atleta{filteredAthletes.length !== 1 ? "s" : ""} · {pages.length} página{pages.length !== 1 ? "s" : ""}
            </span>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        )}

        {filteredAthletes.length === 0 && (
          <p className="text-sm text-gray-500">No hay atletas en esta división.</p>
        )}
      </div>

      {/* Printable Bibs */}
      {pages.map((pageAthletes, pageIndex) => (
        <div
          key={pageIndex}
          className="mb-8 break-after-page print:mb-0"
        >
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-white p-4 text-black print:gap-2 print:rounded-none print:p-0">
            {pageAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex flex-col items-center border-2 border-black px-3 py-4 print:px-2 print:py-3"
              >
                {/* Header */}
                <div className="mb-2 flex items-center gap-2">
                  <img src="/logo-80.png" alt="" className="h-6 w-6 rounded" />
                  <span className="text-lg font-black tracking-wider">GRIZZLYS</span>
                </div>
                <p className="mb-3 text-[10px] uppercase tracking-wider text-gray-500">{eventName}</p>

                {/* Number */}
                <div className="text-5xl font-black leading-none print:text-4xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  #{String(athlete.participant_number).padStart(3, "0")}
                </div>

                {/* Photo */}
                <div className="my-3 h-24 w-24 overflow-hidden rounded-full border-2 border-black print:h-20 print:w-20">
                  {athlete.photo_url ? (
                    <img
                      src={athlete.photo_url}
                      alt={athlete.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src="/logo-80.png"
                      alt="GRIZZLYS"
                      className="h-full w-full object-cover opacity-30"
                    />
                  )}
                </div>

                {/* Name */}
                <p className="text-center text-sm font-bold uppercase leading-tight">
                  {athlete.full_name}
                </p>

                {/* Division */}
                <p className="mt-1 text-[10px] text-gray-600">
                  {divisionLabel[athlete.division] ?? athlete.division.replace(/_/g, " ").toUpperCase()}
                </p>

                {/* QR Code */}
                <div className="mt-3">
                  <QRCodeSVG
                    value={getQrUrl(athlete.id)}
                    size={72}
                    level="M"
                  />
                </div>
              </div>
            ))}

            {/* Fill empty slots to maintain 2x2 grid */}
            {pageAthletes.length < BIBS_PER_PAGE &&
              Array.from({ length: BIBS_PER_PAGE - pageAthletes.length }).map((_, i) => (
                <div key={`empty-${i}`} className="border-2 border-dashed border-gray-300" />
              ))
            }
          </div>
        </div>
      ))}
    </div>
  )
}

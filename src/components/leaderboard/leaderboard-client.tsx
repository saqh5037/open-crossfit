"use client"

import { useState, useEffect, useCallback } from "react"
import { LeaderboardTable } from "./leaderboard-table"
import { DivisionTabs } from "./division-tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { getPointsTable } from "@/lib/scoring"
import type { LeaderboardEntry } from "@/types"

interface WodHeader {
  id: string
  name: string
  score_type: string
}

interface LeaderboardClientProps {
  initialData: LeaderboardEntry[]
  initialWods: WodHeader[]
  initialDivision: string
  availableDivisions: string[]
  autoRefresh?: boolean
  refreshInterval?: number
}

export function LeaderboardClient({
  initialData,
  initialWods,
  initialDivision,
  availableDivisions,
  autoRefresh = true,
  refreshInterval = 30000,
}: LeaderboardClientProps) {
  const [division, setDivision] = useState(initialDivision)
  const [data, setData] = useState<LeaderboardEntry[]>(initialData)
  const [wods, setWods] = useState<WodHeader[]>(initialWods)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async (div: string) => {
    try {
      setError(null)
      const res = await fetch(`/api/leaderboard?division=${div}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.data) setData(json.data)
      if (json.wods) setWods(json.wods)
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
      setError("Error al cargar. Intenta de nuevo.")
    }
  }, [])

  // Change division
  const handleDivisionChange = async (newDivision: string) => {
    setDivision(newDivision)
    setLoading(true)
    await fetchLeaderboard(newDivision)
    setLoading(false)

    // Update URL without reload
    const url = new URL(window.location.href)
    url.searchParams.set("division", newDivision)
    window.history.replaceState({}, "", url.toString())
  }

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => fetchLeaderboard(division), refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, division, refreshInterval, fetchLeaderboard])

  const pointsTable = getPointsTable(20)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <DivisionTabs
          divisions={availableDivisions}
          selected={division}
          onChange={handleDivisionChange}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gray-400 hover:text-white">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">¿Cómo funciona?</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto border-gray-800 bg-[#111]">
            <DialogHeader>
              <DialogTitle>Sistema de Puntuación</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 text-sm text-gray-300">
              <p>
                Cada WOD se puntúa de forma independiente. El <strong className="text-white">1er lugar</strong> recibe <strong className="text-primary">100 puntos</strong>, y cada posición siguiente resta 3 puntos.
              </p>
              <div className="rounded-lg border border-gray-800 bg-black/50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Tabla de puntos</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {pointsTable.map(({ place, points }) => (
                    <div key={place} className="flex justify-between border-b border-gray-800/50 py-1">
                      <span className="text-gray-400">{place}° lugar</span>
                      <span className="font-bold text-primary">{points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black/50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Clasificación general</p>
                <p className="text-gray-400">
                  Se suman los puntos de todos los WODs. El atleta con <strong className="text-white">más puntos totales</strong> gana la clasificación general de su división.
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Los atletas que no completen un WOD reciben 0 puntos en ese evento.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-lg bg-red-950 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
        </div>
      ) : (
        <LeaderboardTable entries={data} wods={wods} />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { LeaderboardTable } from "./leaderboard-table"
import { DivisionTabs } from "./division-tabs"
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

  return (
    <div className="flex flex-col gap-6">
      <DivisionTabs
        divisions={availableDivisions}
        selected={division}
        onChange={handleDivisionChange}
      />

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

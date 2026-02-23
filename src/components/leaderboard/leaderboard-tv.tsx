"use client"

import { useState, useEffect, useCallback } from "react"
import type { LeaderboardEntry } from "@/types"
import { getDivisionLabel } from "@/lib/divisions"

interface WodHeader {
  id: string
  name: string
}

interface LeaderboardTVProps {
  initialData: LeaderboardEntry[]
  initialWods: WodHeader[]
  division: string
  eventName: string
}

export function LeaderboardTV({
  initialData,
  initialWods,
  division,
  eventName,
}: LeaderboardTVProps) {
  const [data, setData] = useState<LeaderboardEntry[]>(initialData)
  const [wods, setWods] = useState<WodHeader[]>(initialWods)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?division=${division}`)
      const json = await res.json()
      if (json.data) setData(json.data)
      if (json.wods) setWods(json.wods)
    } catch {
      // Silently fail on TV
    }
  }, [division])

  useEffect(() => {
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 p-8 text-white">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-5xl tracking-wider text-primary">GRIZZLYS</span>
          <div>
            <h1 className="text-4xl font-black uppercase">{eventName}</h1>
            <p className="text-xl text-gray-400">{getDivisionLabel(division)}</p>
          </div>
        </div>
        <div className="text-right text-gray-500">
          <p className="text-sm">Auto-refresh: 30s</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="w-20 py-4 text-center text-xl">#</th>
              <th className="py-4 text-left text-xl">Atleta</th>
              {wods.map((wod) => (
                <th key={wod.id} className="py-4 text-center text-xl">
                  {wod.name}
                </th>
              ))}
              <th className="py-4 text-center text-xl">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => {
              const rank = Number(entry.overall_rank)
              const isTop3 = rank <= 3
              const rankColors: Record<number, string> = {
                1: "text-yellow-400",
                2: "text-gray-300",
                3: "text-amber-600",
              }

              return (
                <tr
                  key={entry.id}
                  className={`border-b border-gray-900 ${isTop3 ? "bg-gray-900/50" : ""}`}
                >
                  <td className={`py-5 text-center text-2xl font-black ${rankColors[rank] || "text-gray-500"}`}>
                    {rank}
                  </td>
                  <td className="py-5 text-2xl font-bold">{entry.full_name}</td>
                  {wods.map((wod) => {
                    const result = entry.wod_results?.find((r) => r.wod_id === wod.id)
                    return (
                      <td key={wod.id} className="py-5 text-center">
                        {result ? (
                          <div>
                            <span className="text-lg text-gray-400">
                              {result.display_score}
                            </span>
                            <br />
                            <span className="text-2xl font-bold">{result.placement}</span>
                          </div>
                        ) : (
                          <span className="text-gray-700">—</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="py-5 text-center text-3xl font-black text-primary">
                    {Number(entry.total_points) || "—"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

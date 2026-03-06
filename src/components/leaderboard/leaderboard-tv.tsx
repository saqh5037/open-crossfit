"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import confetti from "canvas-confetti"
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

const medalConfig: Record<number, { emoji: string; bg: string; glow: string }> = {
  1: {
    emoji: "🥇",
    bg: "bg-gradient-to-br from-yellow-400/25 via-yellow-500/35 to-amber-600/25",
    glow: "shadow-[0_0_16px_rgba(234,179,8,0.5)]",
  },
  2: {
    emoji: "🥈",
    bg: "bg-gradient-to-br from-gray-300/25 via-gray-400/30 to-gray-500/20",
    glow: "shadow-[0_0_12px_rgba(156,163,175,0.4)]",
  },
  3: {
    emoji: "🥉",
    bg: "bg-gradient-to-br from-amber-600/25 via-amber-700/30 to-orange-800/20",
    glow: "shadow-[0_0_12px_rgba(180,83,9,0.4)]",
  },
}

const rowStyles: Record<number, string> = {
  1: "bg-gradient-to-r from-yellow-500/15 via-yellow-400/8 to-transparent border-l-4 border-l-yellow-500",
  2: "bg-gradient-to-r from-gray-400/15 via-gray-300/8 to-transparent border-l-4 border-l-gray-400",
  3: "bg-gradient-to-r from-amber-700/15 via-amber-600/8 to-transparent border-l-4 border-l-amber-700",
}

export function LeaderboardTV({
  initialData,
  initialWods,
  division,
  eventName,
}: LeaderboardTVProps) {
  const [data, setData] = useState<LeaderboardEntry[]>(initialData)
  const [wods, setWods] = useState<WodHeader[]>(initialWods)
  const hasConfettied = useRef(false)

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

  useEffect(() => {
    if (hasConfettied.current || initialData.length === 0) return
    hasConfettied.current = true

    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { x: 0.5, y: 0.25 },
        colors: ["#FF6600", "#FFB800", "#FFFFFF", "#FF3D00"],
        gravity: 1,
        ticks: 200,
      })
    }, 800)

    return () => clearTimeout(timer)
  }, [initialData.length])

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
            {data.map((entry, index) => {
              const rank = Number(entry.overall_rank)
              const medal = medalConfig[rank]
              const rowBg = rowStyles[rank] || ""
              const borderClass = rank === 4 ? "border-b-2 border-b-gray-700" : "border-b border-gray-900"

              return (
                <tr
                  key={entry.id}
                  className={`animate-fade-up ${borderClass} ${rowBg}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="py-5 text-center">
                    {medal ? (
                      <span className={`inline-flex h-14 w-14 items-center justify-center rounded-full text-3xl ${medal.bg} ${medal.glow}`}>
                        {medal.emoji}
                      </span>
                    ) : (
                      <span className="text-2xl font-black text-gray-500">{rank}</span>
                    )}
                  </td>
                  <td className="py-5">
                    {rank === 1 ? (
                      <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-primary bg-clip-text text-3xl font-black text-transparent">
                        {entry.full_name}
                      </span>
                    ) : (
                      <span className="text-2xl font-bold">{entry.full_name}</span>
                    )}
                  </td>
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

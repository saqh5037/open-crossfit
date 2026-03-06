"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import confetti from "canvas-confetti"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy } from "lucide-react"
import type { LeaderboardEntry } from "@/types"

interface WodHeader {
  id: string
  name: string
  score_type: string
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  wods: WodHeader[]
}

const medalConfig: Record<number, { emoji: string; bg: string; glow: string }> = {
  1: {
    emoji: "🥇",
    bg: "bg-gradient-to-br from-yellow-400/20 via-yellow-500/30 to-amber-600/20",
    glow: "shadow-[0_0_12px_rgba(234,179,8,0.4)]",
  },
  2: {
    emoji: "🥈",
    bg: "bg-gradient-to-br from-gray-300/20 via-gray-400/25 to-gray-500/15",
    glow: "shadow-[0_0_10px_rgba(156,163,175,0.3)]",
  },
  3: {
    emoji: "🥉",
    bg: "bg-gradient-to-br from-amber-600/20 via-amber-700/25 to-orange-800/15",
    glow: "shadow-[0_0_10px_rgba(180,83,9,0.3)]",
  },
}

function MedalBadge({ rank }: { rank: number }) {
  const config = medalConfig[rank]
  if (config) {
    return (
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-lg ${config.bg} ${config.glow}`}>
        {config.emoji}
      </span>
    )
  }
  return <span className="font-mono text-gray-500">{rank}</span>
}

function AnimatedPoints({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!value) return
    const duration = 1200
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return <>{display || "—"}</>
}

const rowStyles: Record<number, string> = {
  1: "bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-transparent border-l-2 border-l-yellow-500",
  2: "bg-gradient-to-r from-gray-400/10 via-gray-300/5 to-transparent border-l-2 border-l-gray-400",
  3: "bg-gradient-to-r from-amber-700/10 via-amber-600/5 to-transparent border-l-2 border-l-amber-700",
}

const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462 * 10) / 10

function formatScore(displayScore: string, scoreType: string) {
  if (scoreType === "weight") {
    const lbs = parseFloat(displayScore)
    if (!isNaN(lbs)) {
      return (
        <>
          <span className="text-xs font-semibold text-gray-300">{displayScore}</span>
          <br />
          <span className="text-[10px] text-gray-500">{lbsToKg(lbs)} kg</span>
        </>
      )
    }
  }
  return <span className="text-xs text-gray-400">{displayScore}</span>
}

export function LeaderboardTable({ entries, wods }: LeaderboardTableProps) {
  const hasConfettied = useRef(false)

  useEffect(() => {
    if (hasConfettied.current || entries.length === 0) return
    hasConfettied.current = true

    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: 0.5, y: 0.3 },
        colors: ["#FF6600", "#FFB800", "#FFFFFF", "#FF3D00"],
        gravity: 1.2,
        ticks: 150,
      })
    }, 600)

    return () => clearTimeout(timer)
  }, [entries.length])

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-gray-400">
        <Trophy className="h-12 w-12 text-gray-600" />
        <p className="text-lg font-medium">Sin resultados aún</p>
        <p className="text-sm">Los scores aparecerán aquí cuando se capturen.</p>
      </div>
    )
  }

  const stripOpen = (name: string) => name.replace(/^Open\s+/i, "")

  // Sticky column widths for mobile: #=36px, Atleta=110px, Pts=52px
  const COL_RANK = 36
  const COL_NAME = 110
  const COL_PTS = 52

  return (
    <div className="leaderboard-sticky-shadow -mx-4 overflow-x-auto sm:mx-0 sm:rounded-lg sm:border sm:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 bg-gray-900 hover:bg-gray-900">
            <TableHead
              className="sticky left-0 z-20 bg-gray-900 text-center text-gray-300 sm:static sm:w-16"
              style={{ width: COL_RANK, minWidth: COL_RANK }}
            >#</TableHead>
            <TableHead
              className="sticky z-20 bg-gray-900 text-gray-300 sm:static"
              style={{ left: COL_RANK, width: COL_NAME, minWidth: COL_NAME }}
            >Atleta</TableHead>
            <TableHead
              className="sticky z-20 bg-gray-900 text-center font-bold text-gray-300 sm:static"
              style={{ left: COL_RANK + COL_NAME, width: COL_PTS, minWidth: COL_PTS }}
            >
              <span className="sm:hidden">Pts</span>
              <span className="hidden sm:inline">Puntos</span>
            </TableHead>
            {wods.map((wod) => (
              <TableHead key={wod.id} className="text-center text-gray-300 whitespace-nowrap">
                <span className="sm:hidden">{stripOpen(wod.name)}</span>
                <span className="hidden sm:inline">{wod.name}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const rank = Number(entry.overall_rank)
            const isTop3 = rank <= 3
            const rowBg = rowStyles[rank] || "hover:bg-gray-900/50"
            const borderClass = rank === 4 ? "border-t-2 border-t-gray-700" : "border-gray-800"

            return (
              <TableRow
                key={entry.id}
                className={`animate-fade-up ${borderClass} ${rowBg} ${isTop3 ? "transition-transform duration-200 hover:scale-[1.01]" : ""}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <TableCell
                  className="sticky left-0 z-10 bg-gray-950 text-center sm:static sm:bg-transparent"
                  style={{ width: COL_RANK, minWidth: COL_RANK }}
                >
                  <MedalBadge rank={rank} />
                </TableCell>
                <TableCell
                  className="sticky z-10 bg-gray-950 font-medium sm:static sm:bg-transparent"
                  style={{ left: COL_RANK, width: COL_NAME, minWidth: COL_NAME, maxWidth: COL_NAME }}
                >
                  <Link
                    href={`/atleta/${entry.id}`}
                    className="block truncate transition-colors hover:text-primary hover:underline"
                  >
                    {rank === 1 ? (
                      <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-primary bg-clip-text font-bold text-transparent">
                        {entry.full_name}
                      </span>
                    ) : (
                      <span className="text-white">{entry.full_name}</span>
                    )}
                  </Link>
                </TableCell>
                <TableCell
                  className="sticky z-10 bg-gray-950 text-center sm:static sm:bg-transparent"
                  style={{ left: COL_RANK + COL_NAME, width: COL_PTS, minWidth: COL_PTS }}
                >
                  {rank === 1 ? (
                    <span className="text-xl font-black text-primary animate-count-up inline-block sm:text-2xl" style={{ animationDelay: "800ms" }}>
                      <AnimatedPoints value={Number(entry.total_points)} />
                    </span>
                  ) : (
                    <span className="text-base font-black text-primary sm:text-lg">
                      {Number(entry.total_points) || "—"}
                    </span>
                  )}
                </TableCell>
                {wods.map((wod) => {
                  const result = entry.wod_results?.find(
                    (r) => r.wod_id === wod.id
                  )
                  return (
                    <TableCell key={wod.id} className="text-center">
                      {result ? (
                        <div>
                          {formatScore(result.display_score ?? "", wod.score_type)}
                          <br />
                          <span className="text-sm font-bold text-primary">{result.points ?? 0}</span>
                          <span className="ml-1 text-[10px] text-gray-600">({result.placement}°)</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

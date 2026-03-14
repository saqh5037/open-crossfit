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
  coachAthleteIds?: string[]
  isStaffDivision?: boolean
}

function CoachBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
      COACH
    </span>
  )
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

function StaffBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 ring-1 ring-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
      🐻 STAFF
    </span>
  )
}

export function LeaderboardTable({ entries, wods, coachAthleteIds = [], isStaffDivision = false }: LeaderboardTableProps) {
  const hasConfettied = useRef(false)

  useEffect(() => {
    if (hasConfettied.current || entries.length === 0) return
    hasConfettied.current = true

    const timer = setTimeout(() => {
      const colors = isStaffDivision
        ? ["#FFD700", "#FFA500", "#DAA520", "#F5DEB3"]
        : ["#FF6600", "#FFB800", "#FFFFFF", "#FF3D00"]
      const end = Date.now() + 1500
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }, 600)

    return () => clearTimeout(timer)
  }, [entries.length, isStaffDivision])

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

  // Mobile: card layout with full name visible. Desktop: full table.
  return (
    <>
      {/* Mobile layout: cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {entries.map((entry, index) => {
          const rank = Number(entry.overall_rank)
          const rowBg = isStaffDivision
            ? "bg-gradient-to-r from-emerald-900/30 via-yellow-900/20 to-amber-900/30 border-amber-500/40"
            : (rowStyles[rank] || "")

          return (
            <div
              key={entry.id}
              className={`animate-fade-up rounded-lg border p-3 ${isStaffDivision ? `${rowBg} shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse-subtle` : `border-gray-800 ${rowBg || "bg-gray-950"}`}`}
              style={{ animationDelay: `${index * (isStaffDivision ? 150 : 60)}ms` }}
            >
              {/* Top row: rank + name + points */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {isStaffDivision ? (
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg bg-gradient-to-br from-yellow-400/30 via-yellow-500/40 to-amber-600/30 shadow-[0_0_16px_rgba(234,179,8,0.5)]">
                      🥇
                    </span>
                  ) : (
                    <MedalBadge rank={rank} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/atleta/${entry.id}`}
                    className="transition-colors hover:text-primary"
                  >
                    {isStaffDivision || rank === 1 ? (
                      <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-primary bg-clip-text text-sm font-bold text-transparent">
                        {entry.full_name}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-white">{entry.full_name}</span>
                    )}
                  </Link>
                  {isStaffDivision ? <StaffBadge /> : coachAthleteIds.includes(entry.id) && <CoachBadge />}
                </div>
                {!isStaffDivision && (
                  <div className="flex-shrink-0 text-right">
                    {rank === 1 ? (
                      <span className="text-xl font-black text-primary animate-count-up inline-block" style={{ animationDelay: "800ms" }}>
                        <AnimatedPoints value={Number(entry.total_points)} />
                      </span>
                    ) : (
                      <span className="text-lg font-black text-primary">
                        {Number(entry.total_points) || "—"}
                      </span>
                    )}
                    <span className="ml-1 text-[10px] text-gray-500">pts</span>
                  </div>
                )}
              </div>
              {/* WOD scores row */}
              {wods.length > 0 && (
                <div className="mt-2 flex gap-3 overflow-x-auto border-t border-gray-800/50 pt-2">
                  {wods.map((wod) => {
                    const result = entry.wod_results?.find((r) => r.wod_id === wod.id)
                    return (
                      <div key={wod.id} className="flex-shrink-0 text-center">
                        <p className="text-[10px] text-gray-500">{stripOpen(wod.name)}</p>
                        {result ? (
                          <>
                            <span className="text-xs text-gray-400">{result.display_score}</span>
                            {!isStaffDivision && (
                              <>
                                <br />
                                <span className="text-xs font-bold text-primary">{result.points ?? 0}</span>
                                <span className="ml-0.5 text-[9px] text-gray-600">({result.placement}°)</span>
                              </>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-700">—</span>
                        )}
                      </div>
                    )
                  })}
                  {/* Recap button */}
                  {!isStaffDivision && entry.wod_results && entry.wod_results.length > 0 && (
                    <Link
                      href={`/atleta/${entry.id}/recap`}
                      className="flex-shrink-0 self-center ml-auto animate-pulse"
                    >
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-[0_0_12px_rgba(234,88,12,0.4)] hover:shadow-[0_0_20px_rgba(234,88,12,0.6)] transition-shadow">
                        🔥 RECAP
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop layout: table */}
      <div className="hidden sm:block sm:rounded-lg sm:border sm:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 bg-gray-900 hover:bg-gray-900">
              {!isStaffDivision && <TableHead className="w-16 text-center text-gray-300">#</TableHead>}
              {isStaffDivision && <TableHead className="w-16 text-center text-gray-300">🥇</TableHead>}
              <TableHead className="text-gray-300">Atleta</TableHead>
              {!isStaffDivision && <TableHead className="text-center font-bold text-gray-300">Puntos</TableHead>}
              {wods.map((wod) => (
                <TableHead key={wod.id} className="text-center text-gray-300 whitespace-nowrap">
                  {wod.name}
                </TableHead>
              ))}
              {!isStaffDivision && <TableHead className="text-center text-gray-300 w-20">🔥</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => {
              const rank = Number(entry.overall_rank)
              const isTop3 = rank <= 3

              const rowBg = isStaffDivision
                ? "bg-gradient-to-r from-emerald-900/20 via-yellow-900/15 to-amber-900/20 border-l-2 border-l-amber-500 shadow-[0_0_12px_rgba(234,179,8,0.12)]"
                : (rowStyles[rank] || "hover:bg-gray-900/50")
              const borderClass = !isStaffDivision && rank === 4 ? "border-t-2 border-t-gray-700" : "border-gray-800"

              return (
                <TableRow
                  key={entry.id}
                  className={`animate-fade-up ${borderClass} ${rowBg} ${isStaffDivision ? "transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]" : isTop3 ? "transition-transform duration-200 hover:scale-[1.01]" : ""}`}
                  style={{ animationDelay: `${index * (isStaffDivision ? 200 : 60)}ms` }}
                >
                  <TableCell className="text-center">
                    {isStaffDivision ? (
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg bg-gradient-to-br from-yellow-400/30 via-yellow-500/40 to-amber-600/30 shadow-[0_0_16px_rgba(234,179,8,0.5)]">
                        🥇
                      </span>
                    ) : (
                      <MedalBadge rank={rank} />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/atleta/${entry.id}`}
                      className="transition-colors hover:text-primary hover:underline"
                    >
                      {isStaffDivision || rank === 1 ? (
                        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-primary bg-clip-text font-bold text-transparent">
                          {entry.full_name}
                        </span>
                      ) : (
                        <span className="text-white">{entry.full_name}</span>
                      )}
                    </Link>
                    {isStaffDivision ? <StaffBadge /> : coachAthleteIds.includes(entry.id) && <CoachBadge />}
                  </TableCell>
                  {!isStaffDivision && (
                    <TableCell className="text-center">
                      {rank === 1 ? (
                        <span className="text-2xl font-black text-primary animate-count-up inline-block" style={{ animationDelay: "800ms" }}>
                          <AnimatedPoints value={Number(entry.total_points)} />
                        </span>
                      ) : (
                        <span className="text-lg font-black text-primary">
                          {Number(entry.total_points) || "—"}
                        </span>
                      )}
                    </TableCell>
                  )}
                  {wods.map((wod) => {
                    const result = entry.wod_results?.find(
                      (r) => r.wod_id === wod.id
                    )
                    return (
                      <TableCell key={wod.id} className="text-center">
                        {result ? (
                          <div>
                            {formatScore(result.display_score ?? "", wod.score_type)}
                            {!isStaffDivision && (
                              <>
                                <br />
                                <span className="text-sm font-bold text-primary">{result.points ?? 0}</span>
                                <span className="ml-1 text-[10px] text-gray-600">({result.placement}°)</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                    )
                  })}
                  {!isStaffDivision && (
                    <TableCell className="text-center">
                      {entry.wod_results && entry.wod_results.length > 0 ? (
                        <Link
                          href={`/atleta/${entry.id}/recap`}
                          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-[0_0_10px_rgba(234,88,12,0.3)] hover:shadow-[0_0_18px_rgba(234,88,12,0.5)] transition-all hover:scale-105"
                        >
                          🔥 RECAP
                        </Link>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

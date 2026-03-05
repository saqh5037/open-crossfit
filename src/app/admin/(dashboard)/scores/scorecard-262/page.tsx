"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer } from "lucide-react"

const WOD_MOVEMENTS = [
  // Round 1
  { exercise: "80-FT DB OH WALKING LUNGE", reps: "80 ft", cumulative: "—" },
  { exercise: "ALT. DB SNATCHES", reps: 20, cumulative: 20 },
  { exercise: "PULL-UPS", reps: 20, cumulative: 40 },
  // Round 2
  { exercise: "80-FT DB OH WALKING LUNGE", reps: "80 ft", cumulative: "—" },
  { exercise: "ALT. DB SNATCHES", reps: 20, cumulative: 60 },
  { exercise: "CHEST-TO-BAR PULL-UPS", reps: 20, cumulative: 80 },
  // Round 3
  { exercise: "80-FT DB OH WALKING LUNGE", reps: "80 ft", cumulative: "—" },
  { exercise: "ALT. DB SNATCHES", reps: 20, cumulative: 100 },
  { exercise: "MUSCLE-UPS", reps: 20, cumulative: 120 },
]

// Tiebreak at end of each round (after pull-up variations)
const TIEBREAK_ROWS = [2, 5, 8]

// Round separators (first movement of each round)
const ROUND_STARTS = [0, 3, 6]

export default function Scorecard262Page() {
  const [copies, setCopies] = useState(1)

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 print:hidden">
        <h1 className="text-2xl font-bold">Scorecard — 26.2</h1>
        <p className="text-sm text-gray-400">
          Scorecard estilo oficial. Selecciona cuántas copias imprimir.
        </p>
        <div className="flex items-end gap-4">
          <div className="w-32">
            <Label>Copias</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Scorecards */}
      {Array.from({ length: copies }).map((_, idx) => (
        <div
          key={idx}
          className={`mb-6 print:mb-0 ${idx < copies - 1 ? "break-after-page" : ""}`}
        >
          <div className="bg-white text-black print:p-0" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "11px" }}>
            <div className="border border-gray-400 p-4 print:p-3">

              {/* ═══ HEADER ═══ */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src="/logo-80.png" alt="GRIZZLYS" width={48} height={48} className="rounded" />
                  <div>
                    <p className="text-xl font-black tracking-widest" style={{ fontFamily: "Arial Black, sans-serif" }}>GRIZZLYS CROSSFIT</p>
                    <p className="text-[10px] tracking-wide text-gray-500">OPEN 2026 — WEEK 2</p>
                  </div>
                </div>
              </div>

              {/* ═══ BODY: 2 columns ═══ */}
              <div className="flex gap-4">

                {/* LEFT — WOD Description */}
                <div className="w-[45%] shrink-0">
                  <div className="rounded border border-gray-400 p-2.5">
                    <p className="text-base font-black">26.2:</p>
                    <p className="mt-1 text-[11px] leading-snug">
                      For time:<br />
                      <br />
                      80-foot dumbbell overhead walking lunge<br />
                      20 alternating dumbbell snatches<br />
                      20 pull-ups<br />
                      <br />
                      80-foot dumbbell overhead walking lunge<br />
                      20 alternating dumbbell snatches<br />
                      20 chest-to-bar pull-ups<br />
                      <br />
                      80-foot dumbbell overhead walking lunge<br />
                      20 alternating dumbbell snatches<br />
                      20 muscle-ups
                    </p>
                    <p className="mt-2 text-[11px] font-bold">Time cap: 15 minutes</p>
                    <div className="mt-2 text-[10px] leading-snug text-gray-600">
                      <p>♀ 35-lb (15-kg) dumbbell</p>
                      <p>♂ 50-lb (22.5-kg) dumbbell</p>
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="mt-2">
                    <p className="text-xs font-black uppercase">Categorías</p>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] leading-tight">
                      <div>
                        <p className="font-bold">RX:</p>
                        <p>♀ 35-lb (15-kg) dumbbell</p>
                        <p>♂ 50-lb (22.5-kg) dumbbell</p>
                      </div>
                      <div>
                        <p className="font-bold">Principiante:</p>
                        <p>♀ 20-lb (9-kg) dumbbell</p>
                        <p>♂ 35-lb (15-kg) dumbbell</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Score Table */}
                <div className="flex-1">
                  <table className="w-full border-collapse text-[11px]">
                    <tbody>
                      {WOD_MOVEMENTS.map((mov, i) => (
                        <tr key={i} className={`border border-gray-400 ${ROUND_STARTS.includes(i) && i > 0 ? "border-t-2 border-t-gray-600" : ""}`}>
                          <td className="border-r border-gray-400 px-2 py-[5px] font-bold leading-tight" style={{ width: "55%" }}>
                            <span className="text-[12px] font-black">{mov.reps}</span>{" "}
                            <span className="text-[11px] font-bold tracking-wide">{mov.exercise}</span>
                          </td>
                          <td className="border-r border-gray-400 px-2 py-[5px] text-right text-[11px] text-gray-500" style={{ width: "15%" }}>
                            {mov.cumulative}
                          </td>
                          {TIEBREAK_ROWS.includes(i) ? (
                            <td className="px-1 py-[5px] text-right text-[9px] font-bold uppercase text-gray-400" style={{ width: "30%" }}>
                              TIME
                            </td>
                          ) : (
                            <td style={{ width: "30%" }}>&nbsp;</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ═══ SIGNATURES — Judge copy ═══ */}
              <div className="mt-3 border-t border-gray-300 pt-3">
                <div className="flex gap-6">
                  {/* Left: Athlete + Judge */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-end gap-2">
                      <span className="text-xs font-bold">Athlete</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                    </div>
                    <div className="flex gap-16 text-[9px] text-gray-400">
                      <span className="ml-14">Athlete Name</span>
                      <span>Athlete Signature</span>
                    </div>
                    <div className="mb-2 mt-2 flex items-end gap-2">
                      <span className="text-xs font-bold">Judge</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                    </div>
                    <div className="flex gap-16 text-[9px] text-gray-400">
                      <span className="ml-14">Judge Name</span>
                      <span>Judge Signature</span>
                    </div>
                  </div>

                  {/* Right: Score box */}
                  <div className="w-56 shrink-0">
                    <div className="mb-1.5 flex items-end justify-end gap-1">
                      <span className="text-[10px] font-bold whitespace-nowrap">Tiebreak Time</span>
                      <span className="inline-block w-28 border-b border-black">&nbsp;</span>
                    </div>
                    <div className="mb-1.5 flex items-end justify-end gap-1">
                      <span className="text-[10px] font-bold whitespace-nowrap">Time or Reps at 15 Min.</span>
                      <span className="inline-block w-28 border-b border-black">&nbsp;</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-3.5 w-3.5 border border-black">&nbsp;</span>
                        RX
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-3.5 w-3.5 border border-black">&nbsp;</span>
                        Principiante
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ ATHLETE COPY (tear-off) ═══ */}
              <div className="mt-3 border-t-2 border-dashed border-gray-400 pt-2">
                <p className="text-[9px] italic text-gray-400">Athlete Copy</p>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src="/logo-80.png" alt="GRIZZLYS" width={28} height={28} className="rounded" />
                    <p className="text-sm font-black tracking-wider">WORKOUT 26.2</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-bold">Time or Reps at 15 Min.</span>
                    <span className="inline-block w-24 border-b border-black">&nbsp;</span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3 w-3 border border-black">&nbsp;</span>
                      RX
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-3 w-3 border border-black">&nbsp;</span>
                      Principiante
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 flex gap-6 text-[11px]">
                  <div className="flex-1">
                    <div className="flex items-end gap-1">
                      <span className="font-bold">Athlete</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                    </div>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="font-bold">Judge</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                      <span className="flex-1 border-b border-black">&nbsp;</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold">Tiebreak Time</span>
                    <span className="ml-1 inline-block w-24 border-b border-black">&nbsp;</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

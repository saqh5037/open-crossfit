"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer } from "lucide-react"

const WOD_MOVEMENTS = [
  { exercise: "WALL-BALL SHOTS", reps: 20, cumulative: 20 },
  { exercise: "BOX JUMP-OVERS", reps: 18, cumulative: 38 },
  { exercise: "WALL-BALL SHOTS", reps: 30, cumulative: 68 },
  { exercise: "BOX JUMP-OVERS", reps: 18, cumulative: 86 },
  { exercise: "WALL-BALL SHOTS", reps: 40, cumulative: 126 },
  { exercise: "MEDICINE-BALL BOX\nSTEP-OVERS", reps: 18, cumulative: 144 },
  { exercise: "WALL-BALL SHOTS", reps: 66, cumulative: 210 },
  { exercise: "MEDICINE BALL BOX\nSTEP-OVERS", reps: 18, cumulative: 228 },
  { exercise: "WALL-BALL SHOTS", reps: 40, cumulative: 268 },
  { exercise: "BOX JUMP-OVERS", reps: 18, cumulative: 286 },
  { exercise: "WALL-BALL SHOTS", reps: 30, cumulative: 316 },
  { exercise: "BOX JUMP-OVERS", reps: 18, cumulative: 334 },
  { exercise: "WALL-BALL SHOTS", reps: 20, cumulative: 354 },
]

// Tiebreak positions (after each wall-ball set)
const TIEBREAK_ROWS = [4, 6, 8, 10, 12]

export default function ScorecardPage() {
  const [copies, setCopies] = useState(1)

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 print:hidden">
        <h1 className="text-2xl font-bold">Scorecard — 26.1</h1>
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
                    <p className="text-[10px] tracking-wide text-gray-500">OPEN 2026 — WEEK 1</p>
                  </div>
                </div>
              </div>

              {/* ═══ BODY: 2 columns ═══ */}
              <div className="flex gap-4">

                {/* LEFT — WOD Description */}
                <div className="w-[45%] shrink-0">
                  <div className="rounded border border-gray-400 p-2.5">
                    <p className="text-base font-black">26.1:</p>
                    <p className="mt-1 text-[11px] leading-snug">
                      For time:<br />
                      20 wall-ball shots<br />
                      18 box jump-overs<br />
                      30 wall-ball shots<br />
                      18 box jump-overs<br />
                      40 wall-ball shots<br />
                      18 medicine-ball box step-overs<br />
                      66 wall-ball shots<br />
                      18 medicine-ball box step-overs<br />
                      40 wall-ball shots<br />
                      18 box jump-overs<br />
                      30 wall-ball shots<br />
                      18 box jump-overs<br />
                      20 wall-ball shots
                    </p>
                    <p className="mt-2 text-[11px] font-bold">Time cap: 12 minutes</p>
                    <div className="mt-2 text-[10px] leading-snug text-gray-600">
                      <p>♀ 14-lb (6-kg) medicine-ball, 9-foot target,<br />&nbsp;&nbsp;&nbsp;20-inch box</p>
                      <p>♂ 20-lb (9-kg) medicine-ball, 10-ft target,<br />&nbsp;&nbsp;&nbsp;24-inch box</p>
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="mt-2">
                    <p className="text-xs font-black uppercase">Categorías</p>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] leading-tight">
                      <div>
                        <p className="font-bold">RX:</p>
                        <p>♀ 14-lb medicine ball, 9-ft, 20&quot; box</p>
                        <p>♂ 20-lb medicine ball, 10-ft, 24&quot; box</p>
                      </div>
                      <div>
                        <p className="font-bold">Principiante:</p>
                        <p>♀ 10-lb medicine ball, 9-ft, 20&quot; box (may step up)</p>
                        <p>♂ 14-lb medicine ball, 10-ft, 24&quot; box (may step up)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Score Table */}
                <div className="flex-1">
                  <table className="w-full border-collapse text-[11px]">
                    <tbody>
                      {WOD_MOVEMENTS.map((mov, i) => (
                        <tr key={i} className="border border-gray-400">
                          <td className="border-r border-gray-400 px-2 py-[5px] font-bold leading-tight whitespace-pre-line" style={{ width: "55%" }}>
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
                      <span className="text-[10px] font-bold whitespace-nowrap">Time or Reps at 12 Min.</span>
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
                    <p className="text-sm font-black tracking-wider">WORKOUT 26.1</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-bold">Time or Reps at 12 Min.</span>
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer } from "lucide-react"

// WOD 26.1 — FOR TIME · 12 MIN CAP
const WOD_MOVEMENTS = [
  { exercise: "Wall-Ball Shots", reps: 20, cumulative: 20 },
  { exercise: "Box Jump-Overs", reps: 18, cumulative: 38 },
  { exercise: "Wall-Ball Shots", reps: 30, cumulative: 68 },
  { exercise: "Box Jump-Overs", reps: 18, cumulative: 86 },
  { exercise: "Wall-Ball Shots", reps: 40, cumulative: 126 },
  { exercise: "Med-Ball Box Step-Overs", reps: 18, cumulative: 144 },
  { exercise: "Wall-Ball Shots", reps: 66, cumulative: 210 },
  { exercise: "Med-Ball Box Step-Overs", reps: 18, cumulative: 228 },
  { exercise: "Wall-Ball Shots", reps: 40, cumulative: 268 },
  { exercise: "Box Jump-Overs", reps: 18, cumulative: 286 },
  { exercise: "Wall-Ball Shots", reps: 30, cumulative: 316 },
  { exercise: "Box Jump-Overs", reps: 18, cumulative: 334 },
  { exercise: "Wall-Ball Shots", reps: 20, cumulative: 354 },
]

export default function ScorecardPage() {
  const [copies, setCopies] = useState(1)

  return (
    <div>
      {/* Controls (hidden when printing) */}
      <div className="mb-8 flex flex-col gap-4 print:hidden">
        <h1 className="text-2xl font-bold">Scorecard — 26.1</h1>
        <p className="text-sm text-gray-400">
          Scorecard genérica para llenar a mano. Selecciona cuántas copias imprimir.
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

      {/* Printable Scorecards */}
      {Array.from({ length: copies }).map((_, idx) => (
        <div
          key={idx}
          className={`mb-6 print:mb-0 ${idx < copies - 1 ? "break-after-page" : ""}`}
        >
          <div className="rounded-lg border border-gray-700 bg-white p-4 text-black print:rounded-none print:border print:border-black print:p-3">
            {/* Header + Athlete fields */}
            <div className="mb-2 flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-black leading-tight tracking-tight">GRIZZLYS</h2>
                  <p className="text-[10px] text-gray-500">CrossFit Open 2026</p>
                </div>
                <div className="h-8 w-px bg-gray-300" />
                <div>
                  <p className="text-sm font-bold">WOD 26.1</p>
                  <p className="text-[10px] text-gray-500">FOR TIME · Time Cap: 12 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500"># Atleta</span>
                  <div className="mt-0.5 h-6 w-12 border-b-2 border-black">&nbsp;</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500">Nombre y Apellido</span>
                  <div className="mt-0.5 h-6 w-48 border-b-2 border-black">&nbsp;</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500">Categoría</span>
                  <div className="mt-0.5 flex h-6 items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <span className="inline-block h-3.5 w-3.5 rounded border-2 border-gray-400">&nbsp;</span>
                      RX
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span className="inline-block h-3.5 w-3.5 rounded border-2 border-gray-400">&nbsp;</span>
                      Principiante
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Movement Breakdown Table */}
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-1 text-left text-xs">Ejercicio</th>
                  <th className="border border-gray-400 px-2 py-1 text-center w-14 text-xs">Reps</th>
                  <th className="border border-gray-400 px-2 py-1 text-center w-20 text-xs">Acumulado</th>
                  <th className="border border-gray-400 px-2 py-1 text-center w-16 text-xs">✓</th>
                </tr>
              </thead>
              <tbody>
                {WOD_MOVEMENTS.map((mov, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-400 px-2 py-1 font-medium">
                      {mov.exercise}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center font-semibold">
                      {mov.reps}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                      {mov.cumulative}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      <span className="inline-block h-4 w-4 rounded border-2 border-gray-400">&nbsp;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Score + Signatures — compact row */}
            <div className="mt-2 flex items-end gap-3 border-t border-gray-300 pt-2 text-xs">
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase text-gray-500">Score (Reps)</p>
                <div className="mt-1 h-7 border-b-2 border-black">&nbsp;</div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase text-gray-500">Tiempo (si completó)</p>
                <div className="mt-1 h-7 border-b-2 border-black">&nbsp;</div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase text-gray-500">Firma Atleta</p>
                <div className="mt-1 h-7 border-b border-gray-400">&nbsp;</div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase text-gray-500">Firma Juez</p>
                <div className="mt-1 h-7 border-b border-gray-400">&nbsp;</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

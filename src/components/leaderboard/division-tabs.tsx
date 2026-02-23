"use client"

import { getDivisionLabel } from "@/lib/divisions"

interface DivisionTabsProps {
  divisions: string[]
  selected: string
  onChange: (division: string) => void
}

export function DivisionTabs({ divisions, selected, onChange }: DivisionTabsProps) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
      {divisions.map((div) => (
        <button
          key={div}
          onClick={() => onChange(div)}
          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
            selected === div
              ? "bg-primary text-black font-bold"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {getDivisionLabel(div)}
        </button>
      ))}
    </div>
  )
}

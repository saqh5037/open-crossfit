"use client"

import { useState, useRef } from "react"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  const secRef = useRef<HTMLInputElement>(null)

  // Initialize from value prop
  const initialParts = value.split(":")
  const [mins, setMins] = useState(initialParts[0] || "")
  const [secs, setSecs] = useState(initialParts[1] || "")

  const emit = (m: string, s: string) => {
    if (!m && !s) {
      onChange("")
      return
    }
    const mm = m || "0"
    const ss = s ? s.padStart(2, "0") : "00"
    onChange(`${mm}:${ss}`)
  }

  const handleMinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2)
    setMins(val)
    emit(val, secs)
    if (val.length >= 2) {
      secRef.current?.focus()
      secRef.current?.select()
    }
  }

  const handleSecsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2)
    if (Number(val) > 59) val = "59"
    setSecs(val)
    emit(mins, val)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">Min</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="00"
          value={mins}
          onChange={handleMinsChange}
          className="w-16 rounded-md border border-gray-700 bg-black px-2 py-2.5 text-center text-xl font-mono text-white focus:border-primary focus:outline-none"
          maxLength={2}
        />
      </div>
      <span className="mt-4 text-2xl font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">Seg</span>
        <input
          ref={secRef}
          type="text"
          inputMode="numeric"
          placeholder="00"
          value={secs}
          onChange={handleSecsChange}
          className="w-16 rounded-md border border-gray-700 bg-black px-2 py-2.5 text-center text-xl font-mono text-white focus:border-primary focus:outline-none"
          maxLength={2}
        />
      </div>
    </div>
  )
}

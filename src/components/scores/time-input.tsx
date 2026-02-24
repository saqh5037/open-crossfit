"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TimeInput({ value, onChange, placeholder = "0:00" }: TimeInputProps) {
  const [rawValue, setRawValue] = useState(value.replace(":", ""))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
    setRawValue(digits)

    // Always format as mm:ss
    if (digits.length === 0) {
      onChange("")
    } else if (digits.length === 1) {
      onChange(`0:0${digits}`)
    } else if (digits.length === 2) {
      onChange(`0:${digits}`)
    } else {
      const formatted = `${digits.slice(0, -2)}:${digits.slice(-2)}`
      onChange(formatted)
    }
  }

  // Always show formatted display
  let displayValue = ""
  if (rawValue.length === 0) {
    displayValue = ""
  } else if (rawValue.length === 1) {
    displayValue = `0:0${rawValue}`
  } else if (rawValue.length === 2) {
    displayValue = `0:${rawValue}`
  } else {
    displayValue = `${rawValue.slice(0, -2)}:${rawValue.slice(-2)}`
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      className="text-center text-lg font-mono"
    />
  )
}

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TimeInput({ value, onChange, placeholder = "mm:ss" }: TimeInputProps) {
  const [rawValue, setRawValue] = useState(value.replace(":", ""))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
    setRawValue(digits)

    if (digits.length >= 3) {
      const formatted = `${digits.slice(0, -2)}:${digits.slice(-2)}`
      onChange(formatted)
    } else {
      onChange(digits)
    }
  }

  const displayValue =
    rawValue.length >= 3
      ? `${rawValue.slice(0, -2)}:${rawValue.slice(-2)}`
      : rawValue

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

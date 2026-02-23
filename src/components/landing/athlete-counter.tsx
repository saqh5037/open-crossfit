"use client"

import { useEffect, useState } from "react"

interface AthleteCounterProps {
  targetCount: number
}

export function AthleteCounter({ targetCount }: AthleteCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (targetCount === 0) return

    const duration = 1500
    const steps = 30
    const increment = targetCount / steps
    const stepTime = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setCount(targetCount)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [targetCount])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-4xl tabular-nums text-primary sm:text-6xl md:text-7xl lg:text-8xl">
        {count}
      </span>
      <span className="font-display text-base tracking-[0.2em] text-gray-400">
        ATLETAS REGISTRADOS
      </span>
    </div>
  )
}

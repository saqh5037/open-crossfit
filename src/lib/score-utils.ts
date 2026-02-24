import type { ScoreType } from "@/types"

/**
 * Convert time string "mm:ss" to total seconds
 * "12:30" → 750
 */
export function timeToSeconds(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) throw new Error(`Formato de tiempo inválido: ${timeStr}`)

  const minutes = parseInt(match[1], 10)
  const seconds = parseInt(match[2], 10)

  if (seconds > 59) throw new Error("Los segundos deben ser 00-59")

  return minutes * 60 + seconds
}

/**
 * Convert total seconds to "mm:ss" format
 * 750 → "12:30"
 */
export function secondsToTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Parse user input based on score type and return raw + display values
 */
export function parseScore(
  input: string,
  scoreType: ScoreType
): { raw_score: number; display_score: string } {
  switch (scoreType) {
    case "time": {
      const raw_score = timeToSeconds(input)
      return { raw_score, display_score: input }
    }
    case "reps": {
      const reps = parseInt(input, 10)
      if (isNaN(reps) || reps < 0) throw new Error("Reps debe ser un número positivo")
      return { raw_score: reps, display_score: `${reps} reps` }
    }
    case "weight": {
      const lbs = parseFloat(input)
      if (isNaN(lbs) || lbs <= 0) throw new Error("Peso debe ser un número positivo")
      const kg = Math.round(lbs / 2.20462 * 10) / 10
      return { raw_score: kg, display_score: `${lbs} lbs` }
    }
  }
}

/**
 * Get sort direction for a score type
 * time → asc (less is better)
 * reps/weight → desc (more is better)
 */
export function getSortOrder(scoreType: ScoreType): "asc" | "desc" {
  return scoreType === "time" ? "asc" : "desc"
}

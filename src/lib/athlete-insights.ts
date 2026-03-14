// athlete-insights.ts — Logica de analisis para recap motivacional
// Genera insights personalizados por atleta basados en sus resultados del Open 2026

import { isDivisionRx } from "./divisions"

// ==================== TYPES ====================

export interface WodResult {
  wodName: string
  displayScore: string
  rawScore: number
  rank: number
  totalInDivision: number
  points: number
  isFinished: boolean
  displayOrder: number
}

export interface MovementBreakdown {
  wallBalls: number
  boxJumps: number
  stepOvers: number
  lunges: number
  snatches: number
  pullVariation1: number // bent-over rows (foundation) / pull-ups (rx)
  pullVariation2: number // ring rows (foundation) / C2B (rx)
  pullVariation3: number // jumping pull-ups (foundation) / ring MU (rx)
  burpees: number
  cleans: number
  thrusters: number
}

export type Pattern =
  | "top"
  | "improving"
  | "specialist"
  | "finisher"
  | "consistent"
  | "warrior"
  | "newcomer"

export interface AthleteInsight {
  pattern: Pattern
  greeting: string
  storyBullets: string[]
  globalFact: string
  movementsByWod: Record<string, MovementBreakdown>
  totalMovements: MovementBreakdown
  totalReps: number
  totalWeightKg: number
  totalLungeMeters: number
  bestWod: WodResult | null
  bestWodMessage: string
  closingMessage: string
  wodInsights: { wodName: string; phrase: string }[]
}

// ==================== CONSTANTS ====================

// 26.1 rep map (cumulative thresholds)
const WOD_261_MAP = [
  { start: 1, end: 20, movement: "wallBalls", count: 20 },
  { start: 21, end: 38, movement: "boxJumps", count: 18 },
  { start: 39, end: 68, movement: "wallBalls", count: 30 },
  { start: 69, end: 86, movement: "boxJumps", count: 18 },
  { start: 87, end: 126, movement: "wallBalls", count: 40 },
  { start: 127, end: 144, movement: "stepOvers", count: 18 },
  { start: 145, end: 210, movement: "wallBalls", count: 66 }, // THE WALL
  { start: 211, end: 228, movement: "stepOvers", count: 18 },
  { start: 229, end: 268, movement: "wallBalls", count: 40 },
  { start: 269, end: 286, movement: "boxJumps", count: 18 },
  { start: 287, end: 316, movement: "wallBalls", count: 30 },
  { start: 317, end: 334, movement: "boxJumps", count: 18 },
  { start: 335, end: 354, movement: "wallBalls", count: 20 },
] as const

// 26.2 rep map (Foundations: lunge/snatch/bent-over rows, ring rows, jumping pull-ups)
const WOD_262_FOUNDATION_MAP = [
  { start: 1, end: 16, movement: "lunges", count: 16 },
  { start: 17, end: 36, movement: "snatches", count: 20 },
  { start: 37, end: 56, movement: "pullVariation1", count: 20 }, // bent-over rows
  { start: 57, end: 72, movement: "lunges", count: 16 },
  { start: 73, end: 92, movement: "snatches", count: 20 },
  { start: 93, end: 112, movement: "pullVariation2", count: 20 }, // ring rows
  { start: 113, end: 128, movement: "lunges", count: 16 },
  { start: 129, end: 148, movement: "snatches", count: 20 },
  { start: 149, end: 168, movement: "pullVariation3", count: 20 }, // jumping pull-ups
] as const

// 26.2 rep map (RX: lunge/snatch/pull-ups, C2B, ring MU)
const WOD_262_RX_MAP = [
  { start: 1, end: 16, movement: "lunges", count: 16 },
  { start: 17, end: 36, movement: "snatches", count: 20 },
  { start: 37, end: 56, movement: "pullVariation1", count: 20 }, // pull-ups
  { start: 57, end: 72, movement: "lunges", count: 16 },
  { start: 73, end: 92, movement: "snatches", count: 20 },
  { start: 93, end: 112, movement: "pullVariation2", count: 20 }, // C2B
  { start: 113, end: 128, movement: "lunges", count: 16 },
  { start: 129, end: 148, movement: "snatches", count: 20 },
  { start: 149, end: 168, movement: "pullVariation3", count: 20 }, // ring MU
] as const

// 26.3 rep map (same for both, 48 per section × 6 sections)
const WOD_263_SECTION = [
  { offset: 0, movement: "burpees", count: 12 },
  { offset: 12, movement: "cleans", count: 12 },
  { offset: 24, movement: "burpees", count: 12 },
  { offset: 36, movement: "thrusters", count: 12 },
] as const

// Weights for 26.3
const WEIGHTS_263 = {
  foundation_female: [15, 15, 15], // 35lb single weight
  foundation_male: [20, 20, 20], // 45lb single weight
  rx_female: [29, 34, 38], // 65, 75, 85 lb
  rx_male: [43, 52, 61], // 95, 115, 135 lb
} as Record<string, number[]>

// ==================== MOVEMENT CALCULATIONS ====================

function emptyBreakdown(): MovementBreakdown {
  return {
    wallBalls: 0, boxJumps: 0, stepOvers: 0,
    lunges: 0, snatches: 0,
    pullVariation1: 0, pullVariation2: 0, pullVariation3: 0,
    burpees: 0, cleans: 0, thrusters: 0,
  }
}

function calculateRepsFromMap(
  totalReps: number,
  map: ReadonlyArray<{ start: number; end: number; movement: string; count: number }>
): MovementBreakdown {
  const breakdown = emptyBreakdown()
  for (const segment of map) {
    if (totalReps < segment.start) break
    const repsInSegment = Math.min(totalReps, segment.end) - segment.start + 1
    ;(breakdown as unknown as Record<string, number>)[segment.movement] += repsInSegment
  }
  return breakdown
}

function calculate263Movements(totalReps: number): MovementBreakdown {
  const breakdown = emptyBreakdown()
  // 6 sections of 48 reps each
  for (let section = 0; section < 6; section++) {
    const sectionStart = section * 48
    for (const part of WOD_263_SECTION) {
      const repStart = sectionStart + part.offset + 1
      const repEnd = sectionStart + part.offset + part.count
      if (totalReps < repStart) return breakdown
      const done = Math.min(totalReps, repEnd) - repStart + 1
      ;(breakdown as unknown as Record<string, number>)[part.movement] += done
    }
  }
  return breakdown
}

function calculateTotalWeight263Precise(
  totalReps: number,
  division: string
): number {
  const divKey = division.replace("equipo_grizzlys", "foundation_male")
  const weights = WEIGHTS_263[divKey] || WEIGHTS_263.foundation_male
  let totalKg = 0

  for (let section = 0; section < 6; section++) {
    const weightIdx = Math.floor(section / 2) // 0,0,1,1,2,2
    const weight = weights[weightIdx]
    const sectionStart = section * 48

    // Cleans are at offset 12-23, thrusters at 36-47 within each section
    for (const part of WOD_263_SECTION) {
      if (part.movement !== "cleans" && part.movement !== "thrusters") continue
      const repStart = sectionStart + part.offset + 1
      const repEnd = sectionStart + part.offset + part.count
      if (totalReps < repStart) return totalKg
      const done = Math.min(totalReps, repEnd) - repStart + 1
      totalKg += done * weight
    }
  }
  return totalKg
}

export function calculateMovementsForWod(
  wodDisplayOrder: number,
  rawScore: number,
  isFinished: boolean,
  isRx: boolean
): MovementBreakdown {
  // If finished (has time), they completed ALL reps
  const totalReps = isFinished
    ? wodDisplayOrder === 1 ? 354 : wodDisplayOrder === 2 ? 168 : 288
    : rawScore

  switch (wodDisplayOrder) {
    case 1:
      return calculateRepsFromMap(totalReps, WOD_261_MAP)
    case 2:
      return calculateRepsFromMap(
        totalReps,
        isRx ? WOD_262_RX_MAP : WOD_262_FOUNDATION_MAP
      )
    case 3:
      return calculate263Movements(totalReps)
    default:
      return emptyBreakdown()
  }
}

// ==================== PATTERN DETECTION ====================

function detectPattern(wodResults: WodResult[], overallRank: number): Pattern {
  if (wodResults.length === 0) return "newcomer"
  if (wodResults.length <= 1) return "newcomer"

  // Top performer check
  const isTopOverall = overallRank <= 3
  const hasTopWod = wodResults.some((w) => w.rank <= 3)
  if (isTopOverall || hasTopWod) return "top"

  // Need at least 2 WODs for trend analysis
  const sorted = [...wodResults].sort((a, b) => a.displayOrder - b.displayOrder)

  // Improving: rank got better (lower) over time
  if (sorted.length >= 2) {
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    // Normalize rank to percentile for fair comparison across different totals
    const firstPct = first.rank / first.totalInDivision
    const lastPct = last.rank / last.totalInDivision
    if (lastPct < firstPct - 0.15) return "improving"
  }

  // Specialist: one WOD significantly better than others
  if (sorted.length >= 2) {
    const percentiles = sorted.map((w) => w.rank / w.totalInDivision)
    const best = Math.min(...percentiles)
    const others = percentiles.filter((p) => p !== best)
    const avgOthers = others.reduce((a, b) => a + b, 0) / others.length
    if (avgOthers - best > 0.25) return "specialist"
  }

  // Finisher: completed at least one WOD within time cap
  if (wodResults.some((w) => w.isFinished)) return "finisher"

  // Consistent: similar percentiles across all WODs
  if (sorted.length >= 2) {
    const percentiles = sorted.map((w) => w.rank / w.totalInDivision)
    const max = Math.max(...percentiles)
    const min = Math.min(...percentiles)
    if (max - min < 0.2) return "consistent"
  }

  // Warrior: completed all 3 WODs
  if (sorted.length === 3) return "warrior"

  return "warrior" // default: you showed up, that's what matters
}

// ==================== GREETING GENERATOR ====================

function generateGreeting(firstName: string, pattern: Pattern): string {
  const name = firstName.split(" ")[0] // Use first name only
  switch (pattern) {
    case "top":
      return `${name}, este Open fue TUYO.`
    case "improving":
      return `${name}, tu progreso habla por sí solo.`
    case "specialist":
      return `${name}, cuando brillas, BRILLAS.`
    case "finisher":
      return `${name}, cruzar la línea siempre será ganar.`
    case "consistent":
      return `${name}, la constancia es tu superpoder.`
    case "warrior":
      return `${name}, estuviste ahí y diste todo.`
    case "newcomer":
      return `${name}, ya diste el primer paso.`
  }
}

// ==================== STORY BULLETS ====================

function generateStoryBullets(
  wodResults: WodResult[],
  totalReps: number,
  totalWeightKg: number,
  totalLungeMeters: number,
  totalMovements: MovementBreakdown,
  pattern: Pattern,
  gender: "M" | "F",
  isRx: boolean,
  bestWod: WodResult | null
): string[] {
  const bullets: string[] = []
  const sorted = [...wodResults].sort((a, b) => a.displayOrder - b.displayOrder)

  // Bullet 1: Pattern-specific main insight
  switch (pattern) {
    case "top": {
      if (bestWod) {
        bullets.push(
          `En el ${bestWod.wodName} quedaste <strong>#${bestWod.rank} de ${bestWod.totalInDivision}</strong> en tu división. ${bestWod.rank === 1 ? "Primer lugar. Así de simple." : bestWod.rank <= 3 ? "Podio. Te lo ganaste." : "Top performers."}`
        )
      }
      break
    }
    case "improving": {
      const first = sorted[0]
      const last = sorted[sorted.length - 1]
      const improvement = first.rank - last.rank
      if (improvement > 0) {
        bullets.push(
          `Del ${first.wodName} al ${last.wodName} subiste <strong>${improvement} posiciones</strong> en tu división. Eso no es suerte, es trabajo.`
        )
      }
      break
    }
    case "specialist": {
      if (bestWod) {
        const pct = Math.round((1 - bestWod.rank / bestWod.totalInDivision) * 100)
        bullets.push(
          `En el ${bestWod.wodName} estuviste en el <strong>top ${100 - pct}%</strong> de tu división: <strong>#${bestWod.rank} de ${bestWod.totalInDivision}</strong>. Ese fue TU WOD.`
        )
      }
      break
    }
    case "finisher": {
      const finished = sorted.find((w) => w.isFinished)
      if (finished) {
        bullets.push(
          `Terminaste el ${finished.wodName} en <strong>${finished.displayScore}</strong> dentro del time cap. No todos lo logran.`
        )
      }
      break
    }
    default: {
      if (sorted.length === 3) {
        bullets.push(
          `Completaste los <strong>3 WODs del Open</strong>. 3 semanas, 3 pruebas diferentes. Eso es carácter.`
        )
      } else if (sorted.length > 0) {
        bullets.push(
          `Te paraste frente al Open y diste la cara. <strong>${sorted.length} WOD${sorted.length > 1 ? "s" : ""}</strong> completado${sorted.length > 1 ? "s" : ""}. Eso ya te pone adelante.`
        )
      }
    }
  }

  // Bullet 2: Volume / Physical achievement
  if (totalReps > 0) {
    bullets.push(
      `En total moviste <strong>${totalReps} repeticiones</strong> en el Open. Eso es más ejercicio del que el 60% de los mexicanos hace en un mes.`
    )
  }

  // Bullet 3: Specific movement highlight
  if (totalWeightKg > 500) {
    const comparison = totalWeightKg > 2000
      ? `Eso es como levantar un carro del piso`
      : totalWeightKg > 1000
      ? `Eso es como levantar una moto del piso`
      : `Eso es más de lo que la mayoría de la gente levanta en su vida`
    bullets.push(
      `Levantaste <strong>${Math.round(totalWeightKg).toLocaleString()} kg</strong> del piso en el 26.3. ${comparison}.`
    )
  } else if (totalMovements.wallBalls > 50) {
    bullets.push(
      `Hiciste <strong>${totalMovements.wallBalls} wall-balls</strong> en el 26.1. La mayoría de la gente no sobrevive 20. Tú hiciste ${totalMovements.wallBalls}.`
    )
  }

  // Bullet 4 (conditional): Pull-up stat for women
  if (gender === "F" && totalMovements.pullVariation3 > 0) {
    const pullName = isRx ? "ring muscle-ups" : "jumping pull-ups"
    bullets.push(
      `Hiciste <strong>${totalMovements.pullVariation3} ${pullName}</strong>. Solo el 5% de las mujeres en el mundo puede hacer UNA dominada. Tú hiciste ${totalMovements.pullVariation3} variaciones de jalón.`
    )
  } else if (gender === "F" && (totalMovements.pullVariation1 > 0 || totalMovements.pullVariation2 > 0)) {
    const totalPulls = totalMovements.pullVariation1 + totalMovements.pullVariation2 + totalMovements.pullVariation3
    if (totalPulls > 0) {
      bullets.push(
        `Hiciste <strong>${totalPulls} movimientos de jalón</strong> en el 26.2. Menos del 5% de las mujeres en el mundo puede hacer una dominada. Tú estás construyendo esa fuerza.`
      )
    }
  }

  // Bullet: Burpees
  if (totalMovements.burpees > 30 && !bullets.some(b => b.includes("burpee"))) {
    bullets.push(
      `Hiciste <strong>${totalMovements.burpees} burpees</strong> combinados con barra en el 26.3. La persona promedio no puede hacer 20 seguidos. Tú hiciste ${totalMovements.burpees}.`
    )
  }

  // Cap at 3-4 bullets
  return bullets.slice(0, 4)
}

// ==================== WOD-SPECIFIC VISCERAL PHRASES ====================

function getWodInsight(
  wod: WodResult,
  movements: MovementBreakdown,
  gender: "M" | "F",
  isRx: boolean
): string {
  switch (wod.displayOrder) {
    case 1: { // 26.1 wall-balls
      const reachedTheWall = wod.rawScore >= 145 || wod.isFinished
      const passedTheWall = wod.rawScore >= 211 || wod.isFinished
      if (passedTheWall) {
        return `Pasaste la sección de 66 wall-balls — ahí se quedó la mayoría del mundo. Tú no.`
      }
      if (reachedTheWall) {
        return `Llegaste a la sección de 66 wall-balls. Ahí es donde el cuerpo pide parar y la mente decide seguir.`
      }
      return `Cada wall-ball que lanzaste con los cuádriceps en llamas fue una decisión de no rendirte.`
    }
    case 2: { // 26.2 lunges + snatches + pull variation
      if (movements.pullVariation3 > 0) {
        const pullName = isRx ? "muscle-ups" : "jumping pull-ups"
        return `Llegaste a los ${pullName}: ronda 3. Después de lunges y snatches, todavía tenías para jalar.`
      }
      if (movements.lunges > 32) {
        return `${Math.round(movements.lunges * 1.5)} metros de zancadas con mancuerna. Los cuádriceps gritando. Y seguiste.`
      }
      return `Zancadas con mancuerna. Snatches. Jalones. El 26.2 probó todo. Y tú respondiste.`
    }
    case 3: { // 26.3 burpees + cleans + thrusters
      if (movements.cleans > 24) {
        return `Después de los burpees, agarrar la barra y hacer cleans... eso es mental. Tu cuerpo pedía parar. Tú no lo dejaste.`
      }
      if (movements.burpees > 0) {
        return `Burpees, barra del piso, barra al cielo. Repetir. ${Math.round(wod.rawScore)} veces. No cualquiera.`
      }
      return `El 26.3 fue el WOD más brutal: burpees + barra + peso subiendo. Tú lo enfrentaste.`
    }
    default:
      return ""
  }
}

// ==================== GLOBAL FACTS ====================

function pickGlobalFact(
  pattern: Pattern,
  wodResults: WodResult[],
  gender: "M" | "F"
): string {
  const has261 = wodResults.some((w) => w.displayOrder === 1)
  const has262 = wodResults.some((w) => w.displayOrder === 2)

  if (has261) {
    return `Más de 300,000 atletas en el mundo hicieron este Open. Menos del 1% terminó el 26.1. Nadie esperaba que fuera fácil.`
  }
  if (has262 && gender === "F") {
    return `Solo el 4% de las mujeres en el mundo terminaron el 26.2 RX. Que hayas estado ahí compitiendo ya es elite.`
  }
  if (has262 && gender === "M") {
    return `Solo el 13% de los hombres en el mundo terminaron el 26.2 RX. El Open no es para cualquiera.`
  }
  return `Participaste en el evento deportivo más grande del planeta junto a más de 300,000 atletas. Piénsalo.`
}

// ==================== BEST WOD MESSAGE ====================

function generateBestWodMessage(bestWod: WodResult | null): string {
  if (!bestWod) return ""
  const pctTop = Math.round((bestWod.rank / bestWod.totalInDivision) * 100)
  const topLabel = pctTop <= 10
    ? "top 10%"
    : pctTop <= 25
    ? "top 25%"
    : pctTop <= 50
    ? "primera mitad"
    : "de tu división"

  if (bestWod.rank <= 3) {
    const medal = bestWod.rank === 1 ? "🥇" : bestWod.rank === 2 ? "🥈" : "🥉"
    return `${medal} Tu mejor momento: ${bestWod.wodName} — #${bestWod.rank} de ${bestWod.totalInDivision}. Podio.`
  }
  return `Tu mejor momento: ${bestWod.wodName} — #${bestWod.rank} de ${bestWod.totalInDivision} (${topLabel}).`
}

// ==================== CLOSING MESSAGES ====================

const CLOSING_MESSAGES = [
  "No entrenamos para ganar medallas. Entrenamos para sentirnos vivos, para dormir mejor, para tener energía para nuestra familia, para soltar el estrés del día.",
  "El leaderboard se olvida. Lo que queda es que fuiste más fuerte que tu excusa de no ir.",
  "Cada rep fue una inversión en tu salud. Cada gota de sudor fue estrés que soltaste. Cada WOD fue una versión mejor de ti.",
  "Solo el 40% de los mexicanos hace ejercicio. Tú no solo haces ejercicio — compites. Eso te pone en otro nivel.",
  "No importa si quedaste primero o último. Importa que estuviste ahí cuando tu cuerpo quería parar, y seguiste.",
  "Tu cuerpo te lo agradece. Tu mente te lo agradece. Tu familia te lo agradece. Sigue así, Grizzly. 🐻",
]

function pickClosingMessage(pattern: Pattern, index: number): string {
  // Use pattern + index to vary the message per athlete
  switch (pattern) {
    case "top":
      return "Lo lograste por ti, por tu disciplina, por las horas que nadie ve. Pero no olvides: el verdadero premio es la salud, la energía y la mejor versión de ti que construyes cada día."
    case "improving":
      return "Tu evolución en este Open demuestra que el trabajo constante da frutos. Sigue así — no solo por el leaderboard, sino por tu salud, tu energía y tu familia."
    case "newcomer":
      return "Diste el primer paso, que es el más difícil. Ahora ya sabes de qué eres capaz. Lo demás viene solo. Sigue así, Grizzly. 🐻"
    default:
      return CLOSING_MESSAGES[index % CLOSING_MESSAGES.length]
  }
}

// ==================== MAIN ANALYZER ====================

export function analyzeAthlete(
  fullName: string,
  division: string,
  gender: "M" | "F",
  wodResults: WodResult[],
  overallRank: number,
  totalAthletes: number,
  athleteIndex: number = 0
): AthleteInsight {
  const isRx = isDivisionRx(division)
  const sorted = [...wodResults].sort((a, b) => a.displayOrder - b.displayOrder)

  // Calculate movements per WOD
  const movementsByWod: Record<string, MovementBreakdown> = {}
  const totalMovements = emptyBreakdown()

  for (const wod of sorted) {
    const reps = wod.isFinished
      ? wod.displayOrder === 1 ? 354 : wod.displayOrder === 2 ? 168 : 288
      : wod.rawScore

    const movements = calculateMovementsForWod(wod.displayOrder, reps, wod.isFinished, isRx)
    movementsByWod[wod.wodName] = movements

    // Sum totals
    for (const key of Object.keys(totalMovements) as (keyof MovementBreakdown)[]) {
      totalMovements[key] += movements[key]
    }
  }

  // Total reps
  const totalReps = sorted.reduce((sum, w) => {
    return sum + (w.isFinished
      ? (w.displayOrder === 1 ? 354 : w.displayOrder === 2 ? 168 : 288)
      : w.rawScore)
  }, 0)

  // Total weight for 26.3
  const wod263 = sorted.find((w) => w.displayOrder === 3)
  const totalWeightKg = wod263
    ? calculateTotalWeight263Precise(
        wod263.isFinished ? 288 : wod263.rawScore,
        division
      )
    : 0

  // Lunge meters (26.2): each 16 lunges = 24 meters (80ft)
  const totalLungeMeters = Math.round((totalMovements.lunges / 16) * 24)

  // Best WOD (lowest rank percentile)
  const bestWod = sorted.length > 0
    ? sorted.reduce((best, curr) =>
        curr.rank / curr.totalInDivision < best.rank / best.totalInDivision ? curr : best
      )
    : null

  // Pattern detection
  const pattern = detectPattern(sorted, overallRank)

  // Generate all content
  const greeting = generateGreeting(fullName, pattern)

  const storyBullets = generateStoryBullets(
    sorted, totalReps, totalWeightKg, totalLungeMeters,
    totalMovements, pattern, gender, isRx, bestWod
  )

  const globalFact = pickGlobalFact(pattern, sorted, gender)
  const bestWodMessage = generateBestWodMessage(bestWod)
  const closingMessage = pickClosingMessage(pattern, athleteIndex)

  // Per-WOD visceral insights
  const wodInsights = sorted.map((wod) => ({
    wodName: wod.wodName,
    phrase: getWodInsight(wod, movementsByWod[wod.wodName], gender, isRx),
  }))

  return {
    pattern,
    greeting,
    storyBullets,
    globalFact,
    movementsByWod,
    totalMovements,
    totalReps,
    totalWeightKg,
    totalLungeMeters,
    bestWod,
    bestWodMessage,
    closingMessage,
    wodInsights,
  }
}

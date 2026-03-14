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

// ==================== PERSONALIZED MESSAGES ====================

// Crew de las 6pm — nombres cortos para mencionar en mensajes
const CREW_6PM_NAMES: Record<string, string> = {
  "mirna aracelly perez ceballos": "Mirna",
  "ricardo espinosa suarez": "Ricardo",
  "mariel avila perez": "Mariel",
  "cesar alexis ruiz chigo": "César",
  "cesar manuel bastarrachea alcocer": "César B.",
  "felix fierro mandujano": "Félix",
  "gerardo emilio torres lara": "Gerardo",
  "rogelio lopez": "Rogelio",
  "maria aguilar": "María",
  "andrea fernandez": "Andrea",
}

// Normalize accented characters for matching
function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function getCrewBullet(fullName: string): string {
  const key = normalize(fullName)
  const others = Object.entries(CREW_6PM_NAMES)
    .filter(([k]) => normalize(k) !== key)
    .map(([, name]) => name)
  return `Eres parte del crew de las 6pm: ${others.join(", ")}. Los que se levantan cuando el cuerpo dice no. Los que gritan tu nombre cuando ya no puedes. Los que se quedan a recoger la barra contigo. Eso no es un gym — es familia.`
}

function getCrewClosing(): string {
  return "Hay días que no quieres ir. Días que el cuerpo pesa, que la cabeza dice 'hoy no'. Pero llegas. Y ahí están ellos. Mirna echándote porras, Félix sudando a tu lado, Ricardo empujando, Mariel sin parar. El crew de las 6 no te deja caer. Y tú tampoco los dejas caer a ellos. Somos compañeros, somos equipo, somos familia. Eso es lo que nos hace el mejor horario. 🐻🔥"
}

interface PersonalOverride {
  greeting: string
  closingMessage: string
  extraBullet: string
}

function getPersonalOverride(fullName: string): PersonalOverride | null {
  const key = normalize(fullName)

  // Martha Sofia Lares — esposa de Samuel
  if (key === "martha sofia lares") {
    return {
      greeting: "Sofi, este Open fue por Bernardo, por Samuel, y por ti.",
      extraBullet: "Cada hora que invertiste haciendo ejercicio, la invertiste en tu familia. En tener más energía para Bernardo, en estar más fuerte para Samuel, en ser la mejor versión de ti para los que más te importan.",
      closingMessage: "Sofi, cada rep fue por ellos. Cada gota de sudor fue salud para tu familia. Bernardo un día va a saber que su mamá es una guerrera. Samuel ya lo sabe. Sigue así. 🐻❤️",
    }
  }

  // Crew de las 6pm
  if (key in CREW_6PM_NAMES) {
    const nickname = CREW_6PM_NAMES[key]
    return {
      greeting: `${nickname}, este Open lo hicimos juntos.`,
      extraBullet: getCrewBullet(fullName),
      closingMessage: getCrewClosing(),
    }
  }

  return null
}

// Andrea Fernandez — special case (no scores, was judge)
export function getAndreaSpecialMessage(): {
  greeting: string
  message: string
  closing: string
} {
  return {
    greeting: "Andrea, tú también eres parte de este Open.",
    message: "No pudiste competir por lesión, pero no te perdiste ni un solo Open. Estuviste ahí como juez, contando reps, validando scores, echándole porras a Félix y al crew de las 6. Ser juez es ser parte del Open tanto como ser atleta. Sin ti, esto no funciona.",
    closing: "La lesión te frenó, pero no te detuvo. Estuviste ahí para los demás cuando no podías estar para ti. Eso es más fuerte que cualquier WOD. Cuando regreses, el crew va a estar ahí para ti. 🐻❤️",
  }
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
  rawScore: number, // unfinished = rep count, finished = seconds (ignored when isFinished=true)
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

function generateGreeting(firstName: string, pattern: Pattern, athleteIndex: number): string {
  const name = firstName.split(" ")[0] // Use first name only

  const warriorGreetings = [
    `${name}, 3 WODs, 3 semanas, cero excusas.`,
    `${name}, no faltaste ni un solo Open.`,
    `${name}, te la rifaste las 3 semanas.`,
    `${name}, estuviste ahí y diste todo.`,
    `${name}, el Open 2026 lleva tu nombre.`,
  ]

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
      return warriorGreetings[athleteIndex % warriorGreetings.length]
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
  bestWod: WodResult | null,
  athleteIndex: number
): string[] {
  const bullets: string[] = []
  const sorted = [...wodResults].sort((a, b) => a.displayOrder - b.displayOrder)

  // Bullet 1: Pattern-specific main insight
  switch (pattern) {
    case "top": {
      if (bestWod) {
        bullets.push(
          `En el ${bestWod.wodName} quedaste <strong>#${bestWod.rank} de ${bestWod.totalInDivision}</strong> en tu división. ${bestWod.rank === 1 ? "Primer lugar. Así de simple." : bestWod.rank <= 3 ? "Podio. Te lo ganaste." : "De los mejores de tu categoría."}`
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
          `Del ${first.wodName} al ${last.wodName} subiste <strong>${improvement} posiciones</strong> en tu división. Semana a semana, más fuerte.`
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

  // Bullet 2: Volume — variamos la comparación
  if (totalReps > 0) {
    const volumeVariants = [
      `En total moviste <strong>${totalReps} repeticiones</strong> en el Open. Eso es más de lo que la mayoría hace en un mes entero.`,
      `Moviste tu cuerpo <strong>${totalReps} veces</strong> en 3 semanas. Eso es disciplina.`,
      `<strong>${totalReps} reps</strong> en el Open. Si cada rep fuera un paso, habrías caminado <strong>${Math.round(totalReps * 0.7)}m</strong> — casi ${totalReps * 0.7 > 500 ? "medio kilómetro" : totalReps * 0.7 > 200 ? "dos cuadras" : "una cuadra"}.`,
    ]
    bullets.push(volumeVariants[athleteIndex % volumeVariants.length])
  }

  // Bullet 3: Specific movement highlight — peso personalizado por género
  if (totalWeightKg > 500) {
    let comparison: string
    if (gender === "F") {
      comparison = totalWeightKg > 1000
        ? "Levantaste más de una tonelada. Literal."
        : totalWeightKg > 600
        ? "Levantaste lo que pesa un caballo"
        : "Eso equivale a cargar a 8 personas"
    } else {
      comparison = totalWeightKg > 1500
        ? "Levantaste más de lo que pesa un VW Beetle"
        : totalWeightKg > 800
        ? "Eso es como levantar una moto del piso"
        : "Eso equivale a mover un piano de cola"
    }
    bullets.push(
      `Levantaste <strong>${Math.round(totalWeightKg).toLocaleString()} kg</strong> del piso en el 26.3. ${comparison}.`
    )
  } else if (totalMovements.wallBalls > 50) {
    // Fix: no repetir el número dos veces
    bullets.push(
      `Hiciste <strong>${totalMovements.wallBalls} wall-balls</strong> lanzando un balón de 6kg a 2.7 metros. La mayoría de la gente no sobrevive 20.`
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

  // Bullet: Burpees — sin repetir número
  if (totalMovements.burpees > 30 && !bullets.some(b => b.includes("burpee"))) {
    bullets.push(
      `Hiciste <strong>${totalMovements.burpees} burpees</strong> combinados con barra en el 26.3. La persona promedio no puede hacer 20 seguidos.`
    )
  }

  // Bullet: Experiencia física visceral (rotar entre opciones)
  const physicalBullets = [
    totalMovements.wallBalls > 50
      ? `¿Te acuerdas del wall-ball 50? Cuando los hombros ardían y el balón pesaba el doble. Ahí fue cuando decidiste que ibas a seguir.`
      : null,
    totalMovements.burpees > 12 && totalMovements.cleans > 12
      ? `Ese momento en el 26.3 cuando haces el burpee y sabes que tienes que agarrar la barra OTRA VEZ. Y la agarras.`
      : null,
    totalMovements.lunges > 16
      ? `Las zancadas del 26.2 con la mancuerna arriba. Los cuádriceps temblando. Y el coach gritando tu nombre.`
      : null,
    totalMovements.cleans > 12 && totalMovements.thrusters > 0
      ? `Después del clean 12, viene el thruster 1. Y tu cerebro dice 'descansa'. Pero tú dices 'uno más'.`
      : null,
  ].filter(Boolean) as string[]

  if (physicalBullets.length > 0 && bullets.length < 4) {
    bullets.push(physicalBullets[athleteIndex % physicalBullets.length])
  }

  // Cap at 4 bullets
  return bullets.slice(0, 4)
}

// ==================== WOD-SPECIFIC VISCERAL PHRASES ====================

function getWodInsight(
  wod: WodResult,
  movements: MovementBreakdown,
  gender: "M" | "F",
  isRx: boolean,
  finishedPerWod: Record<number, number>
): string {
  const reps = wod.isFinished
    ? (wod.displayOrder === 1 ? 354 : wod.displayOrder === 2 ? 168 : 288)
    : wod.rawScore
  const finishedCount = finishedPerWod[wod.displayOrder] || 0

  // Si terminó el WOD y es raro, resaltar la rareza
  if (wod.isFinished && finishedCount > 0 && finishedCount <= wod.totalInDivision * 0.4) {
    return `Terminaste en ${wod.displayScore}. Solo ${finishedCount} de ${wod.totalInDivision} en tu categoría lo lograron.`
  }

  switch (wod.displayOrder) {
    case 1: { // 26.1 wall-balls
      if (wod.isFinished) {
        return `Terminaste las 354 reps. Pasaste la sección de 66 wall-balls — ahí se quedó la mayoría. Tú no.`
      }
      if (reps > 210) {
        return `Pasaste la sección de 66 wall-balls — ahí se quedó la mayoría del mundo. Tú no.`
      }
      if (reps >= 145) {
        return `Llegaste a la sección de 66 wall-balls. Ahí es donde el cuerpo pide parar y la mente decide seguir.`
      }
      if (reps >= 87) {
        return `Pasaste de los box jumps a los wall-balls pesados. Eso requiere piernas Y hombros.`
      }
      return `Cada wall-ball fue una batalla. Y no soltaste el balón.`
    }
    case 2: { // 26.2 lunges + snatches + pull variation
      if (wod.isFinished) {
        const pullName = isRx ? "muscle-ups" : "jumping pull-ups"
        return `Completaste las 168 reps: lunges, snatches y ${pullName}. Las 3 rondas. Hasta el final.`
      }
      if (movements.pullVariation3 > 0) {
        const pullName = isRx ? "muscle-ups" : "jumping pull-ups"
        return `Llegaste a los ${pullName}: ronda 3. Después de lunges y snatches, todavía tenías para jalar.`
      }
      if (reps > 112) {
        return `Ya ibas por la segunda ronda. Lunges, snatches, jalones — de nuevo. Eso es aguante.`
      }
      if (reps >= 37) {
        return `Llegaste a los jalones. Eso es terminar ronda 1 completa. Sólido.`
      }
      return `Lunges con mancuerna y snatches: dos movimientos que piden todo. Tú les diste todo.`
    }
    case 3: { // 26.3 burpees + cleans + thrusters
      if (wod.isFinished) {
        return `Terminaste los 288 reps: 3 pesos, 6 secciones, burpees + barra sin parar. Completaste TODO.`
      }
      if (reps > 192) {
        return `Tercer peso. Los brazos temblando. Y seguiste agarrando la barra.`
      }
      if (reps > 96) {
        return `Llegaste al segundo peso. Ahí la barra pesa más pero tú ya estabas caliente.`
      }
      if (reps >= 48) {
        return `Completaste la primera sección y seguiste. El peso todavía no subía. Pero tú sí.`
      }
      if (reps > 0) {
        return `12 burpees + 12 cleans en la primera ronda. Eso ya es más de lo que la mayoría intenta.`
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
  gender: "M" | "F",
  athleteIndex: number
): string {
  const has261 = wodResults.some((w) => w.displayOrder === 1)
  const has262 = wodResults.some((w) => w.displayOrder === 2)

  // Pool de facts generales que aplican a todos
  const generalFacts = [
    `Más de 300,000 atletas en el mundo hicieron este Open. Desde Islandia hasta México. Tú fuiste uno de ellos.`,
    `Solo el 40% de los mexicanos hace ejercicio. Tú no solo haces ejercicio — compites.`,
    `El Open es el evento deportivo participativo más grande del planeta. Y tú estuviste ahí.`,
    `59% de los participantes del Open son masters (+34 años). El fitness no tiene edad.`,
    `Participaste en el evento deportivo más grande del planeta junto a más de 300,000 atletas. Piénsalo.`,
  ]

  // Facts específicos por WOD
  const specificFacts: string[] = []
  if (has261) {
    specificFacts.push(`Menos del 1% del mundo terminó el 26.1. Nadie esperaba que fuera fácil.`)
  }
  if (has262 && gender === "F") {
    specificFacts.push(`Solo el 4% de las mujeres en el mundo terminaron el 26.2 RX. Que hayas estado ahí compitiendo ya es elite.`)
  }
  if (has262 && gender === "M") {
    specificFacts.push(`Solo el 13% de los hombres en el mundo terminaron el 26.2 RX. El Open no es para cualquiera.`)
  }

  // Combinar y rotar
  const allFacts = [...specificFacts, ...generalFacts]
  return allFacts[athleteIndex % allFacts.length]
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
  "No importa si quedaste primero o último. Importa que estuviste ahí cuando tu cuerpo quería parar, y seguiste.",
  "Tu cuerpo te lo agradece. Tu mente te lo agradece. Tu familia te lo agradece. Sigue así, Grizzly. 🐻",
  "Entrenar es elegirte a ti. Y tú te elegiste 3 veces en 3 semanas.",
  "La persona más fuerte del box no es la que levanta más — es la que siempre regresa. Tú siempre regresas.",
  "El Open se acaba. El hábito que construiste, no. Eso se queda contigo.",
  "Hoy te duele. Mañana te enorgullece. Siempre valió la pena.",
  "Nadie te obligó a estar ahí. Elegiste el sudor, el dolor, la incomodidad. Y lo volverías a hacer. Eso dice todo.",
  "Hay gente que paga Netflix para ver a otros hacer cosas difíciles. Tú las HACES.",
  "¿Sabes qué es más difícil que un burpee? Ir al gym cuando nadie te está viendo. Y tú fuiste.",
  "Tus hijos, tu pareja, tu familia... ellos ven que no te rindes. Eso se hereda mejor que cualquier gen.",
  "No necesitas un six-pack para ser atleta. Necesitas presentarte. Y tú lo hiciste.",
  "El Open te enseñó algo: que puedes más de lo que crees. No lo olvides cuando venga el siguiente reto.",
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

// ==================== ACHIEVEMENT SCANNER ====================

function detectAchievements(
  wodResults: WodResult[],
  finishedPerWod: Record<number, number>
): string[] {
  const achievements: string[] = []
  const sorted = [...wodResults].sort((a, b) => a.displayOrder - b.displayOrder)

  // 1. Terminó un WOD donde pocos lo lograron (rarity check)
  for (const wod of sorted) {
    if (!wod.isFinished) continue
    const finishedCount = finishedPerWod[wod.displayOrder] || 0
    const totalInDiv = wod.totalInDivision
    // Solo resaltar si menos del 40% de la división terminó
    if (finishedCount > 0 && finishedCount <= totalInDiv * 0.4) {
      achievements.push(
        `Terminaste el <strong>${wod.wodName}</strong> en <strong>${wod.displayScore}</strong>. Solo <strong>${finishedCount} de ${totalInDiv}</strong> en tu categoría lo lograron.`
      )
    }
  }

  // 2. Terminó TODOS los WODs dentro del time cap
  if (sorted.length === 3 && sorted.every((w) => w.isFinished)) {
    achievements.push(
      `Terminaste los <strong>3 WODs</strong> dentro del time cap. Eso es completar CADA prueba.`
    )
  }

  // 3. Top 3 en un WOD específico (resaltar cada podio)
  for (const wod of sorted) {
    if (wod.rank <= 3) {
      const medal = wod.rank === 1 ? "🥇" : wod.rank === 2 ? "🥈" : "🥉"
      achievements.push(
        `${medal} Podio en el <strong>${wod.wodName}</strong>: <strong>#${wod.rank} de ${wod.totalInDivision}</strong>.`
      )
    }
  }

  // 4. Top 10% en un WOD (solo si no ya tiene podio)
  for (const wod of sorted) {
    if (wod.rank > 3 && wod.rank / wod.totalInDivision <= 0.10) {
      achievements.push(
        `<strong>Top 10%</strong> de tu categoría en el <strong>${wod.wodName}</strong>: #${wod.rank} de ${wod.totalInDivision}.`
      )
    }
  }

  // 5. Mejoró mucho entre WODs (>10 posiciones)
  if (sorted.length >= 2) {
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const improvement = first.rank - last.rank
    if (improvement > 10) {
      achievements.push(
        `Del <strong>${first.wodName}</strong> al <strong>${last.wodName}</strong>, subiste <strong>${improvement} posiciones</strong>. Cada semana más fuerte.`
      )
    }
  }

  // 6. Easter eggs por score específico
  const wod262 = sorted.find((w) => w.displayOrder === 2)
  if (wod262 && (wod262.isFinished || wod262.rawScore === 168)) {
    // Solo agregar si no ya hay un achievement de "terminaste 26.2"
    if (!achievements.some(a => a.includes(wod262.wodName) && a.includes("Terminaste"))) {
      achievements.push("Terminaste TODAS las reps del 26.2. Hasta la última. Eso es acabar lo que empiezas.")
    }
  }

  const wod261 = sorted.find((w) => w.displayOrder === 1)
  if (wod261 && (wod261.isFinished || wod261.rawScore > 300)) {
    if (!achievements.some(a => a.includes("300 reps"))) {
      achievements.push("Pasaste las 300 reps en el 26.1. En un WOD que menos del 1% del mundo terminó.")
    }
  }

  if (sorted.length === 3 && sorted.every((w) => w.rank <= 5)) {
    achievements.push("Top 5 en TODOS los WODs. Eso no es talento, es obsesión sana.")
  }

  return achievements
}

// ==================== MAIN ANALYZER ====================

export function analyzeAthlete(
  fullName: string,
  division: string,
  gender: "M" | "F",
  wodResults: WodResult[],
  overallRank: number,
  totalAthletes: number,
  athleteIndex: number = 0,
  finishedPerWod: Record<number, number> = {}
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
  const greeting = generateGreeting(fullName, pattern, athleteIndex)

  // Achievement scanner — detectar logros notables primero
  const achievements = detectAchievements(sorted, finishedPerWod)

  const patternBullets = generateStoryBullets(
    sorted, totalReps, totalWeightKg, totalLungeMeters,
    totalMovements, pattern, gender, isRx, bestWod, athleteIndex
  )

  // Merge: achievements first (max 2), then pattern bullets, cap at 5
  const achievementBullets = achievements.slice(0, 2)
  // Filter pattern bullets that don't duplicate achievement content
  const filteredPatternBullets = patternBullets.filter((bullet) => {
    // Skip generic "3 WODs" bullet if we already have specific finish achievements
    if (achievementBullets.some(a => a.includes("Terminaste")) && bullet.includes("3 WODs del Open")) {
      return false
    }
    // Skip generic podio bullet if achievement already mentions it
    if (achievementBullets.some(a => a.includes("Podio")) && bullet.includes("Podio")) {
      return false
    }
    return true
  })
  const storyBullets = [...achievementBullets, ...filteredPatternBullets].slice(0, 5)

  const globalFact = pickGlobalFact(pattern, sorted, gender, athleteIndex)
  const bestWodMessage = generateBestWodMessage(bestWod)
  const closingMessage = pickClosingMessage(pattern, athleteIndex)

  // Per-WOD visceral insights (with rarity data)
  const wodInsights = sorted.map((wod) => ({
    wodName: wod.wodName,
    phrase: getWodInsight(wod, movementsByWod[wod.wodName], gender, isRx, finishedPerWod),
  }))

  // Apply personal overrides if this athlete has one
  const personalOverride = getPersonalOverride(fullName)
  const finalGreeting = personalOverride?.greeting ?? greeting
  const finalClosing = personalOverride?.closingMessage ?? closingMessage
  const finalBullets = personalOverride?.extraBullet
    ? [personalOverride.extraBullet, ...storyBullets]
    : storyBullets

  return {
    pattern,
    greeting: finalGreeting,
    storyBullets: finalBullets,
    globalFact,
    movementsByWod,
    totalMovements,
    totalReps,
    totalWeightKg,
    totalLungeMeters,
    bestWod,
    bestWodMessage,
    closingMessage: finalClosing,
    wodInsights,
  }
}

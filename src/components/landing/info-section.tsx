import { Timer, Repeat, Weight, Dumbbell, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WodInfo {
  name: string
  day_number: number
  description: string | null
  score_type: string
}

interface InfoSectionProps {
  wods: WodInfo[]
  divisions: string[]
}

const scoreTypeIcons: Record<string, typeof Timer> = {
  time: Timer,
  reps: Repeat,
  weight: Weight,
}

const scoreTypeLabels: Record<string, string> = {
  time: "For Time",
  reps: "AMRAP / Reps",
  weight: "Peso Máximo",
}

const guideCards = [
  {
    icon: Repeat,
    title: "AMRAP / Reps",
    subtitle: "As Many Reps As Possible",
    description:
      "Realiza tantas repeticiones como puedas en el tiempo asignado. Mide tu resistencia y capacidad de trabajo. A más repeticiones, mejor posición.",
  },
  {
    icon: Timer,
    title: "For Time",
    subtitle: "Contra reloj",
    description:
      "Completa el workout lo más rápido posible. Mide tu velocidad y eficiencia. El atleta con menor tiempo gana.",
  },
  {
    icon: Weight,
    title: "Peso Máximo",
    subtitle: "Repetición máxima (1RM)",
    description:
      "Levanta el mayor peso posible en el movimiento indicado. Mide tu fuerza máxima. Se registra en libras (lbs).",
  },
  {
    icon: Dumbbell,
    title: "RX vs Scaled",
    subtitle: "Nivel de dificultad",
    description:
      "RX es el workout tal cual está prescrito. Scaled permite ajustar pesos o movimientos para adaptarlo a tu nivel. Ambos compiten en categorías separadas.",
  },
]

export function InfoSection({ wods, divisions }: InfoSectionProps) {
  return (
    <section className="bg-[#0a0a0a] px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        {/* WODs */}
        {wods.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-8 text-center font-display text-4xl tracking-wider text-white sm:text-5xl">
              Los Workouts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wods.map((wod) => {
                const Icon = scoreTypeIcons[wod.score_type] || Timer
                return (
                  <Card key={wod.name} className="border-2 border-gray-800 bg-[#111] transition-all hover:border-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-display text-2xl tracking-wider text-primary">{wod.name}</CardTitle>
                        <span className="rounded-md bg-gray-800 px-3 py-1 font-display text-xs tracking-wider text-gray-300">
                          DÍA {wod.day_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Icon className="h-3 w-3" />
                        {scoreTypeLabels[wod.score_type]}
                      </div>
                    </CardHeader>
                    {wod.description && (
                      <CardContent>
                        <p className="whitespace-pre-line text-sm text-gray-400">
                          {wod.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Divisions */}
        <div className="mb-12">
          <h2 className="mb-8 text-center font-display text-4xl tracking-wider text-white sm:text-5xl">
            Divisiones
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {divisions.map((div) => (
              <span
                key={div}
                className="rounded-lg border-2 border-primary bg-transparent px-4 py-2 font-display text-sm tracking-wider text-primary"
              >
                {div.replace(/_/g, " ").replace(/(\d+)/, " $1+").toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Guide: How it works */}
        <div>
          <div className="mb-8 flex flex-col items-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h2 className="text-center font-display text-4xl tracking-wider text-white sm:text-5xl">
              ¿Cómo Funciona?
            </h2>
            <p className="text-center text-sm text-gray-500">
              Guía rápida para entender los métodos de evaluación
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {guideCards.map((card) => {
              const Icon = card.icon
              return (
                <Card key={card.title} className="border-2 border-gray-800 bg-[#111]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-lg tracking-wider text-primary">{card.title}</CardTitle>
                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

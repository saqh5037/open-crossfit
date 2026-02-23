import { Timer, Repeat, Weight } from "lucide-react"
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
  weight: "Max Load",
}

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
                          DIA {wod.day_number}
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
        <div>
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
      </div>
    </section>
  )
}

export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Dumbbell, ClipboardList, Trophy } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const [athleteCount, wodCount, scoreCount, config] = await Promise.all([
    prisma.athlete.count(),
    prisma.wod.count({ where: { is_active: true } }),
    prisma.score.count(),
    prisma.eventConfig.findFirst(),
  ])

  // Get scores per WOD
  const wods = await prisma.wod.findMany({
    where: { is_active: true },
    orderBy: { display_order: "asc" },
    include: { _count: { select: { scores: true } } },
  })

  const expectedScores = athleteCount * wodCount
  const completionPct = expectedScores > 0 ? Math.round((scoreCount / expectedScores) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Atletas
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{athleteCount}</p>
            <p className="text-xs text-gray-400">
              Registro {config?.registration_open ? "abierto" : "cerrado"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              WODs Activos
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{wodCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Scores Capturados
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{scoreCount}</p>
            <p className="text-xs text-gray-400">
              de {expectedScores} esperados ({completionPct}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Completitud
            </CardTitle>
            <Trophy className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionPct}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scores per WOD */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por WOD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {wods.map((wod) => {
              const pct = athleteCount > 0 ? Math.round((wod._count.scores / athleteCount) * 100) : 0
              return (
                <div key={wod.id} className="flex items-center gap-4">
                  <span className="w-16 font-bold">{wod.name}</span>
                  <div className="flex-1">
                    <div className="h-3 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm text-gray-400">
                    {wod._count.scores}/{athleteCount} ({pct}%)
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href="/admin/scores">Capturar Scores</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/leaderboard" target="_blank">
            Ver Leaderboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

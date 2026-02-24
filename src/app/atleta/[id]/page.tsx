export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { notFound } from "next/navigation"
import { getDivisionLabel } from "@/lib/divisions"
import { AtletaCard } from "@/components/athlete/athlete-card"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const athlete = await prisma.athlete.findUnique({ where: { id: params.id } })
  if (!athlete) return { title: "Atleta no encontrado" }
  return {
    title: `${athlete.full_name} #${athlete.participant_number} — GRIZZLYS Open 2026`,
    description: `Perfil de ${athlete.full_name} en el CrossFit Open 2026`,
  }
}

export default async function AtletaPage({ params }: { params: { id: string } }) {
  const config = await prisma.eventConfig.findFirst()

  const athlete = await prisma.athlete.findUnique({
    where: { id: params.id },
    include: {
      scores: {
        include: { wod: true },
        orderBy: { wod: { display_order: "asc" } },
      },
    },
  })

  if (!athlete) notFound()

  // Detect if user is a judge
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as { role?: string } | undefined)?.role
  const isJudge = !!userRole && ["judge", "coach", "admin", "owner"].includes(userRole)

  // Fetch WODs for judges
  const wods = isJudge
    ? await prisma.wod.findMany({
        where: { is_active: true },
        orderBy: { display_order: "asc" },
      })
    : []

  const serializedAthlete = {
    id: athlete.id,
    participant_number: athlete.participant_number,
    full_name: athlete.full_name,
    division: athlete.division,
    birth_date: athlete.birth_date?.toISOString() ?? null,
    photo_url: athlete.photo_url,
  }

  const serializedScores = athlete.scores.map((s) => ({
    id: s.id,
    display_score: s.display_score,
    is_rx: s.is_rx,
    wod: {
      name: s.wod.name,
      score_type: s.wod.score_type,
    },
  }))

  const serializedWods = wods.map((w) => ({
    id: w.id,
    name: w.name,
    score_type: w.score_type,
    time_cap_seconds: w.time_cap_seconds,
  }))

  return (
    <>
      <Header registrationOpen={config?.registration_open ?? false} />
      <main className="min-h-screen bg-black px-4 py-8">
        <div className="container mx-auto max-w-lg">
          <AtletaCard
            athlete={serializedAthlete}
            scores={serializedScores}
            eventName={config?.name ?? "CrossFit Open 2026"}
            divisionLabel={getDivisionLabel(athlete.division)}
            wods={serializedWods}
            isJudge={isJudge}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}

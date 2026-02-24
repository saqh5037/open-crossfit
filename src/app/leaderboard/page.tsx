export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LeaderboardClient } from "@/components/leaderboard/leaderboard-client"

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { division?: string }
}) {
  const division = searchParams.division || "rx_male"

  const [config, session] = await Promise.all([
    prisma.eventConfig.findFirst(),
    getServerSession(authOptions),
  ])
  const availableDivisions = (config?.divisions as string[]) ?? ["rx_male", "rx_female"]

  // Fetch initial leaderboard data
  let initialData: unknown[] = []
  let initialWods: { id: string; name: string; score_type: string }[] = []

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/leaderboard?division=${division}`,
      { cache: "no-store" }
    )
    const json = await res.json()
    initialData = json.data ?? []
    initialWods = json.wods ?? []
  } catch {
    // Fallback: fetch directly with Prisma
    initialWods = await prisma.wod.findMany({
      where: { is_active: true },
      orderBy: { display_order: "asc" },
      select: { id: true, name: true, score_type: true },
    })
  }

  return (
    <>
      <Header registrationOpen={config?.registration_open ?? false} userRole={(session?.user as { role?: string } | undefined)?.role ?? null} />
      <main className="min-h-screen bg-black px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <h1 className="mb-6 text-3xl font-black uppercase tracking-tight text-white">
            Leaderboard
          </h1>
          <LeaderboardClient
            initialData={initialData as never[]}
            initialWods={initialWods}
            initialDivision={division}
            availableDivisions={availableDivisions}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}

export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { LeaderboardTV } from "@/components/leaderboard/leaderboard-tv"

export default async function TVPage({
  searchParams,
}: {
  searchParams: { division?: string }
}) {
  const division = searchParams.division || "rx_male"
  const config = await prisma.eventConfig.findFirst()

  const wods = await prisma.wod.findMany({
    where: { is_active: true },
    orderBy: { display_order: "asc" },
    select: { id: true, name: true, score_type: true },
  })

  // Fetch leaderboard data directly
  let initialData: unknown[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/leaderboard?division=${division}`,
      { cache: "no-store" }
    )
    const json = await res.json()
    initialData = json.data ?? []
  } catch {
    // Will start empty and populate on first auto-refresh
  }

  return (
    <LeaderboardTV
      initialData={initialData as never[]}
      initialWods={wods}
      division={division}
      eventName={config?.name ?? "CrossFit Open 2026"}
    />
  )
}

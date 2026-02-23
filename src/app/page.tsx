import prisma from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { InfoSection } from "@/components/landing/info-section"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [config, athleteCount, wods] = await Promise.all([
    prisma.eventConfig.findFirst(),
    prisma.athlete.count(),
    prisma.wod.findMany({
      where: { is_active: true },
      orderBy: { display_order: "asc" },
      select: { name: true, day_number: true, description: true, score_type: true },
    }),
  ])

  const divisions = (config?.divisions as string[]) ?? []

  return (
    <>
      <Header registrationOpen={config?.registration_open ?? false} />
      <main>
        <HeroSection
          eventName={config?.name ?? "CrossFit Open 2026"}
          description={config?.description ?? null}
          startDate={config?.start_date ?? null}
          endDate={config?.end_date ?? null}
          athleteCount={athleteCount}
          registrationOpen={config?.registration_open ?? false}
          primaryColor={config?.primary_color ?? "#DC2626"}
        />
        <InfoSection wods={wods} divisions={divisions} />
      </main>
      <Footer />
    </>
  )
}

import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AthleteCounter } from "./athlete-counter"

interface HeroSectionProps {
  eventName: string
  description: string | null
  startDate: Date | null
  endDate: Date | null
  athleteCount: number
  registrationOpen: boolean
  primaryColor: string
}

export function HeroSection({
  eventName,
  description,
  startDate,
  endDate,
  athleteCount,
  registrationOpen,
}: HeroSectionProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-MX", { day: "numeric", month: "long" })

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-black px-4 py-20 text-center text-white">
      {/* Background image OPEN 2026 */}
      <Image
        src="/open2026.png"
        alt="Open 2026"
        fill
        className="object-cover opacity-30"
        priority
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-8">
        {/* Brand name */}
        <span className="font-display text-4xl tracking-wider text-primary sm:text-6xl md:text-7xl lg:text-8xl">
          GRIZZLYS
        </span>

        <div className="flex items-center gap-3">
          <div className="h-[2px] w-8 bg-primary" />
          <span className="font-display text-lg tracking-[0.2em] text-gray-400">
            Competencia Interna
          </span>
          <div className="h-[2px] w-8 bg-primary" />
        </div>

        <h1 className="font-display text-xl leading-tight tracking-wider sm:text-3xl md:text-4xl lg:text-5xl">
          {eventName}
        </h1>

        {description && (
          <p className="max-w-xl text-lg text-gray-400">{description}</p>
        )}

        {startDate && endDate && (
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-6 py-3">
            <p className="font-display text-lg tracking-wider text-gray-300">
              {formatDate(startDate)} — {formatDate(endDate)}, {endDate.getFullYear()}
            </p>
          </div>
        )}

        <AthleteCounter targetCount={athleteCount} />

        <div className="flex flex-col gap-3 sm:flex-row">
          {registrationOpen && (
            <Button
              size="lg"
              className="animate-pulse bg-primary px-8 font-display text-xl uppercase tracking-wider text-black shadow-[0_0_20px_rgba(255,102,0,0.5)] transition-all hover:scale-105 hover:animate-none hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(255,102,0,0.7)]"
              asChild
            >
              <Link href="/registro">
                Inscribirme
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-black"
            asChild
          >
            <Link href="/leaderboard">Ver Leaderboard</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Prisma } from "@prisma/client"
import { getDivisionLabel, getDivisionBadge } from "@/lib/divisions"
import { analyzeAthlete, getAndreaSpecialMessage, type WodResult } from "@/lib/athlete-insights"
import Link from "next/link"
import type { Metadata } from "next"

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const athlete = await prisma.athlete.findUnique({ where: { id: params.id } })
  if (!athlete) return { title: "Atleta no encontrado" }
  const firstName = athlete.full_name.split(" ")[0]
  return {
    title: `${firstName} — Mi Recap | GRIZZLYS Open 2026`,
    description: `Recap personalizado de ${athlete.full_name} en el CrossFit Open 2026`,
    openGraph: {
      title: `${firstName} — Mi Recap del Open 2026 🔥`,
      description: `Mira el recap de ${athlete.full_name} en el GRIZZLYS CrossFit Open 2026`,
    },
  }
}

export default async function RecapPage({ params }: PageProps) {
  // Only admin/coach/owner can see recaps for now
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as { role?: string } | undefined)?.role
  if (!userRole || !["admin", "owner", "coach"].includes(userRole)) {
    redirect("/leaderboard")
  }

  const athlete = await prisma.athlete.findUnique({
    where: { id: params.id },
    include: {
      scores: {
        where: { status: "confirmed" },
        include: { wod: true },
        orderBy: { wod: { display_order: "asc" } },
      },
    },
  })

  if (!athlete) notFound()

  // Check if athlete has any scores
  if (athlete.scores.length === 0) {
    // Special case: Andrea Fernandez — was judge, not competitor
    if (athlete.full_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "andrea fernandez") {
      return <AndreaSpecialView name={athlete.full_name} id={athlete.id} />
    }
    return <NoScoresView name={athlete.full_name} id={athlete.id} />
  }

  // Get rankings for this athlete using the same logic as leaderboard
  const division = athlete.division
  const isStaff = division === "equipo_grizzlys"
  const divisionFilter = isStaff
    ? Prisma.sql`a.is_staff = true`
    : Prisma.sql`a.division = ${division}`

  const rankingData: Array<{
    athlete_id: string
    wod_id: string
    wod_name: string
    display_order: number
    raw_score: number
    display_score: string
    placement: number
    total_in_div: number
  }> = await prisma.$queryRaw`
    WITH wod_rankings AS (
      SELECT
        s.athlete_id,
        s.wod_id,
        w.name as wod_name,
        w.display_order,
        s.raw_score::float as raw_score,
        s.display_score,
        RANK() OVER (
          PARTITION BY s.wod_id
          ORDER BY
            CASE WHEN w.sort_order = 'asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,
            CASE WHEN w.sort_order = 'asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,
            CASE WHEN w.sort_order = 'asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,
            CASE WHEN w.sort_order = 'desc' THEN s.raw_score END DESC
        )::int as placement,
        COUNT(*) OVER (PARTITION BY s.wod_id)::int as total_in_div
      FROM scores s
      JOIN wods w ON s.wod_id = w.id
      JOIN athletes a ON s.athlete_id = a.id
      WHERE ${divisionFilter}
        AND a.is_active = true
        AND w.is_active = true
        AND s.status = 'confirmed'
    )
    SELECT * FROM wod_rankings WHERE athlete_id = ${athlete.id}
    ORDER BY display_order
  `

  // Get overall rank
  const overallData: Array<{
    athlete_id: string
    total_points: number
    overall_rank: number
    total_athletes: number
  }> = await prisma.$queryRaw`
    WITH wod_rankings AS (
      SELECT
        s.athlete_id,
        s.wod_id,
        RANK() OVER (
          PARTITION BY s.wod_id
          ORDER BY
            CASE WHEN w.sort_order = 'asc' AND s.display_score LIKE '%reps%' THEN 1 ELSE 0 END ASC,
            CASE WHEN w.sort_order = 'asc' AND s.display_score NOT LIKE '%reps%' THEN s.raw_score END ASC,
            CASE WHEN w.sort_order = 'asc' AND s.display_score LIKE '%reps%' THEN s.raw_score END DESC,
            CASE WHEN w.sort_order = 'desc' THEN s.raw_score END DESC
        ) as placement
      FROM scores s
      JOIN wods w ON s.wod_id = w.id
      JOIN athletes a ON s.athlete_id = a.id
      WHERE ${divisionFilter}
        AND a.is_active = true
        AND w.is_active = true
        AND s.status = 'confirmed'
    ),
    athlete_points AS (
      SELECT
        athlete_id,
        SUM(GREATEST(0, 100 - (placement::int - 1) * 3))::int as total_points
      FROM wod_rankings
      GROUP BY athlete_id
    ),
    ranked AS (
      SELECT
        athlete_id,
        total_points,
        RANK() OVER (ORDER BY total_points DESC)::int as overall_rank,
        COUNT(*) OVER ()::int as total_athletes
      FROM athlete_points
    )
    SELECT * FROM ranked WHERE athlete_id = ${athlete.id}
  `

  const overall = overallData[0] || { total_points: 0, overall_rank: 0, total_athletes: 0 }

  // Build WodResult array
  const wodResults: WodResult[] = rankingData.map((r) => ({
    wodName: r.wod_name,
    displayScore: r.display_score,
    rawScore: r.raw_score,
    rank: r.placement,
    totalInDivision: r.total_in_div,
    points: Math.max(0, 100 - (r.placement - 1) * 3),
    isFinished: !r.display_score.includes("reps"),
    displayOrder: r.display_order,
  }))

  // Analyze!
  const insight = analyzeAthlete(
    athlete.full_name,
    division,
    athlete.gender as "M" | "F",
    wodResults,
    overall.overall_rank,
    overall.total_athletes,
  )

  const badge = getDivisionBadge(division)
  const divLabel = getDivisionLabel(division)

  // Check if athlete has personal crew/family bullet (for special card styling)
  const hasPersonalBullet = insight.storyBullets.length > 0 && (
    insight.storyBullets[0].includes("crew de las 6pm") ||
    insight.storyBullets[0].includes("invertiste en tu familia")
  )

  return (
    <main className="min-h-screen bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(234,88,12,0.3), 0 0 60px rgba(234,88,12,0.1); }
          50% { box-shadow: 0 0 40px rgba(234,88,12,0.5), 0 0 80px rgba(234,88,12,0.2); }
        }
        @keyframes spin3d {
          0% { transform: perspective(600px) rotateY(0deg); }
          100% { transform: perspective(600px) rotateY(360deg); }
        }
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(234,88,12,0.3); }
          50% { border-color: rgba(234,88,12,0.8); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fireFlicker {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          25% { transform: scale(1.1) rotate(-3deg); opacity: 0.9; }
          50% { transform: scale(1.2) rotate(2deg); opacity: 1; }
          75% { transform: scale(1.05) rotate(-1deg); opacity: 0.95; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fade-in { animation: fadeInUp 0.8s ease-out both; }
        .animate-fade-in-1 { animation: fadeInUp 0.8s ease-out 0.15s both; }
        .animate-fade-in-2 { animation: fadeInUp 0.8s ease-out 0.3s both; }
        .animate-fade-in-3 { animation: fadeInUp 0.8s ease-out 0.45s both; }
        .animate-fade-in-4 { animation: fadeInUp 0.8s ease-out 0.6s both; }
        .animate-fade-in-5 { animation: fadeInUp 0.8s ease-out 0.75s both; }
        .animate-fade-in-6 { animation: fadeInUp 0.8s ease-out 0.9s both; }
        .animate-glow { animation: glowPulse 3s ease-in-out infinite; }
        .animate-spin3d { animation: spin3d 2s ease-in-out 0.5s both; }
        .animate-float { animation: floatBounce 3s ease-in-out infinite; }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .animate-fire { animation: fireFlicker 1.5s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.3) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        .animate-border-glow { animation: borderGlow 2s ease-in-out infinite; }
        .animate-slide-left { animation: slideInLeft 0.8s ease-out both; }
        .animate-slide-right { animation: slideInRight 0.8s ease-out both; }
        .animate-count-up { animation: countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .text-gradient-fire {
          background: linear-gradient(135deg, #ff6b00, #ff3d00, #ff8c00, #ff4500);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(234,88,12,0.6);
          animation: particleFloat 6s linear infinite;
        }
        @keyframes rocketShake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          10% { transform: translateY(-2px) rotate(-5deg); }
          20% { transform: translateY(1px) rotate(5deg); }
          30% { transform: translateY(-3px) rotate(-3deg); }
          40% { transform: translateY(0px) rotate(4deg); }
          50% { transform: translateY(-1px) rotate(-2deg); }
          60% { transform: translateY(2px) rotate(3deg); }
          70% { transform: translateY(-2px) rotate(-4deg); }
          80% { transform: translateY(1px) rotate(2deg); }
          90% { transform: translateY(-1px) rotate(-1deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.2); }
          60% { transform: scale(1); }
        }
        @keyframes earthSpin {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        @keyframes flexPump {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-10deg); }
          50% { transform: scale(1.3) rotate(0deg); }
          75% { transform: scale(1.2) rotate(10deg); }
        }
        @keyframes chartPop {
          0%, 100% { transform: scale(1); }
          20% { transform: scale(1.15) rotate(5deg); }
          40% { transform: scale(0.95) rotate(-3deg); }
          60% { transform: scale(1.1) rotate(2deg); }
          80% { transform: scale(1); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
          25% { transform: scale(1.2) rotate(15deg); filter: brightness(1.5); }
          50% { transform: scale(0.9) rotate(-10deg); filter: brightness(1.2); }
          75% { transform: scale(1.15) rotate(5deg); filter: brightness(1.4); }
        }
        @keyframes goldenPulse {
          0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 3px rgba(255,215,0,0.3)); }
          50% { transform: scale(1.15); filter: brightness(1.3) drop-shadow(0 0 10px rgba(255,215,0,0.6)); }
        }
        .animate-rocket { animation: rocketShake 2s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        .animate-earth-spin { animation: earthSpin 8s linear infinite; }
        .animate-flex { animation: flexPump 2.5s ease-in-out infinite; }
        .animate-chart { animation: chartPop 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-golden { animation: goldenPulse 2s ease-in-out infinite; }
      `}} />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-6 pt-14 pb-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-orange-950/10 to-black" />
        {/* Floating particles */}
        <div className="particle" style={{ left: '10%', bottom: '0', animationDelay: '0s' }} />
        <div className="particle" style={{ left: '25%', bottom: '0', animationDelay: '1s', width: '6px', height: '6px' }} />
        <div className="particle" style={{ left: '50%', bottom: '0', animationDelay: '2s' }} />
        <div className="particle" style={{ left: '70%', bottom: '0', animationDelay: '0.5s', width: '5px', height: '5px' }} />
        <div className="particle" style={{ left: '85%', bottom: '0', animationDelay: '3s' }} />
        <div className="particle" style={{ left: '40%', bottom: '0', animationDelay: '4s', width: '3px', height: '3px' }} />
        <div className="relative z-10">
          <div className="animate-spin3d mx-auto w-fit">
            <img
              src="/logo-200.png"
              alt="GRIZZLYS"
              className="mx-auto h-24 w-24 rounded-xl border-2 border-orange-600/60 shadow-[0_0_40px_rgba(234,88,12,0.4)]"
            />
          </div>
          <p className="mt-5 text-xs font-bold tracking-[0.5em] text-orange-400 animate-fade-in">
            TU RECAP
          </p>
          <h1
            className="mt-1 text-6xl font-black tracking-wider text-gradient-fire animate-scale-in"
            style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif', animationDelay: '0.3s' }}
          >
            OPEN 2026
          </h1>
          <div className="mt-2 mx-auto h-1 w-32 rounded-full animate-shimmer" />
          <p className="mt-5 text-3xl font-bold text-white animate-fade-in-1 animate-float">
            {athlete.full_name}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3 animate-fade-in-2">
            <span
              className="rounded-md px-3 py-1 text-xs font-bold tracking-wider text-white animate-border-glow border-2"
              style={{ backgroundColor: badge.bgColor }}
            >
              {badge.text}
            </span>
            <span className="text-sm text-neutral-500">
              #{String(athlete.participant_number).padStart(3, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* ===== ORANGE GRADIENT BAR ===== */}
      <div className="flex h-2 animate-shimmer rounded-full mx-4 overflow-hidden">
        <div className="flex-1 bg-gradient-to-r from-orange-700 to-orange-500" />
        <div className="flex-1 bg-gradient-to-r from-orange-500 to-red-500" />
        <div className="flex-1 bg-gradient-to-r from-red-500 to-orange-700" />
      </div>

      {/* ===== YOUR STORY ===== */}
      <section className="px-5 pt-8 pb-4 animate-fade-in-2">
        <div className="rounded-xl border-2 border-orange-600/50 bg-neutral-950 p-6 animate-glow">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-3xl animate-fire">🔥</span>
            <h2 className="text-xs font-bold tracking-[0.25em] text-orange-500">
              TU HISTORIA
            </h2>
          </div>
          <p className="mb-5 text-2xl font-bold leading-tight text-white">
            {insight.greeting}
          </p>
          <div className="space-y-4">
            {insight.storyBullets.map((bullet, i) => {
              // First bullet gets special treatment if it's a personal/crew bullet
              if (i === 0 && hasPersonalBullet) {
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-yellow-600/30 bg-gradient-to-br from-yellow-950/20 to-neutral-950 p-4 -mx-1"
                  >
                    <p className="text-[10px] font-bold tracking-[0.2em] text-yellow-500/70 mb-2">
                      <span className="inline-block animate-golden">💛</span> PARA TI
                    </p>
                    <p
                      className="text-sm leading-relaxed text-neutral-200"
                      dangerouslySetInnerHTML={{ __html: bullet }}
                    />
                  </div>
                )
              }
              return (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-neutral-300"
                  dangerouslySetInnerHTML={{ __html: `• ${bullet}` }}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== DATO MUNDIAL ===== */}
      <section className="px-5 pb-4 animate-fade-in-3">
        <div className="rounded-lg border border-neutral-700 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900 px-5 py-5 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 mb-3">
            <span className="inline-block animate-earth-spin">🌎</span> DATO MUNDIAL
          </p>
          <p className="text-sm leading-relaxed text-neutral-300 font-medium">
            {insight.globalFact}
          </p>
        </div>
      </section>

      {/* ===== TUS NUMEROS — WOD Cards ===== */}
      <section className="px-5 pt-4 pb-4 animate-fade-in-3">
        <h2 className="mb-4 text-xs font-bold tracking-[0.25em] text-neutral-400">
          <span className="inline-block animate-chart">📊</span> TUS NÚMEROS
        </h2>
        <div className="space-y-3">
          {wodResults.map((wod) => {
            const wodInsight = insight.wodInsights.find(
              (w) => w.wodName === wod.wodName
            )
            return (
              <WodCard
                key={wod.wodName}
                wod={wod}
                phrase={wodInsight?.phrase || ""}
              />
            )
          })}
          {/* Missing WODs */}
          {[1, 2, 3]
            .filter((order) => !wodResults.some((w) => w.displayOrder === order))
            .map((order) => (
              <div
                key={order}
                className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 text-center"
              >
                <p className="text-xs font-bold tracking-wider text-neutral-600">
                  OPEN 26.{order}
                </p>
                <p className="mt-2 text-sm text-neutral-600">Pendiente</p>
              </div>
            ))}
        </div>
      </section>

      {/* ===== VOLUMEN TOTAL ===== */}
      <section className="px-5 pt-4 pb-4 animate-fade-in-4">
        <div className="rounded-xl border border-neutral-700 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6">
          <h2 className="mb-5 text-xs font-bold tracking-[0.25em] text-neutral-400">
            <span className="inline-block animate-flex">💪</span> TU VOLUMEN TOTAL
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatBox
              value={insight.totalReps.toLocaleString()}
              label="REPETICIONES TOTALES"
              accent
            />
            {insight.totalWeightKg > 0 && (
              <StatBox
                value={`${Math.round(insight.totalWeightKg).toLocaleString()} kg`}
                label="PESO LEVANTADO (26.3)"
              />
            )}
            {insight.totalLungeMeters > 0 && (
              <StatBox
                value={`${insight.totalLungeMeters}m`}
                label="ZANCADAS (26.2)"
              />
            )}
            {insight.totalMovements.wallBalls > 0 && (
              <StatBox
                value={insight.totalMovements.wallBalls.toString()}
                label="WALL-BALLS (26.1)"
              />
            )}
            {insight.totalMovements.burpees > 0 && (
              <StatBox
                value={insight.totalMovements.burpees.toString()}
                label="BURPEES (26.3)"
              />
            )}
            {(insight.totalMovements.pullVariation1 +
              insight.totalMovements.pullVariation2 +
              insight.totalMovements.pullVariation3) > 0 && (
              <StatBox
                value={(
                  insight.totalMovements.pullVariation1 +
                  insight.totalMovements.pullVariation2 +
                  insight.totalMovements.pullVariation3
                ).toString()}
                label="JALONES (26.2)"
              />
            )}
          </div>
        </div>
      </section>

      {/* ===== POSICION FINAL ===== */}
      {overall.overall_rank > 0 && (
        <section className="px-5 pt-4 pb-4 animate-fade-in-5">
          <div className="rounded-xl border-2 animate-border-glow bg-neutral-950 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-950/10 via-transparent to-orange-950/10" />
            <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.3em] text-orange-500 mb-2">
              <span className="inline-block animate-rocket">🏆</span> POSICIÓN FINAL
            </p>
            <p
              className="text-8xl font-black text-gradient-fire animate-count-up"
              style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif', animationDelay: '0.3s' }}
            >
              {overall.overall_rank <= 3 && (
                <span className="mr-2 inline-block animate-float">
                  {overall.overall_rank === 1
                    ? "🥇"
                    : overall.overall_rank === 2
                    ? "🥈"
                    : "🥉"}
                </span>
              )}
              #{overall.overall_rank}
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              de {overall.total_athletes} atletas en{" "}
              <span className="text-neutral-300">{divLabel}</span>
            </p>
            <div className="mt-4 inline-block rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-3">
              <p
                className="text-3xl font-bold text-white"
                style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif' }}
              >
                {overall.total_points}
              </p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-500">
                PUNTOS TOTALES
              </p>
            </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== TU MEJOR MOMENTO ===== */}
      {insight.bestWod && (
        <section className="px-5 pt-4 pb-4 animate-fade-in-5">
          <div className="rounded-xl border-2 border-yellow-600/40 bg-gradient-to-br from-yellow-950/20 to-neutral-950 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/5 via-transparent to-yellow-900/5" />
            <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.25em] text-yellow-500 mb-3">
              <span className="inline-block animate-spin3d" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>⭐</span> TU MEJOR MOMENTO
            </p>
            <p className="text-lg font-bold text-white leading-relaxed">
              {insight.bestWodMessage}
            </p>
            <p
              className="mt-3 text-5xl font-black text-gradient-fire animate-count-up"
              style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif' }}
            >
              {insight.bestWod.displayScore}
            </p>
            </div>
          </div>
        </section>
      )}

      {/* ===== MENSAJE FINAL ===== */}
      <section className="px-5 pt-8 pb-8 animate-fade-in-6">
        <div className="rounded-xl bg-gradient-to-br from-orange-950/20 via-neutral-950 to-orange-950/10 p-8 text-center border border-orange-900/20">
          <div className="mx-auto mb-5 h-px w-20 bg-gradient-to-r from-transparent via-orange-600/60 to-transparent" />
          <p className="text-lg leading-relaxed text-neutral-200 italic px-2 font-medium">
            &ldquo;{insight.closingMessage}&rdquo;
          </p>
          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-orange-600/60 to-transparent" />
        </div>
      </section>

      {/* ===== CTAs ===== */}
      <section className="px-5 pb-8 flex flex-col items-center gap-3">
        <Link
          href="/leaderboard"
          className="inline-block rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-xs font-bold tracking-[0.2em] text-white hover:from-orange-500 hover:to-red-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105"
        >
          <span className="inline-block animate-rocket mr-2">🚀</span> VER LEADERBOARD COMPLETO
        </Link>
        <Link
          href={`/atleta/${athlete.id}`}
          className="text-xs font-bold tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← VOLVER A MI PERFIL
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-neutral-900 px-5 py-8 text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-600">
          GRIZZLYS — ENTRENAMIENTO FUNCIONAL — MÉRIDA
        </p>
        <div className="mt-2 flex justify-center gap-4 text-[10px] text-orange-600/60">
          <a href="https://instagram.com/grizzlysmerida">IG @grizzlysmerida</a>
          <span className="text-neutral-800">|</span>
          <a href="https://facebook.com/GrizzlysMerida">FB GrizzlysMerida</a>
        </div>
      </footer>
    </main>
  )
}

// ==================== COMPONENTS ====================

function WodCard({ wod, phrase }: { wod: WodResult; phrase: string }) {
  const points = wod.points
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 hover:border-orange-600/40 hover:shadow-[0_0_25px_rgba(234,88,12,0.15)] transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/5 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold tracking-[0.2em] text-orange-500">
          {wod.wodName.toUpperCase()}
        </span>
        <span className="text-xs text-neutral-500">{points} pts</span>
      </div>

      {/* Score + Rank */}
      <div className="flex items-end justify-between mb-3">
        <p
          className="text-5xl font-black text-gradient-fire"
          style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif' }}
        >
          {wod.displayScore}
        </p>
        <div className="text-right">
          <p className="text-xl font-bold text-neutral-300">
            {wod.rank <= 3 && (
              <span className="mr-1 inline-block animate-float">
                {wod.rank === 1 ? "🥇" : wod.rank === 2 ? "🥈" : "🥉"}
              </span>
            )}
            #{wod.rank}
          </p>
          <p className="text-[10px] text-neutral-500">de {wod.totalInDivision}</p>
        </div>
      </div>

      {/* Visceral phrase */}
      {phrase && (
        <p className="text-xs leading-relaxed text-neutral-400 italic border-t border-neutral-800 pt-3 mt-1">
          {phrase}
        </p>
      )}
      </div>
    </div>
  )
}

function StatBox({
  value,
  label,
  accent,
}: {
  value: string
  label: string
  accent?: boolean
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 text-center hover:border-orange-600/30 transition-all duration-300 hover:scale-105">
      <p
        className={`text-3xl font-black ${accent ? "text-gradient-fire" : "text-white"}`}
        style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif' }}
      >
        {value}
      </p>
      <p className="mt-1 text-[9px] font-bold tracking-[0.15em] text-neutral-500">
        {label}
      </p>
    </div>
  )
}

function NoScoresView({ name, id }: { name: string; id: string }) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <img
          src="/logo-200.png"
          alt="GRIZZLYS"
          className="mx-auto h-20 w-20 rounded-xl border border-neutral-700 mb-6"
        />
        <h1 className="text-xl font-bold mb-3">{name}</h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          Tu recap estará disponible cuando se confirmen tus resultados del Open.
          ¡Sigue dando todo! 💪
        </p>
        <Link
          href={`/atleta/${id}`}
          className="text-orange-500 text-sm font-bold hover:text-orange-400"
        >
          ← Volver a mi perfil
        </Link>
      </div>
    </main>
  )
}

function AndreaSpecialView({ name, id }: { name: string; id: string }) {
  const msg = getAndreaSpecialMessage()
  return (
    <main className="min-h-screen bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.8s ease-out both; }
        .animate-fade-in-2 { animation: fadeInUp 0.8s ease-out 0.2s both; }
        .animate-fade-in-3 { animation: fadeInUp 0.8s ease-out 0.4s both; }
      `}} />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-14 pb-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-orange-950/10 to-black" />
        <div className="relative z-10 animate-fade-in">
          <img
            src="/logo-200.png"
            alt="GRIZZLYS"
            className="mx-auto h-20 w-20 rounded-xl border-2 border-orange-600/60 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          />
          <p className="mt-5 text-xs font-bold tracking-[0.4em] text-orange-400">TU RECAP</p>
          <h1
            className="mt-1 text-5xl font-black tracking-wider text-white"
            style={{ fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif' }}
          >
            OPEN 2026
          </h1>
          <p className="mt-5 text-3xl font-bold text-white">{name}</p>
        </div>
      </section>

      <div className="flex h-1.5">
        <div className="flex-1 bg-gradient-to-r from-orange-700 to-orange-500" />
        <div className="flex-1 bg-gradient-to-r from-orange-500 to-red-500" />
        <div className="flex-1 bg-gradient-to-r from-red-500 to-orange-700" />
      </div>

      {/* Message */}
      <section className="px-5 pt-8 pb-4 animate-fade-in-2">
        <div className="rounded-xl border-2 border-orange-600/50 bg-neutral-950 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xs font-bold tracking-[0.25em] text-orange-500">TU HISTORIA</h2>
          </div>
          <p className="mb-5 text-2xl font-bold leading-tight text-white">{msg.greeting}</p>
          <p className="text-sm leading-relaxed text-neutral-300">{msg.message}</p>
        </div>
      </section>

      {/* Closing */}
      <section className="px-5 pt-6 pb-8 animate-fade-in-3">
        <div className="rounded-xl bg-gradient-to-br from-orange-950/20 via-neutral-950 to-orange-950/10 p-8 text-center border border-orange-900/20">
          <div className="mx-auto mb-5 h-px w-20 bg-gradient-to-r from-transparent via-orange-600/60 to-transparent" />
          <p className="text-lg leading-relaxed text-neutral-200 italic px-2 font-medium">
            &ldquo;{msg.closing}&rdquo;
          </p>
          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-orange-600/60 to-transparent" />
        </div>
      </section>

      {/* CTAs */}
      <section className="px-5 pb-8 flex flex-col items-center gap-3">
        <Link
          href="/leaderboard"
          className="inline-block rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-xs font-bold tracking-[0.2em] text-white hover:from-orange-500 hover:to-red-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105"
        >
          <span className="inline-block animate-rocket mr-2">🚀</span> VER LEADERBOARD COMPLETO
        </Link>
        <Link
          href={`/atleta/${id}`}
          className="text-xs font-bold tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← VOLVER A MI PERFIL
        </Link>
      </section>

      <footer className="border-t border-neutral-900 px-5 py-8 text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-600">
          GRIZZLYS — ENTRENAMIENTO FUNCIONAL — MÉRIDA
        </p>
      </footer>
    </main>
  )
}

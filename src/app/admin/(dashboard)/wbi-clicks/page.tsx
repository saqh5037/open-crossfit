export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"

export default async function WbiClicksPage() {
  const [totalClicks, clicksByAthlete, recentClicks] = await Promise.all([
    prisma.wbiBadgeClick.count(),
    prisma.$queryRaw<
      Array<{
        athlete_id: string
        athlete_name: string
        clicks: number
        last_click: Date
      }>
    >`
      SELECT
        w.athlete_id,
        a.full_name as athlete_name,
        COUNT(*)::int as clicks,
        MAX(w.created_at) as last_click
      FROM wbi_badge_clicks w
      JOIN athletes a ON w.athlete_id = a.id
      WHERE w.athlete_id IS NOT NULL
      GROUP BY w.athlete_id, a.full_name
      ORDER BY clicks DESC
      LIMIT 50
    `,
    prisma.wbiBadgeClick.findMany({
      orderBy: { created_at: "desc" },
      take: 20,
      include: { athlete: { select: { full_name: true } } },
    }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">WBI Badge — Clicks</h1>

      {/* Total */}
      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 inline-block">
        <p className="text-4xl font-black text-[#00AAFF]">{totalClicks}</p>
        <p className="text-xs text-neutral-500 mt-1 tracking-wider">CLICKS TOTALES</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por atleta */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <h2 className="text-sm font-bold text-neutral-400 tracking-wider mb-4">
            CLICKS POR RECAP DE ATLETA
          </h2>
          {clicksByAthlete.length === 0 ? (
            <p className="text-neutral-600 text-sm">Sin clicks aún</p>
          ) : (
            <div className="space-y-2">
              {clicksByAthlete.map((row) => (
                <div
                  key={row.athlete_id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-800/50"
                >
                  <span className="text-sm text-neutral-200">{row.athlete_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#00AAFF]">{row.clicks}</span>
                    <span className="text-[10px] text-neutral-600">
                      {new Date(row.last_click).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recientes */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <h2 className="text-sm font-bold text-neutral-400 tracking-wider mb-4">
            ÚLTIMOS 20 CLICKS
          </h2>
          {recentClicks.length === 0 ? (
            <p className="text-neutral-600 text-sm">Sin clicks aún</p>
          ) : (
            <div className="space-y-2">
              {recentClicks.map((click) => (
                <div
                  key={click.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-800/50"
                >
                  <div>
                    <span className="text-sm text-neutral-200">
                      {click.athlete?.full_name || "Anónimo"}
                    </span>
                    <span className="text-[10px] text-neutral-600 ml-2">
                      {click.source_page}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    {new Date(click.created_at).toLocaleString("es-MX", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import { sendEmail } from "@/lib/email"
import { CertificateEmail } from "@/emails/certificate"
import { generateCertificatePDF } from "@/lib/certificate-pdf"
import { getDivisionLabel, getAllDivisionKeys } from "@/lib/divisions"

export async function POST(request: NextRequest) {
  const auth = await requireRole(["owner", "admin"])
  if (auth instanceof NextResponse) return auth

  try {
    const { division } = await request.json()
    const config = await prisma.eventConfig.findFirst()
    const eventName = config?.name || "GRIZZLYS Open 2026"

    const divisionsToProcess = division ? [division] : getAllDivisionKeys()
    const results: { email: string; name: string; success: boolean; error?: string }[] = []

    for (const div of divisionsToProcess) {
      // Fetch leaderboard for this division using the same raw query
      const leaderboard: Array<{
        id: string
        full_name: string
        total_points: number
        overall_rank: number
      }> = await prisma.$queryRaw`
        WITH wod_rankings AS (
          SELECT
            s.athlete_id,
            s.wod_id,
            RANK() OVER (
              PARTITION BY s.wod_id
              ORDER BY
                CASE WHEN w.sort_order = 'asc' THEN s.raw_score END ASC,
                CASE WHEN w.sort_order = 'desc' THEN s.raw_score END DESC
            ) as placement
          FROM scores s
          JOIN wods w ON s.wod_id = w.id
          JOIN athletes a ON s.athlete_id = a.id
          WHERE a.division = ${div}
            AND w.is_active = true
            AND s.status = 'confirmed'
        ),
        total_points AS (
          SELECT
            athlete_id,
            SUM(placement)::int as total_points
          FROM wod_rankings
          GROUP BY athlete_id
        )
        SELECT
          a.id,
          a.full_name,
          COALESCE(tp.total_points, 0)::int as total_points,
          RANK() OVER (ORDER BY COALESCE(tp.total_points, 999999) ASC)::int as overall_rank
        FROM athletes a
        LEFT JOIN total_points tp ON a.id = tp.athlete_id
        WHERE a.division = ${div}
          AND tp.total_points IS NOT NULL
        ORDER BY COALESCE(tp.total_points, 999999) ASC
      `

      if (leaderboard.length === 0) continue

      for (const entry of leaderboard) {
        const athlete = await prisma.athlete.findUnique({ where: { id: entry.id } })
        if (!athlete?.email) continue

        try {
          const pdfBuffer = await generateCertificatePDF({
            athleteName: athlete.full_name,
            position: Number(entry.overall_rank),
            division: getDivisionLabel(div),
            totalPoints: Number(entry.total_points),
            eventName,
            eventDate: config?.end_date?.toLocaleDateString("es-MX") || new Date().toLocaleDateString("es-MX"),
          })

          const result = await sendEmail({
            to: athlete.email,
            subject: `Certificado de Participación — ${eventName}`,
            react: CertificateEmail({
              athleteName: athlete.full_name,
              eventName,
              position: Number(entry.overall_rank),
              division: getDivisionLabel(div),
              totalPoints: Number(entry.total_points),
              appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
            }),
            attachments: [
              {
                filename: `Certificado-${athlete.full_name.replace(/\s+/g, "_")}.pdf`,
                content: pdfBuffer,
              },
            ],
          })

          results.push({
            email: athlete.email,
            name: athlete.full_name,
            success: result.success,
            error: result.success ? undefined : String(result.error),
          })
        } catch (err) {
          results.push({
            email: athlete.email,
            name: athlete.full_name,
            success: false,
            error: err instanceof Error ? err.message : "Error desconocido",
          })
        }

        // Rate limit: 500ms between sends
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    return NextResponse.json({
      total: results.length,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success),
      results,
    })
  } catch (error) {
    console.error("Certificate sending error:", error)
    return NextResponse.json(
      { error: "Error al enviar certificados" },
      { status: 500 }
    )
  }
}

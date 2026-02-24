import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["owner", "admin"])
  if (auth instanceof NextResponse) return auth

  const audits = await prisma.scoreAudit.findMany({
    where: { score_id: params.id },
    orderBy: { performed_at: "desc" },
  })

  // Enrich with performer names
  const performerIds = Array.from(
    new Set(audits.map((a) => a.performed_by).filter(Boolean))
  )
  const performers =
    performerIds.length > 0
      ? await prisma.adminUser.findMany({
          where: { id: { in: performerIds } },
          select: { id: true, email: true, role: true },
        })
      : []
  const performerMap = Object.fromEntries(performers.map((p) => [p.id, p]))

  const enriched = audits.map((a) => ({
    ...a,
    performer: performerMap[a.performed_by] || { email: "desconocido", role: "unknown" },
  }))

  return NextResponse.json({ data: enriched })
}

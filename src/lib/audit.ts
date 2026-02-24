import prisma from "@/lib/prisma"
import type { ScoreAction } from "@prisma/client"
import type { Prisma } from "@prisma/client"

interface AuditLogParams {
  scoreId: string
  action: ScoreAction
  oldValues?: Record<string, unknown> | null
  newValues?: Record<string, unknown> | null
  performedBy: string
}

export async function logScoreAudit({
  scoreId,
  action,
  oldValues,
  newValues,
  performedBy,
}: AuditLogParams) {
  return prisma.scoreAudit.create({
    data: {
      score_id: scoreId,
      action,
      old_values: (oldValues ?? undefined) as Prisma.InputJsonValue | undefined,
      new_values: (newValues ?? undefined) as Prisma.InputJsonValue | undefined,
      performed_by: performedBy,
    },
  })
}

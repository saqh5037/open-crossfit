export type { EventConfig, Athlete, Wod, Score, AdminUser, ScoreAudit } from "@prisma/client"
export type { Gender, ScoreType, SortOrder, AdminRole, ScoreStatus, ScoreAction } from "@prisma/client"

export interface LeaderboardWodResult {
  wod_id: string
  wod_name: string
  display_score: string | null
  placement: number | null
}

export interface LeaderboardEntry {
  id: string
  full_name: string
  division: string
  total_points: number
  overall_rank: number
  wod_results: LeaderboardWodResult[]
}

export interface DivisionInfo {
  key: string
  label: string
  gender: "M" | "F" | "NB"
}

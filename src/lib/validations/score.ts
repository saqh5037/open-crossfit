import { z } from "zod"

export const scoreSchema = z.object({
  athlete_id: z.string().min(1, "Atleta requerido"),
  wod_id: z.string().min(1, "WOD requerido"),
  raw_score: z.number().positive("El score debe ser positivo"),
  display_score: z.string().min(1, "Score requerido"),
  is_rx: z.boolean().default(true),
  overwrite: z.boolean().optional(),
  evidence_url: z.string().optional(),
  judge_notes: z.string().optional(),
})

export type ScoreFormData = z.infer<typeof scoreSchema>

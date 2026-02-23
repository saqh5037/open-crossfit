import { z } from "zod"

export const wodSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  day_number: z.coerce.number().int().positive("Debe ser un día válido"),
  description: z.string().optional().or(z.literal("")),
  score_type: z.enum(["time", "reps", "weight"], {
    message: "Selecciona el tipo de score",
  }),
  time_cap_seconds: z.coerce.number().int().positive().optional(),
})

export type WodFormData = z.infer<typeof wodSchema>

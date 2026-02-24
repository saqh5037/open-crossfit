import { z } from "zod"

export const athleteSchema = z
  .object({
    full_name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre es demasiado largo"),
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Ingresa un email válido"),
    phone: z
      .string()
      .min(8, "El teléfono debe tener al menos 8 dígitos")
      .max(15, "El teléfono es demasiado largo"),
    birth_date: z.string().min(1, "La fecha de nacimiento es obligatoria"),
    gender: z.enum(["M", "F"], {
      message: "Selecciona tu género",
    }),
    division: z.string().min(1, "Selecciona tu división"),
    photo_url: z.string().optional(),
    wants_to_judge: z.boolean().optional().default(false),
    judge_password: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.wants_to_judge ||
      (data.judge_password && data.judge_password.length >= 8),
    {
      message: "La contraseña debe tener al menos 8 caracteres",
      path: ["judge_password"],
    }
  )

export type AthleteFormData = z.input<typeof athleteSchema>

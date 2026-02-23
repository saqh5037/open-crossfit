import { z } from "zod"

export const createAdminUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "coach", "judge"], {
    message: "Rol debe ser admin, coach o judge",
  }),
})

export const updateAdminUserSchema = z.object({
  role: z.enum(["admin", "coach", "judge"]).optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
})

export type CreateAdminUserData = z.infer<typeof createAdminUserSchema>
export type UpdateAdminUserData = z.infer<typeof updateAdminUserSchema>

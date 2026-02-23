import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { AdminRole } from "@/types"

export async function requireRole(allowedRoles: AdminRole[]) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    )
  }

  const role = (session.user as { role?: AdminRole }).role
  const userId = (session.user as { id?: string }).id

  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json(
      { error: "No tienes permiso para realizar esta acción" },
      { status: 403 }
    )
  }

  return { session, userId: userId as string, role }
}

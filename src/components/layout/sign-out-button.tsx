"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

interface SignOutButtonProps {
  variant?: "compact" | "full"
}

export function SignOutButton({ variant = "compact" }: SignOutButtonProps) {
  if (variant === "full") {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </button>
    )
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400"
    >
      <LogOut className="h-3.5 w-3.5" />
      Salir
    </button>
  )
}

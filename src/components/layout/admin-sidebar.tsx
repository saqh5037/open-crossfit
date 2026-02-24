"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  ListChecks,
  Printer,
  BadgeCheck,
  Trophy,
  Settings,
  Shield,
  ShieldCheck,
  Mail,
  Menu,
  X,
} from "lucide-react"
import { SignOutButton } from "./sign-out-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AdminSidebarProps {
  role: string
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "admin", "coach", "judge"] },
  { href: "/admin/scores", label: "Capturar Scores", icon: ClipboardList, roles: ["owner", "admin", "coach", "judge"] },
  { href: "/admin/scores/manage", label: "Ver Scores", icon: ListChecks, roles: ["owner", "admin", "coach"] },
  { href: "/admin/scores/validate", label: "Validar Scores", icon: ShieldCheck, roles: ["owner", "admin", "coach"] },
  { href: "/admin/scores/print", label: "Hojas de Score", icon: Printer, roles: ["owner", "admin", "coach"] },
  { href: "/admin/bibs", label: "Credenciales", icon: BadgeCheck, roles: ["owner", "admin", "coach"] },
  { href: "/admin/athletes", label: "Atletas", icon: Users, roles: ["owner", "admin", "coach"] },
  { href: "/admin/wods", label: "WODs", icon: Dumbbell, roles: ["owner", "admin", "coach"] },
  { href: "/admin/emails", label: "Emails", icon: Mail, roles: ["owner", "admin"] },
  { href: "/admin/settings", label: "Configuración", icon: Settings, roles: ["owner"] },
  { href: "/admin/users", label: "Usuarios Admin", icon: Shield, roles: ["owner"] },
]

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const filteredItems = navItems.filter((item) => item.roles.includes(role))

  const nav = (
    <nav className="flex flex-col gap-1">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-black font-semibold"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}

      <div className="mt-4 border-t border-gray-800 pt-4">
        <Link
          href="/leaderboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <Trophy className="h-4 w-4" />
          Ver Leaderboard
        </Link>
        <SignOutButton variant="full" />
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 p-4 transition-transform md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center gap-2 px-3">
          <Image src="/logo-80.png" alt="GRIZZLYS" width={32} height={32} className="rounded" />
          <span className="font-display text-2xl tracking-wider text-primary">GRIZZLYS</span>
        </div>
        {nav}
      </aside>
    </>
  )
}

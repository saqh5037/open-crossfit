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
  FileText,
} from "lucide-react"
import { SignOutButton } from "./sign-out-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AdminSidebarProps {
  role: string
}

const navItems = [
  { href: "/admin", label: "Dashboard", shortLabel: "Inicio", icon: LayoutDashboard, roles: ["owner", "admin", "coach", "judge"], quickNav: true },
  { href: "/admin/scores", label: "Capturar Scores", shortLabel: "Capturar", icon: ClipboardList, roles: ["owner", "admin", "coach", "judge"], quickNav: true },
  { href: "/admin/scores/manage", label: "Ver Scores", shortLabel: "Scores", icon: ListChecks, roles: ["owner", "admin", "coach"], quickNav: false },
  { href: "/admin/scores/validate", label: "Validar Scores", shortLabel: "Validar", icon: ShieldCheck, roles: ["owner", "admin", "coach"], quickNav: true },
  { href: "/admin/scores/print", label: "Hojas de Score", shortLabel: "Imprimir", icon: Printer, roles: ["owner", "admin", "coach"], quickNav: false },
  { href: "/admin/scores/scorecard", label: "Scorecards 26.1", shortLabel: "Scorecard", icon: FileText, roles: ["owner", "admin", "coach"], quickNav: false },
  { href: "/admin/bibs", label: "Credenciales", shortLabel: "Credenciales", icon: BadgeCheck, roles: ["owner", "admin", "coach"], quickNav: false },
  { href: "/admin/athletes", label: "Atletas", shortLabel: "Atletas", icon: Users, roles: ["owner", "admin", "coach"], quickNav: true },
  { href: "/admin/wods", label: "WODs", shortLabel: "WODs", icon: Dumbbell, roles: ["owner", "admin", "coach"], quickNav: false },
  { href: "/admin/emails", label: "Emails", shortLabel: "Emails", icon: Mail, roles: ["owner", "admin"], quickNav: false },
  { href: "/admin/settings", label: "Configuración", shortLabel: "Config", icon: Settings, roles: ["owner"], quickNav: false },
  { href: "/admin/users", label: "Usuarios Admin", shortLabel: "Usuarios", icon: Shield, roles: ["owner"], quickNav: false },
]

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const filteredItems = navItems.filter((item) => item.roles.includes(role))
  const quickNavItems = filteredItems.filter((item) => item.quickNav)

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
      {/* Mobile toggle - more visible */}
      <Button
        variant="outline"
        size="sm"
        className="fixed left-3 top-3 z-50 gap-2 border-gray-700 bg-gray-900 text-white md:hidden print:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menú
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 p-4 transition-transform md:relative md:translate-x-0 print:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link href="/" onClick={() => setOpen(false)} className="mb-6 flex items-center gap-2 px-3">
          <Image src="/logo-80.png" alt="GRIZZLYS" width={32} height={32} className="rounded" />
          <span className="font-display text-2xl tracking-wider text-primary">GRIZZLYS</span>
        </Link>
        {nav}
      </aside>

      {/* Bottom nav - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-800 bg-gray-950 md:hidden print:hidden">
        {quickNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px]",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.shortLabel}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

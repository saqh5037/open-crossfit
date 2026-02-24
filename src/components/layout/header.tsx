import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings, ClipboardList, Award } from "lucide-react"

interface HeaderProps {
  registrationOpen?: boolean
  userRole?: string | null
}

export function Header({ registrationOpen = false, userRole }: HeaderProps) {
  const isJudge = userRole && ["judge", "coach", "admin", "owner"].includes(userRole)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-80.png" alt="GRIZZLYS" width={44} height={44} className="rounded" />
          <span className="font-display text-xl tracking-wider text-primary sm:text-2xl md:text-3xl">GRIZZLYS</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="px-2 text-xs text-gray-300 hover:text-white sm:px-3 sm:text-sm" asChild>
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 px-2 text-xs text-gray-300 hover:text-white sm:px-3 sm:text-sm" asChild>
            <Link href="/certificado">
              <Award className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Certificado</span>
            </Link>
          </Button>
          {isJudge && (
            <Button variant="ghost" size="sm" className="gap-1 px-2 text-xs text-gray-300 hover:text-white sm:px-3 sm:text-sm" asChild>
              <Link href="/judge">
                <ClipboardList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Panel Juez</span>
                <span className="sm:hidden">Juez</span>
              </Link>
            </Button>
          )}
          {registrationOpen && (
            <Button size="sm" className="bg-primary px-3 font-display text-xs uppercase tracking-wider text-black hover:bg-orange-500 sm:px-4 sm:text-sm" asChild>
              <Link href="/registro">Inscribirme</Link>
            </Button>
          )}
          {!isJudge && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white" asChild>
              <Link href="/admin">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { SignOutButton } from "@/components/layout/sign-out-button"

export default async function JudgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect("/admin/login")

  const role = (session.user as { role?: string }).role
  if (role === "owner" || role === "admin") redirect("/admin")

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0a0a0a] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-80.png" alt="GRIZZLYS" width={28} height={28} className="rounded" />
            <span className="font-display text-xl tracking-wider text-primary">
              GRIZZLYS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="px-4 py-6 text-white">{children}</main>
    </div>
  )
}

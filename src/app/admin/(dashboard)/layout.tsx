export const dynamic = "force-dynamic"

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) redirect("/admin/login")

  const adminUser = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
  })

  if (!adminUser) redirect("/admin/login")

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar role={adminUser.role} />
      <main className="flex-1 px-3 pb-20 pt-14 text-white sm:px-4 sm:pt-16 md:p-6 md:pb-6">{children}</main>
    </div>
  )
}

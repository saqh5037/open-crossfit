export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RegistrationForm } from "@/components/registration/registration-form"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RegistroPage() {
  const config = await prisma.eventConfig.findFirst()
  const divisions = (config?.divisions as string[]) ?? []

  return (
    <>
      <Header registrationOpen={config?.registration_open ?? false} />
      <main className="min-h-screen bg-black px-4 py-12">
        <div className="container mx-auto max-w-lg">
          {config?.registration_open ? (
            <RegistrationForm availableDivisions={divisions} />
          ) : (
            <Card className="mx-auto max-w-md border-gray-700">
              <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
                <XCircle className="h-16 w-16 text-gray-400" />
                <h2 className="text-2xl font-bold">Registro Cerrado</h2>
                <p className="text-gray-400">
                  El registro para este evento ya no está disponible.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/">Volver al inicio</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

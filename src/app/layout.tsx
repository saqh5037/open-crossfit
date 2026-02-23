import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" })
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "GRIZZLYS — CrossFit Open 2026",
  description: "Competencia interna de CrossFit. Registro, scores y leaderboard en tiempo real.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bebasNeue.variable} ${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

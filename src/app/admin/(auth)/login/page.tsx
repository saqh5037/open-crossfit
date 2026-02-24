"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, XCircle } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales inválidas")
        setLoading(false)
        return
      }

      // If callbackUrl exists, go there (e.g. /atleta/{id} after QR scan)
      if (callbackUrl) {
        router.push(callbackUrl)
        router.refresh()
        return
      }

      // Otherwise redirect based on role
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()
      const role = sessionData?.user?.role

      if (role === "judge") {
        router.push("/judge")
      } else {
        router.push("/admin")
      }
      router.refresh()
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm border-2 border-gray-800 bg-[#111]">
      <CardHeader className="text-center">
        <Image src="/logo-200.png" alt="GRIZZLYS" width={100} height={100} className="mx-auto mb-2 rounded-lg" />
        <span className="mx-auto font-display text-4xl tracking-wider text-primary">GRIZZLYS</span>
        <CardTitle className="font-display text-xl tracking-wider text-gray-300">Panel de Administración</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email" className="font-display text-sm tracking-wider text-gray-400">EMAIL</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tubox.com"
              className="border-2 border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-primary"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="font-display text-sm tracking-wider text-gray-400">CONTRASEÑA</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="border-2 border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-primary"
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
              <XCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary font-display text-base uppercase tracking-wider text-black hover:bg-orange-500"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { athleteSchema, type AthleteFormData } from "@/lib/validations/athlete"
import { getDivisionsByGender } from "@/lib/divisions"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, User, Camera, X, AlertCircle, Download, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import confetti from "canvas-confetti"

interface RegistrationFormProps {
  availableDivisions: string[]
}

export function RegistrationForm({ availableDivisions }: RegistrationFormProps) {
  const [success, setSuccess] = useState<{
    id: string
    name: string
    number: number
    isJudge: boolean
  } | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [qrUrl, setQrUrl] = useState("")
  const photoInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      wants_to_judge: false,
    },
  })

  const selectedGender = watch("gender")
  const wantsToJudge = watch("wants_to_judge")

  const filteredDivisions = selectedGender
    ? getDivisionsByGender(selectedGender).filter((d) =>
        availableDivisions.includes(d.key)
      )
    : []

  // Build QR URL + trigger confetti on success
  useEffect(() => {
    if (!success) return

    // Fire confetti burst
    const duration = 2500
    const end = Date.now() + duration
    const colors = ["#FF6600", "#FFB800", "#FFFFFF", "#FF3D00"]

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()

    // Big center burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors,
    })

    // Show details after a delay
    const timer = setTimeout(() => setShowDetails(true), 1200)

    // Fetch QR base URL
    fetch("/api/event-config")
      .then((r) => r.json())
      .then((json) => {
        const base = json.data?.qr_base_url || window.location.origin + "/atleta/"
        const cleanBase = base.endsWith("/") ? base : base + "/"
        setQrUrl(`${cleanBase}${success.id}`)
      })

    return () => clearTimeout(timer)
  }, [success])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setServerError("La foto excede 5MB")
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const clearPhoto = () => {
    setPhotoFile(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  const downloadQR = (name: string) => {
    const svg = document.querySelector("#qr-success svg") as SVGElement
    if (!svg) return
    const canvas = document.createElement("canvas")
    canvas.width = 500
    canvas.height = 500
    const ctx = canvas.getContext("2d")!
    const data = new XMLSerializer().serializeToString(svg)
    const img = new window.Image()
    img.onload = () => {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, 500, 500)
      ctx.drawImage(img, 50, 50, 400, 400)
      const link = document.createElement("a")
      link.download = `QR-${name.replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(data)))
  }

  const onSubmit = async (data: AthleteFormData) => {
    setServerError(null)
    try {
      // Upload photo if present
      let photo_url: string | undefined
      if (photoFile) {
        const formData = new FormData()
        formData.append("file", photoFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) {
          setServerError(uploadJson.error || "Error al subir foto")
          return
        }
        photo_url = uploadJson.url
      }

      const res = await fetch("/api/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, photo_url }),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error || "Error al registrar")
        return
      }

      setSuccess({
        id: json.data.id,
        name: json.data.full_name,
        number: json.participantNumber,
        isJudge: json.isJudge ?? false,
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setServerError("Error de conexión. Intenta de nuevo.")
    }
  }

  // ============ SUCCESS SCREEN ============
  if (success) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        {/* Hero: Participant number reveal */}
        <div className="flex w-full flex-col items-center gap-3 animate-in fade-in zoom-in-50 duration-700">
          <CheckCircle className="h-12 w-12 text-green-500 animate-in fade-in zoom-in duration-500" />
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            ¡Bienvenido al Open!
          </h2>
          <p className="text-gray-400">{success.name}</p>

          {/* Big participant number */}
          <div className="mt-2 flex flex-col items-center gap-1 rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/20 to-primary/5 px-10 py-6 animate-in fade-in zoom-in-75 duration-1000 delay-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
              Tu número de participante
            </span>
            <span className="font-display text-6xl font-black text-primary sm:text-7xl">
              #{String(success.number).padStart(3, "0")}
            </span>
          </div>
        </div>

        {/* Details: fade in after confetti */}
        <div
          className={`flex w-full flex-col items-center gap-4 transition-all duration-700 ${
            showDetails
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          {/* QR Code */}
          {qrUrl && (
            <div className="flex flex-col items-center gap-3">
              <div id="qr-success" className="rounded-xl bg-white p-3">
                <QRCodeSVG value={qrUrl} size={160} level="M" />
              </div>
              <p className="text-xs text-gray-500">
                Escanea para ver tu perfil y scores
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => downloadQR(success.name)}
              >
                <Download className="h-4 w-4" />
                Guardar QR en galería
              </Button>
            </div>
          )}

          {success.isJudge && (
            <div className="w-full rounded-lg border border-blue-800 bg-blue-950 px-4 py-3 text-sm text-blue-300">
              <Shield className="mb-1 inline h-4 w-4" /> También eres juez. Usa
              tu email y contraseña para entrar al panel.
            </div>
          )}

          <div className="flex w-full flex-col gap-2">
            <Button asChild>
              <Link href={`/atleta/${success.id}`}>Ver mi perfil</Link>
            </Button>
            {success.isJudge && (
              <Button asChild variant="secondary">
                <Link href="/admin/login">Entrar como Juez</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/leaderboard">Ver Leaderboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ============ REGISTRATION FORM ============
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <User className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          Registro de Atleta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Gender selection - dropdown */}
          <div>
            <Label>Género *</Label>
            <Select
              onValueChange={(val) => {
                setValue("gender", val as "M" | "F", { shouldValidate: true })
                setValue("division", "")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Full name */}
          <div>
            <Label htmlFor="full_name">Nombre completo *</Label>
            <Input
              id="full_name"
              placeholder="Ej: Carlos Mendoza"
              className={errors.full_name ? "border-red-500" : ""}
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Division */}
          <div>
            <Label>División *</Label>
            {!selectedGender ? (
              <p className="mt-1 text-sm text-gray-500">
                Selecciona tu género primero
              </p>
            ) : (
              <Select
                onValueChange={(val) => setValue("division", val, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona división" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDivisions.map((d) => (
                    <SelectItem key={d.key} value={d.key}>
                      {d.label} ({d.description})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.division && (
              <p className="mt-1 text-sm text-red-500">{errors.division.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="999 123 4567"
              className={errors.phone ? "border-red-500" : ""}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Birth date */}
          <div>
            <Label htmlFor="birth_date">Fecha de nacimiento *</Label>
            <Input
              id="birth_date"
              type="date"
              className={errors.birth_date ? "border-red-500" : ""}
              {...register("birth_date")}
            />
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-500">{errors.birth_date.message}</p>
            )}
          </div>

          {/* Photo (optional) */}
          <div>
            <Label>Foto de perfil (opcional)</Label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {!photoPreview ? (
              <div className="mt-1 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-900">
                  <Image src="/logo-80.png" alt="Default" width={40} height={40} className="rounded-full opacity-50" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gray-700"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Tomar o subir foto
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Foto de perfil"
                    className="h-16 w-16 rounded-full border-2 border-primary object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute -right-1 -top-1 rounded-full bg-black p-0.5"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
                <span className="text-sm text-gray-400">Foto seleccionada</span>
              </div>
            )}
          </div>

          {/* Judge toggle */}
          <div className="rounded-lg border border-gray-800 bg-[#0a0a0a] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-600 accent-primary"
                {...register("wants_to_judge")}
              />
              <div>
                <span className="font-semibold text-white">¿Quieres ser juez?</span>
                <p className="mt-0.5 text-xs text-gray-500">
                  Podrás calificar WODs de otros atletas desde tu celular
                </p>
              </div>
            </label>

            {wantsToJudge && (
              <div className="mt-3">
                <Label htmlFor="judge_password">Contraseña de juez *</Label>
                <Input
                  id="judge_password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className={errors.judge_password ? "border-red-500" : ""}
                  {...register("judge_password")}
                />
                {errors.judge_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.judge_password.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Usarás tu email + esta contraseña para entrar al panel de juez
                </p>
              </div>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Inscribirme"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useRef, useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getDivisionBadge, getDivisionLabel } from "@/lib/divisions"
import { Download } from "lucide-react"

export interface CredentialAthlete {
  id: string
  participant_number: number
  full_name: string
  division: string
  birth_date: string | null
  photo_url: string | null
}

interface AthleteCredentialDialogProps {
  athlete: CredentialAthlete | null
  onClose: () => void
}

export function AthleteCredentialDialog({ athlete, onClose }: AthleteCredentialDialogProps) {
  const credentialRef = useRef<HTMLDivElement>(null)
  const [qrBaseUrl, setQrBaseUrl] = useState("")

  useEffect(() => {
    fetch("/api/event-config")
      .then((r) => r.json())
      .then((json) => {
        const base = json.data?.qr_base_url || window.location.origin + "/atleta/"
        setQrBaseUrl(base.endsWith("/") ? base : base + "/")
      })
  }, [])

  const getAge = (birthDate: string | null) => {
    if (!birthDate) return null
    return Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const downloadCredential = async () => {
    if (!credentialRef.current || !athlete) return
    const { default: html2canvas } = await import("html2canvas")
    const canvas = await html2canvas(credentialRef.current, {
      backgroundColor: "#000000",
      scale: 2,
      useCORS: true,
    })
    const link = document.createElement("a")
    link.download = `credencial-${athlete.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  if (!athlete) return null

  const paddedNumber = String(athlete.participant_number).padStart(3, "0")
  const divBadge = getDivisionBadge(athlete.division)
  const divLabel = getDivisionLabel(athlete.division)
  const age = getAge(athlete.birth_date)
  const qrUrl = qrBaseUrl + athlete.id

  return (
    <Dialog open={!!athlete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm border-gray-800 bg-black p-0 sm:max-w-md">
        {/* Credential card */}
        <div ref={credentialRef} className="flex flex-col items-center bg-black px-6 pb-6 pt-8">
          {/* Logo + Event */}
          <div className="mb-1 flex items-center gap-2">
            <img src="/logo-80.png" alt="" className="h-8 w-8 rounded" />
            <span className="font-display text-2xl tracking-wider text-white">GRIZZLYS</span>
          </div>
          <p className="mb-4 text-[10px] uppercase tracking-widest text-gray-500">
            OPEN 2026
          </p>

          {/* Number */}
          <div className="font-display text-7xl tracking-wider text-primary">
            #{paddedNumber}
          </div>

          {/* Photo */}
          <div className="my-4 h-28 w-28 overflow-hidden rounded-full border-4 border-primary">
            {athlete.photo_url ? (
              <img
                src={athlete.photo_url}
                alt={athlete.full_name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900">
                <img src="/logo-80.png" alt="" className="h-16 w-16 opacity-30" />
              </div>
            )}
          </div>

          {/* Name */}
          <p className="text-center font-display text-3xl uppercase tracking-wider text-white">
            {athlete.full_name}
          </p>

          {/* Division badge */}
          <div className="mt-2 flex items-center gap-2">
            {divBadge.bgColor ? (
              <span
                className="rounded-md px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: divBadge.bgColor }}
              >
                {divLabel}
              </span>
            ) : (
              <span className="rounded-md border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300">
                {divLabel}
              </span>
            )}
            {age && (
              <span className="text-xs text-gray-500">{age} años</span>
            )}
          </div>

          {/* QR Code */}
          {qrUrl && (
            <div className="mt-5 rounded-xl bg-white p-3">
              <QRCodeSVG value={qrUrl} size={140} level="H" />
            </div>
          )}
          <p className="mt-2 text-[10px] text-gray-600">
            Escanea para ver el perfil
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-gray-800 px-6 py-4">
          <Button
            className="flex-1 gap-2"
            onClick={downloadCredential}
          >
            <Download className="h-4 w-4" />
            Descargar imagen
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open(`/atleta/${athlete.id}`, "_blank")}
          >
            Ver perfil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

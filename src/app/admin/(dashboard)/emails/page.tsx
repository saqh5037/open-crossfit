"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const DIVISIONS = [
  { key: "rx_male", label: "RX Masculino" },
  { key: "rx_female", label: "RX Femenino" },
  { key: "foundation_male", label: "Foundation Masculino" },
  { key: "foundation_female", label: "Foundation Femenino" },
]

interface SendResult {
  email: string
  name: string
  success: boolean
  error?: string
}

export default function EmailsPage() {
  const [selectedDivision, setSelectedDivision] = useState("")
  const [athleteCount, setAthleteCount] = useState<Record<string, number>>({})
  const [sending, setSending] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [results, setResults] = useState<{
    total: number
    sent: number
    failed: SendResult[]
    results: SendResult[]
  } | null>(null)

  // Fetch athlete counts per division
  useEffect(() => {
    fetch("/api/athletes")
      .then((r) => r.json())
      .then((json) => {
        const counts: Record<string, number> = {}
        for (const a of json.data ?? []) {
          counts[a.division] = (counts[a.division] || 0) + 1
        }
        setAthleteCount(counts)
      })
  }, [])

  const targetCount = selectedDivision
    ? athleteCount[selectedDivision] || 0
    : Object.values(athleteCount).reduce((a, b) => a + b, 0)

  const handleSend = async () => {
    setConfirmDialog(false)
    setSending(true)
    setResults(null)

    try {
      const res = await fetch("/api/emails/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          division: selectedDivision || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setResults({ total: 0, sent: 0, failed: [], results: [] })
        alert(json.error || "Error al enviar")
      } else {
        setResults(json)
      }
    } catch {
      alert("Error de conexión")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Mail className="h-6 w-6 text-primary" />
          Enviar Certificados
        </h1>
        <p className="text-sm text-gray-400">
          Envía certificados de participación con PDF adjunto a los atletas.
        </p>
      </div>

      {/* Division selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar División</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las divisiones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las divisiones</SelectItem>
              {DIVISIONS.map((d) => (
                <SelectItem key={d.key} value={d.key}>
                  {d.label} ({athleteCount[d.key] || 0} atletas)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3">
            <Send className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              Se enviarán <strong className="text-white">{targetCount}</strong>{" "}
              certificados
            </span>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-yellow-800 bg-yellow-950 px-4 py-3 text-sm text-yellow-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Resend tiene un límite de 100 emails/día en el plan gratuito.
              Solo se incluyen atletas con scores confirmados.
            </span>
          </div>

          <Button
            size="lg"
            disabled={sending || targetCount === 0}
            onClick={() => setConfirmDialog(true)}
            className="gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando certificados...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Certificados
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultados del Envío</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Badge className="gap-1 bg-green-950 text-green-400">
                <CheckCircle className="h-3 w-3" />
                {results.sent} enviados
              </Badge>
              {results.failed.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {results.failed.length} fallidos
                </Badge>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-800">
              {results.results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-800 px-3 py-2 last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="ml-2 text-xs text-gray-500">{r.email}</span>
                  </div>
                  {r.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-xs text-red-400">{r.error}</span>
                  )}
                </div>
              ))}
              {results.results.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-gray-500">
                  No se encontraron atletas con scores confirmados en esta división.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar envío de certificados</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400">
            Se enviarán certificados en PDF a <strong>{targetCount}</strong>{" "}
            atletas{selectedDivision ? ` de la división ${DIVISIONS.find((d) => d.key === selectedDivision)?.label}` : ""}.
            Este proceso puede tardar varios minutos.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

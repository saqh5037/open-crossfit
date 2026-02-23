"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

interface EventConfig {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  primary_color: string
  secondary_color: string
  registration_open: boolean
  qr_base_url: string
}

export default function SettingsPage() {
  const [config, setConfig] = useState<EventConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/event-config")
      .then((r) => r.json())
      .then((json) => setConfig(json.data))
  }, [])

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    setSuccess(false)

    await fetch("/api/event-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: config.name,
        description: config.description,
        start_date: config.start_date,
        end_date: config.end_date,
        primary_color: config.primary_color,
        secondary_color: config.secondary_color,
        registration_open: config.registration_open,
        qr_base_url: config.qr_base_url,
      }),
    })

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!config) return <div className="py-12 text-center text-gray-400">Cargando...</div>

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Configuración del Evento</h1>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label>Nombre del Evento</Label>
              <Input
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <textarea
                className="w-full rounded-lg border-2 border-gray-700 bg-black px-3 py-2 text-sm text-white"
                rows={3}
                value={config.description ?? ""}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={config.start_date?.split("T")[0] ?? ""}
                  onChange={(e) => setConfig({ ...config, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={config.end_date?.split("T")[0] ?? ""}
                  onChange={(e) => setConfig({ ...config, end_date: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Color Primario</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.primary_color}
                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                    className="h-10 w-10 shrink-0 cursor-pointer rounded border sm:w-14"
                  />
                  <Input
                    value={config.primary_color}
                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Color Secundario</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.secondary_color}
                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                    className="h-10 w-10 shrink-0 cursor-pointer rounded border sm:w-14"
                  />
                  <Input
                    value={config.secondary_color}
                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Registro de Atletas</p>
                <p className="text-sm text-gray-400">
                  {config.registration_open
                    ? "Los atletas pueden inscribirse"
                    : "El registro está cerrado"}
                </p>
              </div>
              <button
                onClick={() => setConfig({ ...config, registration_open: !config.registration_open })}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  config.registration_open ? "bg-green-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    config.registration_open ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credenciales / QR</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label>URL Base para QR</Label>
              <Input
                placeholder="https://miservidor.com/atleta/"
                value={config.qr_base_url ?? ""}
                onChange={(e) => setConfig({ ...config, qr_base_url: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">
                El QR codificará esta URL + el ID del atleta. Dejar vacío para usar la URL actual del sitio.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Guardar Cambios
        </Button>
        {success && (
          <p className="text-center text-sm text-green-500">Cambios guardados correctamente</p>
        )}
      </div>
    </div>
  )
}

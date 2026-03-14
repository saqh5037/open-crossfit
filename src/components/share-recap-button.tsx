"use client"

import { useState } from "react"

interface ShareRecapButtonProps {
  athleteId: string
  athleteName: string
}

const VARIANTS = [
  { id: 1, label: "Ranking", desc: "Tu posición gigante" },
  { id: 2, label: "Historia", desc: "Tu mensaje personal" },
  { id: 3, label: "Desglose", desc: "WOD por WOD" },
  { id: 4, label: "Sello", desc: "Certificado oficial" },
]

export default function ShareRecapButton({ athleteId, athleteName }: ShareRecapButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<number | null>(null)
  const [previews, setPreviews] = useState<Record<number, string>>({})

  const firstName = athleteName.split(" ")[0]

  function getUrl(v: number) {
    return `/api/recap/share-image?id=${athleteId}&v=${v}`
  }

  // Load thumbnails when panel opens
  function handleOpen() {
    setOpen(true)
    // Preload previews
    for (const v of VARIANTS) {
      if (!previews[v.id]) {
        const img = new Image()
        img.src = getUrl(v.id)
        img.onload = () => setPreviews((p) => ({ ...p, [v.id]: getUrl(v.id) }))
      }
    }
  }

  async function handleShare(variant: number) {
    setLoading(variant)
    try {
      const res = await fetch(getUrl(variant))
      if (!res.ok) throw new Error("img")
      const blob = await res.blob()
      const file = new File([blob], `recap-${firstName.toLowerCase()}-grizzlys-${variant}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") console.error(err)
    } finally {
      setLoading(null)
    }
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-7 py-4 text-sm font-bold tracking-wide text-white transition-all active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Compartir mi Recap
      </button>
    )
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold tracking-widest text-neutral-400">ELIGE TU ESTILO</p>
        <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-white transition-colors text-xs tracking-wider">
          CERRAR
        </button>
      </div>
      {/* Variant grid 2x2 */}
      <div className="grid grid-cols-2 gap-2.5">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => handleShare(v.id)}
            disabled={loading !== null}
            className="group relative rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden transition-all active:scale-95 hover:border-orange-600/50 disabled:opacity-50"
          >
            {/* Preview thumbnail */}
            <div className="aspect-[4/5] w-full bg-neutral-950 relative overflow-hidden">
              {previews[v.id] ? (
                <img
                  src={previews[v.id]}
                  alt={v.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-orange-600/40 border-t-orange-500 rounded-full animate-spin" />
                </div>
              )}
              {/* Loading overlay */}
              {loading === v.id && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            {/* Label */}
            <div className="px-3 py-2.5">
              <p className="text-xs font-bold text-white">{v.label}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{v.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

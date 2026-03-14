"use client"

import { useState, useRef } from "react"

interface ShareRecapButtonProps {
  athleteId: string
  athleteName: string
}

const VARIANTS = [
  { id: 1, label: "Mi Posición", color: "#ff6600" },
  { id: 2, label: "Mi Historia", color: "#fbbf24" },
  { id: 3, label: "Mis WODs", color: "#16a34a" },
  { id: 4, label: "Mi Badge", color: "#ff4400" },
]

export default function ShareRecapButton({ athleteId, athleteName }: ShareRecapButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<number | null>(null)
  const [previews, setPreviews] = useState<Record<number, string>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const firstName = athleteName.split(" ")[0]

  function getUrl(v: number) {
    return `/api/recap/share-image?id=${athleteId}&v=${v}`
  }

  function handleOpen() {
    setOpen(true)
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
        className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] px-7 py-4 text-sm font-semibold tracking-wide text-white/90 transition-all active:scale-[0.97]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Compartir mi Recap
      </button>
    )
  }

  return (
    <div className="w-full -mx-5">
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-3">
        <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-500">ELIGE TU ESTILO</p>
        <button onClick={() => setOpen(false)} className="text-neutral-600 hover:text-white transition-colors text-[10px] tracking-[0.2em] font-bold">
          CERRAR
        </button>
      </div>

      {/* Horizontal carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => handleShare(v.id)}
            disabled={loading !== null}
            className="flex-shrink-0 w-[200px] snap-center rounded-2xl overflow-hidden transition-all active:scale-[0.96] disabled:opacity-40"
            style={{ border: `1px solid ${v.color}25` }}
          >
            {/* Preview */}
            <div className="aspect-[4/5] w-full bg-neutral-950 relative">
              {previews[v.id] ? (
                <img src={previews[v.id]} alt={v.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full animate-spin" style={{ border: `2px solid ${v.color}30`, borderTopColor: v.color }} />
                </div>
              )}
              {loading === v.id && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-[10px] text-white/60 tracking-wider font-bold">ENVIANDO...</span>
                </div>
              )}
            </div>
            {/* Label */}
            <div className="px-3 py-3 bg-neutral-900/80">
              <p className="text-xs font-bold text-white">{v.label}</p>
            </div>
          </button>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        div::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  )
}

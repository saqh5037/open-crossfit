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
  const [showImages, setShowImages] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [previews, setPreviews] = useState<Record<number, string>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const firstName = athleteName.split(" ")[0]
  const recapUrl = typeof window !== "undefined"
    ? `${window.location.origin}/atleta/${athleteId}/recap`
    : `/atleta/${athleteId}/recap`

  function getImgUrl(v: number) {
    return `/api/recap/share-image?id=${athleteId}&v=${v}`
  }

  // ---- Share the recap LINK ----
  async function handleShareLink() {
    setLoading("link")
    try {
      const shareData = {
        title: `${firstName} — Mi Recap | GRIZZLYS Open 2026`,
        text: `Mira el recap de ${firstName} en el GRIZZLYS CrossFit Open 2026 🔥`,
        url: recapUrl,
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy link
        await navigator.clipboard.writeText(recapUrl)
        alert("Link copiado al portapapeles")
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") console.error(err)
    } finally {
      setLoading(null)
    }
  }

  // ---- Open images carousel ----
  function handleOpenImages() {
    setShowImages(true)
    for (const v of VARIANTS) {
      if (!previews[v.id]) {
        const img = new Image()
        img.src = getImgUrl(v.id)
        img.onload = () => setPreviews((p) => ({ ...p, [v.id]: getImgUrl(v.id) }))
      }
    }
  }

  // ---- Download image ----
  async function handleDownload(variant: number) {
    setLoading(`dl-${variant}`)
    try {
      const res = await fetch(getImgUrl(variant))
      if (!res.ok) throw new Error("img")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `recap-${firstName.toLowerCase()}-grizzlys-${variant}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  // ---- Share image via native share ----
  async function handleShareImage(variant: number) {
    setLoading(`share-${variant}`)
    try {
      const res = await fetch(getImgUrl(variant))
      if (!res.ok) throw new Error("img")
      const blob = await res.blob()
      const file = new File([blob], `recap-${firstName.toLowerCase()}-grizzlys-${variant}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${firstName} — GRIZZLYS Open 2026`,
        })
      } else {
        // Fallback: just download
        handleDownload(variant)
        return
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* === BUTTON 1: Share recap link === */}
      <button
        onClick={handleShareLink}
        disabled={loading === "link"}
        className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] px-7 py-4 text-sm font-semibold tracking-wide text-white/90 transition-all active:scale-[0.97] disabled:opacity-50"
      >
        {loading === "link" ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        )}
        Compartir mi Recap
      </button>

      {/* === BUTTON 2: Images for social media === */}
      {!showImages ? (
        <button
          onClick={handleOpenImages}
          className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/25 px-7 py-4 text-sm font-semibold tracking-wide text-orange-300 transition-all active:scale-[0.97] hover:from-orange-600/30 hover:to-red-600/30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Imágenes para Redes
        </button>
      ) : (
        <div className="w-full -mx-5">
          {/* Header */}
          <div className="flex items-center justify-between px-5 mb-3">
            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-500">ELIGE TU ESTILO</p>
            <button onClick={() => setShowImages(false)} className="text-neutral-600 hover:text-white transition-colors text-[10px] tracking-[0.2em] font-bold">
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
              <div
                key={v.id}
                className="flex-shrink-0 w-[200px] snap-center rounded-2xl overflow-hidden"
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
                  {(loading === `dl-${v.id}` || loading === `share-${v.id}`) && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-[10px] text-white/60 tracking-wider font-bold">
                        {loading === `dl-${v.id}` ? "DESCARGANDO..." : "COMPARTIENDO..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Label + action buttons */}
                <div className="px-3 py-2.5 bg-neutral-900/80">
                  <p className="text-xs font-bold text-white mb-2">{v.label}</p>
                  <div className="flex gap-2">
                    {/* Download button */}
                    <button
                      onClick={() => handleDownload(v.id)}
                      disabled={loading !== null}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/[0.08] border border-white/[0.1] py-2 text-[10px] font-bold tracking-wider text-white/70 transition-all active:scale-95 disabled:opacity-40 hover:bg-white/[0.12]"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Guardar
                    </button>
                    {/* Share button */}
                    <button
                      onClick={() => handleShareImage(v.id)}
                      disabled={loading !== null}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[10px] font-bold tracking-wider transition-all active:scale-95 disabled:opacity-40"
                      style={{
                        backgroundColor: `${v.color}20`,
                        borderColor: `${v.color}40`,
                        color: v.color,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            div::-webkit-scrollbar { display: none; }
          `}} />
        </div>
      )}
    </div>
  )
}

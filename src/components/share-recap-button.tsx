"use client"

import { useState } from "react"

interface ShareRecapButtonProps {
  athleteId: string
  athleteName: string
}

export default function ShareRecapButton({ athleteId, athleteName }: ShareRecapButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const firstName = athleteName.split(" ")[0]
  const shareText = `${firstName} en el GRIZZLYS Open 2026 💪🔥`
  const imageUrl = `/api/recap/share-image?id=${athleteId}`

  async function getImageBlob(): Promise<Blob | null> {
    try {
      const res = await fetch(imageUrl)
      if (!res.ok) return null
      return await res.blob()
    } catch {
      return null
    }
  }

  async function handleNativeShare() {
    setLoading(true)
    setShowMenu(false)
    try {
      const blob = await getImageBlob()
      if (!blob) { alert("Error generando imagen"); return }

      const file = new File([blob], `recap-${firstName.toLowerCase()}-grizzlys.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${firstName} — GRIZZLYS Open 2026`,
          text: shareText,
          files: [file],
        })
      } else {
        // Fallback: download
        downloadBlob(blob)
      }
    } catch (err) {
      // User cancelled share — that's ok
      if ((err as Error)?.name !== "AbortError") {
        console.error("Share error:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    setLoading(true)
    setShowMenu(false)
    try {
      const blob = await getImageBlob()
      if (!blob) { alert("Error generando imagen"); return }
      downloadBlob(blob)
    } catch {
      alert("Error descargando imagen")
    } finally {
      setLoading(false)
    }
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `recap-${firstName.toLowerCase()}-grizzlys.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleCopyLink() {
    setShowMenu(false)
    const url = `${window.location.origin}/atleta/${athleteId}/recap`
    await navigator.clipboard?.writeText(url)
    alert("Link copiado ✓")
  }

  return (
    <div className="relative inline-block">
      {/* Main share button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 text-xs font-bold tracking-[0.15em] text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
            </svg>
            GENERANDO...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            COMPARTIR MI RECAP
          </>
        )}
      </button>

      {/* Dropdown menu */}
      {showMenu && !loading && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-64 rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl overflow-hidden animate-fade-in">
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors text-left"
            >
              <span className="text-lg">📲</span>
              <div>
                <div className="font-semibold">Compartir imagen</div>
                <div className="text-[10px] text-neutral-400">Instagram, WhatsApp, más...</div>
              </div>
            </button>
            <div className="h-px bg-neutral-800" />
            <button
              onClick={handleDownload}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors text-left"
            >
              <span className="text-lg">💾</span>
              <div>
                <div className="font-semibold">Descargar imagen</div>
                <div className="text-[10px] text-neutral-400">Guardar en tu dispositivo</div>
              </div>
            </button>
            <div className="h-px bg-neutral-800" />
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-white hover:bg-neutral-800 transition-colors text-left"
            >
              <span className="text-lg">🔗</span>
              <div>
                <div className="font-semibold">Copiar link</div>
                <div className="text-[10px] text-neutral-400">Comparte el enlace directo</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

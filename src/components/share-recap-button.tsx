"use client"

import { useState } from "react"

interface ShareRecapButtonProps {
  athleteId: string
  athleteName: string
}

export default function ShareRecapButton({ athleteId, athleteName }: ShareRecapButtonProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const firstName = athleteName.split(" ")[0]

  async function handleShare() {
    setLoading(true)
    setDone(false)
    try {
      const res = await fetch(`/api/recap/share-image?id=${athleteId}`)
      if (!res.ok) throw new Error("img")
      const blob = await res.blob()
      const file = new File([blob], `recap-${firstName.toLowerCase()}-grizzlys-open2026.png`, { type: "image/png" })

      // Try native share first (iOS/Android)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
        })
      } else {
        // Desktop fallback: download
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
      }
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Share error:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-7 py-4 text-sm font-bold tracking-wide text-white transition-all active:scale-95 disabled:opacity-60"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-80" />
          </svg>
          Generando imagen...
        </>
      ) : done ? (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Listo
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Compartir mi Recap
        </>
      )}
    </button>
  )
}

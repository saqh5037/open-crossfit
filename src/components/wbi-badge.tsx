"use client"

interface WbiBadgeProps {
  athleteId?: string
  sourcePage?: string
}

export default function WbiBadge({ athleteId, sourcePage = "recap" }: WbiBadgeProps) {
  const handleClick = () => {
    // Fire and forget — track the click
    fetch("/api/wbi-clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athlete_id: athleteId, source_page: sourcePage }),
    }).catch(() => {})

    // Open WBI landing in new tab
    window.open("/about-wbi", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="group flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#1E2A45] bg-[#0D1220]/80 hover:border-[#00AAFF]/40 hover:shadow-[0_0_20px_rgba(0,170,255,0.12)] transition-all duration-300 cursor-pointer mx-auto"
    >
      {/* WBI Logo Mark */}
      <span className="flex gap-[2px] items-end">
        <span className="w-[4px] h-[14px] rounded-[1px] bg-[#1565C0]" />
        <span className="w-[4px] h-[10px] rounded-[1px] bg-[#22C55E]" />
        <span className="w-[4px] h-[14px] rounded-[1px] bg-[#F97316]" />
      </span>
      <span className="text-[11px] text-[#6B7A99] tracking-wide">
        Desarrollado con <span className="text-red-400">&#9829;</span> por{" "}
        <span className="font-bold text-[#00AAFF] group-hover:text-[#33BBFF] transition-colors">
          WBI México
        </span>
      </span>
    </button>
  )
}

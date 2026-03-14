"use client"

interface WbiBadgeProps {
  athleteId?: string
  sourcePage?: string
}

export default function WbiBadge({ athleteId, sourcePage = "recap" }: WbiBadgeProps) {
  const handleClick = () => {
    fetch("/api/wbi-clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athlete_id: athleteId, source_page: sourcePage }),
    }).catch(() => {})

    window.open("/about-wbi", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="group flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg border border-[#1E2A45] bg-[#0D1220]/80 hover:border-[#00AAFF]/40 hover:shadow-[0_0_20px_rgba(0,170,255,0.12)] transition-all duration-300 cursor-pointer mx-auto"
    >
      {/* WBI W Logo Mark — real SVG */}
      <svg width="22" height="18" viewBox="0 0 900 700" className="opacity-90 group-hover:opacity-100 transition-opacity">
        <defs>
          <linearGradient id="wb0" x1="922" y1="48" x2="729" y2="592" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F58634"/><stop offset="1" stopColor="#BC5000"/>
          </linearGradient>
          <linearGradient id="wb1" x1="582" y1="192" x2="783" y2="619" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBCE26"/><stop offset="1" stopColor="#F58634"/>
          </linearGradient>
          <linearGradient id="wb2" x1="577" y1="191" x2="419" y2="718" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0C7347"/><stop offset="1" stopColor="#17D986"/>
          </linearGradient>
          <linearGradient id="wb3" x1="148" y1="126" x2="456" y2="718" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0098DA"/><stop offset="1" stopColor="#0C7347"/>
          </linearGradient>
        </defs>
        <path d="M1063 96L820 148L783 76L1026 24L1063 96Z" fill="#C05507"/>
        <path d="M877 605H663L783 76L1026 24L877 605Z" fill="url(#wb0)"/>
        <path d="M878 605H641L470 209L692 162L878 605Z" fill="url(#wb1)"/>
        <path d="M561 718H349L451 213L692 162L561 718Z" fill="url(#wb2)"/>
        <path d="M561 718H331L54 129L287 84L561 718Z" fill="url(#wb3)"/>
        <path d="M250 156L17 201L54 129L287 84L250 156Z" fill="#47B6E6"/>
      </svg>
      <span className="text-[11px] text-[#6B7A99] tracking-wide">
        Desarrollado con <span className="text-red-400">&#9829;</span> por{" "}
        <span className="font-bold text-[#00AAFF] group-hover:text-[#33BBFF] transition-colors">
          WBI México
        </span>
      </span>
    </button>
  )
}

"use client"

import { useEffect } from "react"

export default function ScrollAnimator() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    document.querySelectorAll(".wbi-page .fade-up").forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}

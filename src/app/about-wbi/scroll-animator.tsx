"use client"

import { useEffect } from "react"

export default function ScrollAnimator() {
  useEffect(() => {
    // Intersection Observer for fade-up animations
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

    document.querySelectorAll(".W .fu").forEach((el) => observer.observe(el))

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement
      const href = target.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const el = document.querySelector(href)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        // Close mobile menu if open
        const mobMenu = document.querySelector(".mob-menu")
        if (mobMenu) mobMenu.classList.remove("open")
      }
    }

    const anchors = document.querySelectorAll('.W a[href^="#"]')
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick))

    // Hamburger menu toggle
    const hamBtn = document.querySelector(".nav-ham")
    const handleHam = () => {
      let mobMenu = document.querySelector(".mob-menu")
      if (!mobMenu) {
        // Create mobile menu dynamically
        mobMenu = document.createElement("div")
        mobMenu.className = "mob-menu"
        mobMenu.innerHTML = `
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
          <a href="#nosotros">Nosotros</a>
          <a href="mailto:squiroz@wbinnova.com">Contáctanos</a>
        `
        document.querySelector(".W")?.appendChild(mobMenu)
        // Attach smooth scroll to new anchors
        mobMenu.querySelectorAll('a[href^="#"]').forEach((a) =>
          a.addEventListener("click", handleAnchorClick)
        )
      }
      mobMenu.classList.toggle("open")
    }

    if (hamBtn) hamBtn.addEventListener("click", handleHam)

    return () => {
      observer.disconnect()
      anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick))
      if (hamBtn) hamBtn.removeEventListener("click", handleHam)
    }
  }, [])

  return null
}

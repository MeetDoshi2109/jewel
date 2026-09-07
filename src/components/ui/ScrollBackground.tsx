'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Gradually tints the page background as the user scrolls:
// ivory → soft blush → deeper charcoal accents
export default function ScrollBackground() {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const sections = document.querySelectorAll<HTMLElement>('[data-bg]')

    sections.forEach(section => {
      const bg = section.dataset.bg
      if (!bg) return

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          gsap.to('body', {
            backgroundColor: bg,
            duration: 0.9,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        },
        onLeaveBack: () => {
          const prev = section.previousElementSibling as HTMLElement | null
          const prevBg = prev?.dataset?.bg || '#FAF6F0'
          gsap.to('body', {
            backgroundColor: prevBg,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger instanceof Element &&
            (t.vars.trigger as HTMLElement).dataset?.bg) {
          t.kill()
        }
      })
      gsap.to('body', { backgroundColor: '#FAF6F0', duration: 0 })
    }
  }, [])

  return <div ref={indicatorRef} aria-hidden="true" />
}

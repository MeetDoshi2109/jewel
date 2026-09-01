'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  opacityDir: number
  color: string
  glint: number
}

const COLORS = ['rgba(201, 160, 91, ', 'rgba(183, 110, 121, ', 'rgba(255, 255, 255, ']

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.1),
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    glint: Math.random(),
  }
}

export default function ParticleCanvas({
  particleCount = 45,
  className = '',
}: {
  particleCount?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -999, y: -999 })

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    const count = isMobile ? Math.floor(particleCount * 0.3) : particleCount

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particlesRef.current = Array.from({ length: count }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    resize()
    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(canvas)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMouseMove)

    // Pause when tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current)
      } else {
        animate()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // IntersectionObserver to pause off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
        } else {
          cancelAnimationFrame(frameRef.current)
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    function animate() {
      frameRef.current = requestAnimationFrame(animate)
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        // Mouse repel
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 80) {
          p.vx += (dx / dist) * 0.08
          p.vy += (dy / dist) * 0.08
        }

        // Clamp velocity
        p.vx = Math.max(-1, Math.min(1, p.vx))
        p.vy = Math.max(-1.2, Math.min(0.2, p.vy))

        p.x += p.vx
        p.y += p.vy

        // Wrap
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
        if (p.y < -5) {
          p.y = canvas.height + 5
          p.x = Math.random() * canvas.width
        }

        // Pulse opacity
        p.opacity += p.opacityDir * 0.004
        if (p.opacity > 0.6) p.opacityDir = -1
        if (p.opacity < 0.05) p.opacityDir = 1

        // Draw glint
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.opacity + ')'
        ctx.fill()

        // Occasional 4-pointed star glint
        if (p.glint > 0.8) {
          const s = p.size * 3
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(Date.now() * 0.001 * p.glint)
          ctx.beginPath()
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2
            const inner = s * 0.15
            const outer = s * 0.5
            const ax = Math.cos(angle) * outer
            const ay = Math.sin(angle) * outer
            const bx = Math.cos(angle + Math.PI / 4) * inner
            const by = Math.sin(angle + Math.PI / 4) * inner
            i === 0 ? ctx.moveTo(ax, ay) : ctx.lineTo(ax, ay)
            ctx.lineTo(bx, by)
          }
          ctx.closePath()
          ctx.fillStyle = p.color + (p.opacity * 0.5) + ')'
          ctx.fill()
          ctx.restore()
        }
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      resizeObs.disconnect()
      io.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}

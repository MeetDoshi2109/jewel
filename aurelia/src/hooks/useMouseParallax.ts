import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, MotionValue } from 'framer-motion'

interface Options {
  strength?: number   // multiplier for movement range (px)
  stiffness?: number
  damping?: number
}

/**
 * Returns { x, y } spring-animated MotionValues that follow the mouse
 * within a given container (or the whole window if no ref supplied).
 * Values are centred at 0 (i.e. no offset = mouse at centre).
 */
export function useMouseParallax(options: Options = {}): {
  x: MotionValue<number>
  y: MotionValue<number>
  ref: React.RefObject<HTMLElement | null>
} {
  const { strength = 20, stiffness = 120, damping = 18 } = options
  const ref = useRef<HTMLElement | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness, damping })
  const y = useSpring(rawY, { stiffness, damping })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) {
        // Use full window
        const nx = (e.clientX / window.innerWidth  - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        rawX.set(nx * strength)
        rawY.set(ny * strength)
        return
      }
      const rect = el.getBoundingClientRect()
      if (e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top  || e.clientY > rect.bottom) return
      const nx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2
      const ny = ((e.clientY - rect.top)   / rect.height - 0.5) * 2
      rawX.set(nx * strength)
      rawY.set(ny * strength)
    }
    const onLeave = () => { rawX.set(0); rawY.set(0) }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength])

  return { x, y, ref }
}

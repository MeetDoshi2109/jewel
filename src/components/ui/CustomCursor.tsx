'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Premium custom cursor:
 *  - Small gold dot that follows the mouse exactly
 *  - Larger hollow ring that trails behind with spring physics
 *  - Ring expands + blends on hoverable elements (links, buttons)
 *  - Hidden on touch devices and when prefers-reduced-motion
 */
export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [label, setLabel] = useState('')

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Dot — tight follow
  const dotX = useSpring(rawX, { stiffness: 1200, damping: 50, mass: 0.1 })
  const dotY = useSpring(rawY, { stiffness: 1200, damping: 50, mass: 0.1 })

  // Ring — loose trailing
  const ringX = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.5 })
  const ringY = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.5 })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || isTouch) return

    // Hide the native cursor via CSS
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)
    const onDown   = () => setClicking(true)
    const onUp     = () => setClicking(false)

    // Detect hoverable elements
    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hoverable = target.closest('a, button, [data-cursor], [role="button"], input, textarea, select, label')
      if (hoverable) {
        setHovering(true)
        const cursorLabel = (hoverable as HTMLElement).dataset?.cursor || ''
        setLabel(cursorLabel)
      } else {
        setHovering(false)
        setLabel('')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousemove', onHoverStart)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousemove', onHoverStart)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <>
      {/* ── Trailing ring ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          scale:   clicking ? 0.75 : hovering ? 1.7 : 1,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { type: 'spring', stiffness: 400, damping: 28 } }}
      >
        <div
          className="rounded-full border border-white"
          style={{
            width: 36, height: 36,
            background: hovering ? 'rgba(201,160,91,0.12)' : 'transparent',
            transition: 'background 0.25s ease',
          }}
        />
        {label && (
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[8px] tracking-widest uppercase whitespace-nowrap font-medium pointer-events-none"
          >
            {label}
          </span>
        )}
      </motion.div>

      {/* ── Precise dot ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          scale:   clicking ? 0.5 : hovering ? 0 : 1,
        }}
        transition={{ opacity: { duration: 0.15 }, scale: { type: 'spring', stiffness: 600, damping: 30 } }}
      >
        <div className="w-[5px] h-[5px] rounded-full bg-white" />
      </motion.div>
    </>
  )
}

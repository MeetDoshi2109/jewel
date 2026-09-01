'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  strength?: number
  as?: 'button' | 'div'
  onClick?: () => void
}

export default function MagneticButton({
  children,
  className,
  strength = 18,
  as: Tag = 'button',
  onClick,
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!el || prefersReduced) return

    const onMove = (e: Event) => {
      const me = e as globalThis.MouseEvent
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = ((me.clientX - cx) / rect.width) * strength
      const dy = ((me.clientY - cy) / rect.height) * strength
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
      el.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      setTimeout(() => { if (el) el.style.transition = '' }, 450)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  if (Tag === 'div') {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn('cursor-pointer', className)}
        onClick={onClick}
        style={{ transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={cn(className)}
      onClick={onClick}
      style={{ transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
    >
      {children}
    </button>
  )
}

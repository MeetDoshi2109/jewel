'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import ParticleCanvas from '@/components/ui/ParticleCanvas'
import MarqueeTicker from '@/components/ui/MarqueeTicker'

const RingCanvas = dynamic(() => import('./RingModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border border-[#C9A05B]/20 animate-pulse" />
    </div>
  ),
})

/* ── Magnetic link hook ── */
function useMagnetic(strength = 22) {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (pref) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = ((e.clientX - (r.left + r.width  / 2)) / r.width)  * strength
      const dy = ((e.clientY - (r.top  + r.height / 2)) / r.height) * strength
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [strength])
  return ref
}

const WORDS = ['Timeless.', 'Radiant.', 'Yours.']

/* ── Animated counter ── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = Math.ceil(end / 50)
      const id = setInterval(() => {
        start += step
        if (start >= end) { setCount(end); clearInterval(id) }
        else setCount(start)
      }, 30)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function HeroSection() {
  const [wordIdx, setWordIdx]       = useState(0)
  const [canvasReady, setCanvasReady] = useState(false)
  const [scrollProg, setScrollProg] = useState(0)
  const magRef = useMagnetic(24)
  const heroRef = useRef<HTMLDivElement>(null)

  /* scroll parallax */
  const { scrollY } = useScroll()
  const bgY      = useTransform(scrollY, [0, 700], ['0%', '22%'])
  const fadeOut  = useTransform(scrollY, [0, 420], [1, 0])
  const textUp   = useTransform(scrollY, [0, 420], ['0%', '14%'])

  /* mouse-driven spotlight */
  const rawMX = useMotionValue(0.5)
  const rawMY = useMotionValue(0.5)
  const spotX = useSpring(rawMX, { stiffness: 80, damping: 18 })
  const spotY = useSpring(rawMY, { stiffness: 80, damping: 18 })

  /* floating image parallax */
  const imgRawX = useMotionValue(0)
  const imgRawY = useMotionValue(0)
  const imgX = useSpring(imgRawX, { stiffness: 60, damping: 14 })
  const imgY = useSpring(imgRawY, { stiffness: 60, damping: 14 })

  /* word cycle */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800)
    return () => clearInterval(id)
  }, [])

  /* idle callback for 3D canvas */
  useEffect(() => {
    const id = (window as Window & typeof globalThis & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
      ? (window as Window & typeof globalThis & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback!(() => setCanvasReady(true), { timeout: 2000 })
      : setTimeout(() => setCanvasReady(true), 700)
    return () => { if (typeof id === 'number') clearTimeout(id) }
  }, [])

  /* scroll progress for ring */
  useEffect(() => {
    const fn = () => {
      if (!heroRef.current) return
      setScrollProg(Math.min(window.scrollY / heroRef.current.offsetHeight, 1))
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* mouse tracking */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      rawMX.set(e.clientX / window.innerWidth)
      rawMY.set(e.clientY / window.innerHeight)
      imgRawX.set((e.clientX / window.innerWidth  - 0.5) * 18)
      imgRawY.set((e.clientY / window.innerHeight - 0.5) * 18)
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col overflow-hidden bg-[#FAF6F0]"
      >

        {/* ── Mouse-reactive radial spotlight ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: useTransform(
              [spotX, spotY],
              ([mx, my]: number[]) =>
                `radial-gradient(ellipse 55% 55% at ${mx * 100}% ${my * 100}%, rgba(201,160,91,0.09) 0%, transparent 70%)`
            ),
          }}
          aria-hidden="true"
        />

        {/* ── Animated blob gradients ── */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute w-[50vw] h-[50vw] rounded-full blur-3xl animate-blob"
            style={{ background: 'radial-gradient(circle, rgba(201,160,91,0.14) 0%, transparent 70%)', top: '-10%', left: '-8%' }} />
          <div className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl animate-blob-delay"
            style={{ background: 'radial-gradient(circle, rgba(183,110,121,0.10) 0%, transparent 70%)', top: '30%', right: '-5%' }} />
          <div className="absolute w-[35vw] h-[35vw] rounded-full blur-3xl animate-blob-delay2"
            style={{ background: 'radial-gradient(circle, rgba(221,185,106,0.10) 0%, transparent 70%)', bottom: '5%', left: '30%' }} />
        </div>

        {/* ── Fine engraving texture ── */}
        <div className="absolute inset-0 z-[1] opacity-[0.028] pointer-events-none texture-engrave" aria-hidden="true" />

        {/* ── Particle layer ── */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          <ParticleCanvas particleCount={50} />
        </div>

        {/* ── Background parallax image ── */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <Image
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1920&q=75"
            alt=""
            fill
            className="object-cover opacity-[0.11]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/50 via-transparent to-[#FAF6F0]/85" />
        </motion.div>

        {/* ── CONTENT GRID ── */}
        <div className="relative z-20 flex-1 flex items-center w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center w-full min-h-screen py-32">

            {/* ── LEFT TEXT ── col 1–6 */}
            <motion.div
              className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1"
              style={{ y: textUp, opacity: fadeOut }}
            >
              {/* Top label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="rule-gold" />
                <span className="eyebrow">New Collection · 2026</span>
              </motion.div>

              {/* Headline — line 1 */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-[clamp(3.8rem,7.5vw,7rem)] text-[#1C1C1E] leading-[0.92] tracking-[-0.03em]"
                >
                  Crafted for
                </motion.h1>
              </div>

              {/* Animated word */}
              <div className="overflow-hidden h-[1.05em] relative my-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wordIdx}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -70, opacity: 0 }}
                    transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-[clamp(3.8rem,7.5vw,7rem)] leading-[0.92] tracking-[-0.03em] italic text-gold-gradient"
                  >
                    {WORDS[wordIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.55 }}
                className="text-[15px] text-[#8A8A8E] max-w-[380px] leading-[1.75] font-light mt-6 mb-10"
              >
                Fine jewellery with an editorial soul — from everyday essentials
                to heirloom pieces made to last a lifetime.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14"
              >
                <Link
                  ref={magRef}
                  href="/collections"
                  data-cursor="Explore"
                  className="magnetic-btn btn-sweep btn-shine group inline-flex items-center gap-3 bg-[#1C1C1E] hover:bg-[#2A2A2C] text-white px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-medium"
                  style={{ transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), background-color 0.2s ease' }}
                >
                  Explore the Collection
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#1C1C1E] hover:text-[#C9A05B] transition-colors duration-250"
                >
                  <span className="underline-anim">Our Story</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>

              {/* Stats strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.9 }}
                className="flex items-center gap-10 pt-8 border-t border-[#E8DDD0]"
              >
                {[
                  { end: 100, suffix: '+', label: 'Pieces' },
                  { end: 15,  suffix: '+', label: 'Years of craft' },
                  { end: 50,  suffix: 'K+', label: 'Happy customers' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-serif text-[1.75rem] text-[#1C1C1E] leading-none tabular-nums">
                      <Counter end={s.end} suffix={s.suffix} />
                    </p>
                    <p className="eyebrow text-[#8A8A8E] mt-1.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT — 3D ring + floating image ── col 7–12 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.3 }}
              className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 relative flex items-center justify-center h-[55vw] max-h-[680px] min-h-[340px]"
            >
              {/* Back glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-[65%] h-[65%] rounded-full blur-3xl animate-blob opacity-30"
                  style={{ background: 'radial-gradient(circle, #C9A05B 0%, transparent 70%)' }}
                />
              </div>

              {/* Floating editorial image — mouse-tracked */}
              <motion.div
                className="absolute top-[8%] right-[5%] w-32 md:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10"
                style={{ x: imgX, y: imgY }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80"
                  alt="Aurelia necklace"
                  fill
                  className="object-cover"
                  sizes="176px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/25 to-transparent" />
              </motion.div>

              {/* Second floating accent image */}
              <motion.div
                className="absolute bottom-[10%] left-[3%] w-24 md:w-36 aspect-square rounded-xl overflow-hidden shadow-xl z-10"
                style={{
                  x: useTransform(imgX, v => -v * 0.6),
                  y: useTransform(imgY, v => v  * 0.5),
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80"
                  alt="Aurelia bangle"
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </motion.div>

              {/* 3D Ring canvas */}
              <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] z-20">
                {canvasReady ? (
                  <RingCanvas scrollProgress={scrollProg} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-44 h-44 animate-float">
                      <div className="absolute inset-0 rounded-full border-2 border-[#C9A05B]/25" />
                      <div className="absolute inset-8 rounded-full border border-[#C9A05B]/15" />
                      <div className="absolute inset-16 rounded-full bg-[#C9A05B]/08" />
                    </div>
                  </div>
                )}

                {/* Orbiting particles */}
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20 + i * 4, repeat: Infinity, ease: 'linear', delay: i }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <div
                      className="absolute rounded-full bg-[#C9A05B]"
                      style={{
                        width:  i % 2 === 0 ? 5 : 3,
                        height: i % 2 === 0 ? 5 : 3,
                        top: '50%', left: '50%',
                        transform: `rotate(${(i / 6) * 360}deg) translateX(${135 + i * 14}px) translateY(-50%)`,
                        opacity: 0.3 + i * 0.06,
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Bottom-left badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 right-8 md:right-14 bg-white/80 backdrop-blur-md border border-[#E8DDD0] rounded-2xl px-4 py-3 shadow-lg z-20"
              >
                <p className="eyebrow text-[#C9A05B] mb-0.5">Est. 2009</p>
                <p className="font-serif text-sm text-[#1C1C1E]">Jaipur Atelier</p>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          style={{ opacity: fadeOut }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#C9A05B] to-transparent" />
          <span className="eyebrow text-[#8A8A8E]">Scroll</span>
        </motion.div>

      </section>

      {/* ── Marquee ticker below hero ── */}
      <MarqueeTicker />
    </>
  )
}

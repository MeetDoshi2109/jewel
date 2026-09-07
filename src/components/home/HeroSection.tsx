'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  type Variants,
} from 'framer-motion'
import ParticleCanvas from '@/components/ui/ParticleCanvas'
import MarqueeTicker from '@/components/ui/MarqueeTicker'

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
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])
  return ref
}

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

/* ── Slide data ── */
const SLIDES = [
  {
    src: '/hero-slides/slide-1.jpg',
    alt: 'Aurelia signature jewellery piece',
    label: 'Signature Collection',
    sub: '18k Gold · Handcrafted',
  },
  {
    src: '/hero-slides/slide-2.jpg',
    alt: 'Diamond leaf necklace displayed',
    label: 'Diamond Leaf Necklace',
    sub: 'Conflict-Free Stones',
  },
  {
    src: '/hero-slides/slide-3.jpg',
    alt: 'Diamond leaf necklace on pedestal',
    label: 'Atelier Showcase',
    sub: 'Jaipur Atelier · Est. 2009',
  },
  {
    src: '/hero-slides/slide-4.jpg',
    alt: 'Diamond leaf necklace resting',
    label: 'Crafted to Last',
    sub: '15+ Years of Craft',
  },
]

const WORDS = ['Timeless.', 'Radiant.', 'Yours.']

/* ── Slide variants ── */
const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.04,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-40%' : '40%',
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
  }),
}

const captionVariants: Variants = {
  enter:  { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0,  transition: { duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

/* ── HeroSlideshow ── */
function HeroSlideshow() {
  const [[activeIdx, dir], setSlide] = useState([0, 1])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = useCallback((next: number) => {
    setSlide(([cur]) => {
      const d = next > cur ? 1 : -1
      return [((next % SLIDES.length) + SLIDES.length) % SLIDES.length, d]
    })
  }, [])

  const next = useCallback(() => go(activeIdx + 1), [activeIdx, go])
  const prev = useCallback(() => go(activeIdx - 1), [activeIdx, go])

  /* auto-advance every 5 s */
  useEffect(() => {
    timerRef.current = setTimeout(next, 5000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeIdx, next])

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden group select-none">

      {/* ── Slides ── */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={activeIdx}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[activeIdx].src}
            alt={SLIDES[activeIdx].alt}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 55vw"
            priority={activeIdx === 0}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E]/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Ken-Burns shimmer overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(201,160,91,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* ── Caption ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`caption-${activeIdx}`}
          variants={captionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-7 pt-12"
        >
          <p className="text-[9px] tracking-[0.22em] uppercase text-[#C9A05B] mb-1">
            {SLIDES[activeIdx].sub}
          </p>
          <p className="font-serif text-xl text-white leading-tight">
            {SLIDES[activeIdx].label}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-5 right-6 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group/dot relative flex items-center justify-center w-5 h-5"
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width:   i === activeIdx ? 20 : 6,
                height:  6,
                background: i === activeIdx ? '#C9A05B' : 'rgba(255,255,255,0.4)',
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Prev / Next arrows (visible on hover) ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all duration-300"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all duration-300"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Thin gold progress bar ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 z-20">
        <motion.div
          key={activeIdx}
          className="h-full bg-[#C9A05B]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-4 right-5 z-20">
        <span className="text-[10px] tracking-[0.18em] text-white/50 font-light tabular-nums">
          {String(activeIdx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const magRef  = useMagnetic(24)

  /* scroll parallax */
  const { scrollY } = useScroll()
  const bgY     = useTransform(scrollY, [0, 700], ['0%', '22%'])
  const fadeOut = useTransform(scrollY, [0, 420], [1, 0])
  const textUp  = useTransform(scrollY, [0, 420], ['0%', '14%'])

  /* mouse-driven spotlight */
  const rawMX = useMotionValue(0.5)
  const rawMY = useMotionValue(0.5)
  const spotX = useSpring(rawMX, { stiffness: 80, damping: 18 })
  const spotY = useSpring(rawMY, { stiffness: 80, damping: 18 })

  /* word cycle */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800)
    return () => clearInterval(id)
  }, [])

  /* mouse tracking */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      rawMX.set(e.clientX / window.innerWidth)
      rawMY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════════ HERO ═════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col overflow-hidden bg-[#FAF6F0]"
      >
        {/* ── Mouse spotlight ── */}
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

        {/* ── Animated blobs ── */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute w-[50vw] h-[50vw] rounded-full blur-3xl animate-blob"
            style={{ background: 'radial-gradient(circle, rgba(201,160,91,0.14) 0%, transparent 70%)', top: '-10%', left: '-8%' }} />
          <div className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl animate-blob-delay"
            style={{ background: 'radial-gradient(circle, rgba(183,110,121,0.10) 0%, transparent 70%)', top: '30%', right: '-5%' }} />
        </div>

        {/* ── Texture ── */}
        <div className="absolute inset-0 z-[1] opacity-[0.028] pointer-events-none texture-engrave" aria-hidden="true" />

        {/* ── Particles ── */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          <ParticleCanvas particleCount={50} />
        </div>

        {/* ── Background parallax image ── */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <Image
            src="/images/3.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.07]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/50 via-transparent to-[#FAF6F0]/85" />
        </motion.div>

        {/* ── CONTENT GRID ── */}
        <div className="relative z-20 flex-1 flex items-center w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center w-full min-h-screen py-32">

            {/* ── LEFT TEXT ── col 1–5 */}
            <motion.div
              className="lg:col-span-6 order-2 lg:order-1"
              style={{ y: textUp, opacity: fadeOut }}
            >
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="rule-gold" />
                <span className="eyebrow">New Collection · 2026</span>
              </motion.div>

              {/* Headline line 1 */}
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
              <div className="overflow-hidden relative my-1" style={{ height: 'calc(clamp(3.8rem, 7.5vw, 7rem) * 1.05)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wordIdx}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -70, opacity: 0 }}
                    transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 font-serif text-[clamp(3.8rem,7.5vw,7rem)] leading-[0.92] tracking-[-0.03em] italic text-gold-gradient"
                  >
                    {WORDS[wordIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sub */}
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

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.9 }}
                className="flex items-center gap-10 pt-8 border-t border-[#E8DDD0]"
              >
                {[
                  { end: 100, suffix: '+',  label: 'Pieces'          },
                  { end: 15,  suffix: '+',  label: 'Years of craft'  },
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

            {/* ── RIGHT — slideshow ── col 6–12 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 order-1 lg:order-2 relative"
            >
              {/* Main slideshow card */}
              <div className="relative w-full aspect-[3/4] max-h-[560px]">
                <HeroSlideshow />

                {/* Floating badge — top-left */}
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -top-4 -left-4 lg:-left-6 z-30 bg-white/90 backdrop-blur-md border border-[#E8DDD0] rounded-2xl px-4 py-3 shadow-xl"
                >
                  <p className="eyebrow text-[#C9A05B] mb-0.5">Est. 2009</p>
                  <p className="font-serif text-sm text-[#1C1C1E]">Jaipur Atelier</p>
                </motion.div>

                {/* Floating tag — bottom-right pull-out */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-5 -right-4 lg:-right-6 z-30 bg-[#1C1C1E] rounded-2xl px-5 py-3 shadow-xl"
                >
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#C9A05B] mb-0.5">Handcrafted</p>
                  <p className="font-serif text-sm text-white">18k Gold · Diamond</p>
                </motion.div>
              </div>

              {/* Decorative vertical rule */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:block absolute -left-8 top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-[#C9A05B]/30 to-transparent origin-top"
                aria-hidden="true"
              />
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

      {/* ── Marquee ticker ── */}
      <MarqueeTicker />
    </>
  )
}

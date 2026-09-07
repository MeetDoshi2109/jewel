'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Gem, ShieldCheck, Award, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─────────────────────────────────────────────────────────────────────
// Craftsmanship Milestones Data (UI/UX Pro Max & Stitch Design System)
// ─────────────────────────────────────────────────────────────────────
interface CraftMilestone {
  id: string
  chapter: string
  roman: string
  title: string
  subtitle: string
  description: string
  metric: string
  metricLabel: string
  badge: string
  icon: typeof Gem
  accent: string
}

const MILESTONES: CraftMilestone[] = [
  {
    id: 'alloy',
    chapter: 'Chapter I',
    roman: 'I',
    title: 'The Imperial Alloy',
    subtitle: '18K Solid Gold Formulation',
    description:
      'Hand-blended in our Jaipur foundry with pure copper and silver. Zero nickel, maximum skin comfort, and a rich warm glow that never oxidizes.',
    metric: '75.0%',
    metricLabel: 'Certified Pure Gold',
    badge: 'BIS 750 Hallmarked',
    icon: Flame,
    accent: '#C9A05B',
  },
  {
    id: 'solitaire',
    chapter: 'Chapter II',
    roman: 'II',
    title: 'Optical Solitaires',
    subtitle: 'Top 1% Diamond Selection',
    description:
      'Individually inspected under 40× magnification. Selected strictly for Triple-Excellent symmetry, optical fire, and certified VVS1 clarity.',
    metric: '1.50ct',
    metricLabel: 'Brilliant Round Cut',
    badge: 'VVS1 · Triple Excellent',
    icon: Gem,
    accent: '#DDB96A',
  },
  {
    id: 'setting',
    chapter: 'Chapter III',
    roman: 'III',
    title: 'Micro-Prong Mastery',
    subtitle: 'Hand-Carved Pavé Settings',
    description:
      'Master ustads with over 15 years of familial lineage sculpt microscopic claw prongs, securing each pavilion for uninterrupted light refraction.',
    metric: '0.02mm',
    metricLabel: 'Artisan Tolerances',
    badge: 'Hand-Set in Atelier',
    icon: ShieldCheck,
    accent: '#C9A05B',
  },
  {
    id: 'finish',
    chapter: 'Chapter IV',
    roman: 'IV',
    title: 'Mirror Atelier Luster',
    subtitle: 'Five-Stage Hand Buffing',
    description:
      'Lapped across walnut husk wheels and sub-micron diamond compound for a liquid-light specular reflection that feels like silk against the finger.',
    metric: '5 Stages',
    metricLabel: 'Walnut & Diamond Buff',
    badge: 'Lifetime Guarantee',
    icon: Award,
    accent: '#A8823A',
  },
]

// ─────────────────────────────────────────────────────────────────────
// Scene 2 — "Crafted to Perfection" Haute Joaillerie Pinned Stage
// ─────────────────────────────────────────────────────────────────────
function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!containerRef.current) return

    const video = videoRef.current
    let videoDuration = 0

    const updateDuration = () => {
      if (video && video.duration && !isNaN(video.duration)) {
        videoDuration = video.duration
      }
    }

    if (video) {
      if (video.readyState >= 1) {
        updateDuration()
      } else {
        video.addEventListener('loadedmetadata', updateDuration)
      }
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=320%',
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)

          // Synchronize rotating gold ring video directly with scroll position
          if (!prefersReduced && video && videoDuration > 0) {
            video.currentTime = p * (videoDuration - 0.05)
          }

          // Compute active milestone (0 to 3)
          const stepIndex = Math.min(
            MILESTONES.length - 1,
            Math.floor(p * MILESTONES.length)
          )
          setActiveStep(stepIndex)
        },
      })
    }, containerRef)

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', updateDuration)
      }
      ctx.revert()
    }
  }, [])

  const currentMilestone = MILESTONES[activeStep]

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] h-screen bg-[#0D0D0F] text-[#FAF6F0] overflow-hidden flex items-center justify-center select-none"
    >
      {/* ── Background Atmospheric Layers ── */}
      <div
        className="absolute inset-0 opacity-[0.035] texture-engrave pointer-events-none"
        aria-hidden="true"
      />

      {/* Ambient Gold Radial Core Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(201,160,91,0.18) 0%, rgba(201,160,91,0.04) 45%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Top Header Bar ── */}
      <div className="absolute top-8 sm:top-10 inset-x-6 sm:inset-x-12 flex items-center justify-between z-30 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-[1px] bg-[#C9A05B]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C9A05B]">
              Haute Atelier Engineering
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Crafted to <em className="italic font-light text-[#E8DDD0]">perfection.</em>
          </h2>
        </div>

        {/* Live Scrub Rotation HUD */}
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-[10px] font-mono tracking-widest text-[#C9A05B] uppercase">
            SOLITAIRE 360° ARCHIVE
          </span>
          <span className="text-xs font-mono text-white/60 mt-0.5 tabular-nums">
            ANGLE: {Math.round(scrollProgress * 360)}° · BIS 750
          </span>
        </div>
      </div>

      {/* ── Centerpiece Rotating Video Stage (Double-Bezel Architecture) ── */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex items-center justify-center">
        {/* Outer Halo Disc */}
        <div className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full p-2 sm:p-3 bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(201,160,91,0.15)] flex items-center justify-center">
          {/* Inner Concentric Lens Ring */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-[#C9A05B]/20 flex items-center justify-center bg-black/40">
            <video
              ref={videoRef}
              src="/gold-ring-rotate.mp4"
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-contain scale-110 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              aria-label="3D Rotating Solitaire Ring"
            />

            {/* Subtle Circular Reflection Highlights */}
            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Left Side: Interactive Milestone Rail (Roman Beads) ── */}
      <div className="absolute left-6 sm:left-10 md:left-14 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-5">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#C9A05B]/40 mx-auto" />
        {MILESTONES.map((m, idx) => {
          const isPassed = idx <= activeStep
          const isCurrent = idx === activeStep
          return (
            <div key={m.id} className="flex items-center gap-3 group">
              <div
                className={cn(
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-serif font-semibold transition-all duration-500 border',
                  isCurrent
                    ? 'bg-[#C9A05B] text-[#0D0D0F] border-[#C9A05B] shadow-[0_0_20px_rgba(201,160,91,0.6)] scale-110'
                    : isPassed
                    ? 'bg-white/10 text-[#C9A05B] border-[#C9A05B]/50'
                    : 'bg-white/5 text-white/30 border-white/10'
                )}
              >
                {m.roman}
              </div>
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.2em] font-mono transition-opacity duration-300 hidden lg:inline-block',
                  isCurrent ? 'text-white opacity-100 font-semibold' : 'text-white/40 opacity-0'
                )}
              >
                {m.chapter}
              </span>
            </div>
          )
        })}
        <div className="w-[1px] h-12 bg-gradient-to-t from-transparent to-[#C9A05B]/40 mx-auto" />
      </div>

      {/* ── Right Side / Bottom: Dynamic Ethereal Milestone Card ── */}
      <div className="absolute right-4 sm:right-8 md:right-14 bottom-8 sm:bottom-12 md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-30 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMilestone.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Outer Machined Glass Bezel */}
            <div className="p-2 sm:p-2.5 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              {/* Inner Concentric Core */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
                {/* Micro Ambient Glow */}
                <div
                  className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-40"
                  style={{ background: currentMilestone.accent }}
                />

                {/* Chapter & Badge */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <currentMilestone.icon size={14} className="text-[#C9A05B]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C9A05B]">
                      {currentMilestone.chapter}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                    {currentMilestone.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight">
                  {currentMilestone.title}
                </h3>
                <p className="text-[11px] text-[#C9A05B] font-medium tracking-wide mt-0.5">
                  {currentMilestone.subtitle}
                </p>

                {/* Prose */}
                <p className="text-xs text-white/75 font-light leading-relaxed mt-3">
                  {currentMilestone.description}
                </p>

                {/* Metric Strip */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                      {currentMilestone.metric}
                    </span>
                    <span className="text-[10px] text-white/50 block font-light">
                      {currentMilestone.metricLabel}
                    </span>
                  </div>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#C9A05B] hover:text-white transition-colors"
                  >
                    <span>Our Atelier</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Ambient Progress Bar ── */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-30">
        <div
          className="h-full bg-gradient-to-r from-[#C9A05B] via-[#DDB96A] to-[#C9A05B] transition-none"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Scene 3 — Horizontal category scroll-jack
// ─────────────────────────────────────────────────────────────────────
interface CollectionCard {
  category: string
  label: string
  image: string
  count: string
}

const SCENE3_CARDS: CollectionCard[] = [
  { category: 'rings', label: 'Rings', image: '/images/2ring.jpg', count: '18 pieces' },
  { category: 'necklaces', label: 'Necklaces', image: '/images/necklace.jpg', count: '18 pieces' },
  { category: 'earrings', label: 'Earrings', image: '/images/5.jpg', count: '18 pieces' },
  { category: 'bangles', label: 'Bangles', image: '/images/6.jpg', count: '15 pieces' },
  { category: 'mens', label: "Men's", image: '/images/7.jpg', count: '9 pieces' },
]

function TiltCard({ card, index }: { card: CollectionCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    ref.current.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.02)`
  }
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-shrink-0 w-64 md:w-72"
    >
      <Link href={`/collections/${card.category}`} data-cursor="Shop">
        <div
          ref={ref}
          className="group relative aspect-[3/4] rounded-2xl overflow-hidden p-1.5 bg-white/40 border border-[#E8DDD0] shadow-sm hover:border-[#C9A05B]/50 transition-all duration-500"
          style={{ transformStyle: 'preserve-3d' }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className="relative w-full h-full rounded-[calc(1rem-0.25rem)] overflow-hidden">
            <Image
              src={card.image}
              alt={card.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-106"
              sizes="288px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/85 via-transparent to-transparent" />

            {/* Gold shimmer on hover */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
              style={{ background: 'linear-gradient(90deg, #C9A05B, transparent)' }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-serif text-xl text-white leading-tight">{card.label}</p>
              <p className="text-xs text-white/60 tracking-widest mt-1">{card.count}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-white/70 uppercase tracking-widest">Shop</span>
                <ArrowRight size={10} className="text-[#C9A05B] group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Scene3() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (prefersReduced || isMobile || !containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const cards = trackRef.current!.querySelectorAll('.scene3-card')
      const totalWidth = (cards.length - 1) * (288 + 32)

      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerWidth * 0.5}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="overflow-hidden bg-[#F2EBE0] py-20 md:py-0 md:h-screen md:flex md:items-center"
    >
      <div className="px-4 sm:px-8 lg:px-16 w-full">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="rule-gold" />
            <span className="eyebrow">Collections</span>
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] text-[#1C1C1E] leading-[0.92] tracking-[-0.025em]">
            Browse by category
          </h2>
        </div>
        <div ref={trackRef} className="flex gap-8 pb-4 overflow-x-auto md:overflow-visible">
          {SCENE3_CARDS.map((card, i) => (
            <div key={card.category} className="scene3-card">
              <TiltCard card={card} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Scene 4 — Craftsmanship split-screen reveal
// ─────────────────────────────────────────────────────────────────────
const CRAFT_LINES = [
  'Every Aurelia piece begins',
  'as a sketch in Jaipur —',
  'refined over weeks,',
  'cast by hand,',
  'finished to perfection.',
]

function Scene4() {
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.14, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] bg-[#1C1C1E]">
      {/* Image */}
      <div className="relative overflow-hidden min-h-64 lg:min-h-0">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src="/images/mangalsutra.jpg"
            alt="Aurelia artisan setting a gemstone by hand"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#1C1C1E]/20" />
        </div>
      </div>

      {/* Text */}
      <div className="flex items-center px-8 md:px-16 py-20">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="rule-gold" />
            <span className="eyebrow">Craftsmanship</span>
          </div>
          <div className="space-y-1">
            {CRAFT_LINES.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] text-[#FAF6F0] leading-tight"
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10"
          >
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#C9A05B] border-b border-[#C9A05B]/40 pb-1 hover:border-[#C9A05B] transition-colors"
            >
              Our Story
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Composite export
// ─────────────────────────────────────────────────────────────────────
export default function ScrollScene() {
  return (
    <>
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </>
  )
}

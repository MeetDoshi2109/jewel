'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Register GSAP plugin client-side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Scene 2: Scroll-linked product reveal ───────────────────────────
function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const tag1Ref = useRef<HTMLParagraphElement>(null)
  const tag2Ref = useRef<HTMLParagraphElement>(null)
  const tag3Ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Ring rotates 360° tied directly to scroll
      tl.to(ringRef.current, { rotation: 360, ease: 'none' }, 0)

      // Callout tags fade in at specific scroll checkpoints
      tl.fromTo(tag1Ref.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.3 },
        0.1
      )
      tl.fromTo(tag2Ref.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3 },
        0.4
      )
      tl.fromTo(tag3Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.7
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-screen bg-[#FAF6F0] overflow-hidden flex items-center justify-center"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23C9A05B' stroke-width='0.4'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Central ring image */}
      <div
        ref={ringRef}
        className="relative w-64 h-64 md:w-80 md:h-80"
        style={{ willChange: 'transform' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"
          alt="Aurelia ring rotating"
          fill
          className="object-cover rounded-full"
          sizes="320px"
          priority={false}
        />
        {/* Gold ring border */}
        <div className="absolute inset-0 rounded-full border-2 border-[#C9A05B]/30" />
        <div className="absolute inset-4 rounded-full border border-[#C9A05B]/15" />
      </div>

      {/* Callout tags */}
      <p
        ref={tag1Ref}
        className="absolute left-4 md:left-16 top-1/3 opacity-0 text-xs tracking-[0.2em] uppercase text-[#C9A05B] font-medium"
      >
        ✦ Handcrafted in 18k Gold
      </p>
      <p
        ref={tag2Ref}
        className="absolute right-4 md:right-16 top-1/2 opacity-0 text-xs tracking-[0.2em] uppercase text-[#C9A05B] font-medium text-right"
      >
        Conflict-Free Diamond ✦
      </p>
      <p
        ref={tag3Ref}
        className="absolute left-1/2 -translate-x-1/2 bottom-24 opacity-0 text-xs tracking-[0.3em] uppercase text-[#8A8A8E]"
      >
        Scroll to discover
      </p>

      {/* Eyebrow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A05B]">The Craft</p>
        <p className="font-serif text-3xl text-[#1C1C1E] mt-1">Turn the piece.</p>
      </div>
    </div>
  )
}

// ─── Scene 3: Horizontal collection slide ────────────────────────────
interface CollectionCard {
  category: string
  label: string
  image: string
  count: string
}

const SCENE3_CARDS: CollectionCard[] = [
  { category: 'rings', label: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', count: '18 pieces' },
  { category: 'necklaces', label: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', count: '18 pieces' },
  { category: 'earrings', label: 'Earrings', image: 'https://images.unsplash.com/photo-1630350434070-e9a27b89e4a9?w=600&q=80', count: '18 pieces' },
  { category: 'bangles', label: 'Bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80', count: '15 pieces' },
  { category: 'mens', label: "Men's", image: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&q=80', count: '9 pieces' },
]

function TiltCard({ card, index }: { card: CollectionCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    cardRef.current.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.02)`
  }

  const handleLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-shrink-0 w-64 md:w-72"
    >
      <Link href={`/collections/${card.category}`}>
        <div
          ref={cardRef}
          className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
          style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', transformStyle: 'preserve-3d' }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <Image
            src={card.image}
            alt={card.label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="288px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/70 via-transparent to-transparent" />
          {/* Depth parallax layer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(201,160,91,0.08) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-serif text-xl text-white">{card.label}</p>
            <p className="text-xs text-white/60 tracking-widest mt-1">{card.count}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-white/70 uppercase tracking-widest">Shop</span>
              <ArrowRight size={10} className="text-[#C9A05B] translate-x-0 group-hover:translate-x-1.5 transition-transform" />
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
    // On mobile, skip scroll-jacking
    const isMobile = window.innerWidth < 768
    if (prefersReduced || isMobile || !containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const cards = trackRef.current!.querySelectorAll('.scene3-card')
      const totalWidth = (cards.length - 1) * (288 + 24) // card width + gap

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
    <div ref={containerRef} className="overflow-hidden bg-[#F2EBE0] py-20 md:py-0 md:h-screen md:flex md:items-center">
      <div className="px-4 sm:px-8 lg:px-16 w-full">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A05B] mb-3">Collections</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1C1C1E]">Browse by category</h2>
        </div>

        {/* Scrolling track */}
        <div ref={trackRef} className="flex gap-6 md:gap-8 pb-4 overflow-x-auto md:overflow-visible">
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

// ─── Scene 4: Craftsmanship split-screen ─────────────────────────────
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
      // Image scale-reveal on scroll
      gsap.fromTo(imageRef.current,
        { scale: 1.15, opacity: 0 },
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
      {/* Image side */}
      <div className="relative overflow-hidden min-h-64 lg:min-h-0">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1573408301828-def33c4cdf7d?w=900&q=80"
            alt="Aurelia artisan at work"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#1C1C1E]/20" />
        </div>
      </div>

      {/* Text side */}
      <div className="flex items-center px-8 md:px-16 py-20">
        <div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A05B] mb-8">Craftsmanship</p>
          <div className="space-y-1">
            {CRAFT_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-serif text-3xl md:text-4xl text-[#FAF6F0] leading-tight"
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
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C9A05B] border-b border-[#C9A05B]/40 pb-1 hover:border-[#C9A05B] transition-colors"
            >
              Our Story <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Exported composite component ────────────────────────────────────
export default function ScrollScene() {
  return (
    <>
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </>
  )
}

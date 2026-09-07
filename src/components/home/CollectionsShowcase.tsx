'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CollectionItem {
  id: string
  num: string
  roman: string
  title: string
  subtitle: string
  description: string
  href: string
  src: string
  hover: string
  accent: string
  hallmark: string
}

const PRIMARY_COLLECTIONS: CollectionItem[] = [
  {
    id: 'rings',
    num: '01',
    roman: 'I',
    title: 'Solitaires & Bands',
    subtitle: 'The Ring Atelier',
    description: 'Conflict-free diamonds and hand-carved 18k gold bands engineered for eternity.',
    href: '/collections/rings',
    src: '/images/2ring.jpg',
    hover: '/images/4.jpg',
    accent: '#C9A05B',
    hallmark: '18K SOLID GOLD · VVS1 CLARITY',
  },
  {
    id: 'necklaces',
    num: '02',
    roman: 'II',
    title: 'Chokers & Heirlooms',
    subtitle: 'High Jewellery Chains',
    description: 'Regal layered pendants and delicate collar chains draped in Jaipur heritage.',
    href: '/collections/necklaces',
    src: '/images/necklace.jpg',
    hover: '/images/3.jpg',
    accent: '#B76E79',
    hallmark: 'BESPOKE ARTISAN CASTING',
  },
  {
    id: 'earrings',
    num: '03',
    roman: 'III',
    title: 'Earrings & Drops',
    subtitle: 'Chandbalis & Studs',
    description: 'Weightless architectural drops and diamond-pavé everyday solitaires.',
    href: '/collections/earrings',
    src: '/images/5.jpg',
    hover: '/images/6.jpg',
    accent: '#C9A05B',
    hallmark: 'HAND-SET PRONGS',
  },
  {
    id: 'bangles',
    num: '04',
    roman: 'IV',
    title: 'Bangles & Cuffs',
    subtitle: 'Sculptural Wristwear',
    description: 'Articulated hinged kadas and eternal diamond tennis bracelets.',
    href: '/collections/bangles',
    src: '/images/6.jpg',
    hover: '/images/7.jpg',
    accent: '#A8823A',
    hallmark: 'MICRO-PAVÉ DIAMOND SET',
  },
]

const SECONDARY_COLLECTIONS: CollectionItem[] = [
  {
    id: 'mangalsutra',
    num: '05',
    roman: 'V',
    title: 'Mangalsutra',
    subtitle: 'Sacred Heirlooms',
    description: 'Contemporary interpretations of auspicious sacred black beads in solid gold.',
    href: '/collections/mangalsutra',
    src: '/images/mangalsutra.jpg',
    hover: '/images/necklace.jpg',
    accent: '#C9A05B',
    hallmark: 'BRIDAL SANCTUM',
  },
  {
    id: 'anklets',
    num: '06',
    roman: 'VI',
    title: 'Payals & Anklets',
    subtitle: 'Graceful Accents',
    description: 'Chime-free whisper-light gold chains adorned with genuine gemstones.',
    href: '/collections/anklets',
    src: '/images/8.jpg',
    hover: '/images/9.jpg',
    accent: '#B76E79',
    hallmark: 'EVERYDAY WEAR',
  },
  {
    id: 'nosepins',
    num: '07',
    roman: 'VII',
    title: 'Nose Pins',
    subtitle: 'Solitaire Accents',
    description: 'Micro-diamond studs and traditional South Asian floral press pins.',
    href: '/collections/nosepins',
    src: '/images/9.jpg',
    hover: '/images/2.webp',
    accent: '#C9A05B',
    hallmark: 'NATURAL DIAMONDS',
  },
  {
    id: 'mens',
    num: '08',
    roman: 'VIII',
    title: "Men's Atelier",
    subtitle: 'Sovereign Heritage',
    description: 'Heavy curb chains, textured signet rings, and solid gold kada bangles.',
    href: '/collections/mens',
    src: '/images/7.jpg',
    hover: '/images/8.jpg',
    accent: '#8A8A8E',
    hallmark: 'MATTE & POLISHED DUO',
  },
]

function DoubleBezelCard({
  item,
  aspectClass = 'aspect-[4/5]',
  className = '',
  isHero = false,
}: {
  item: CollectionItem
  aspectClass?: string
  className?: string
  isHero?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  /* Fluid mouse tilt physics */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const tiltX = useSpring(rawX, { stiffness: 300, damping: 30 })
  const tiltY = useSpring(rawY, { stiffness: 300, damping: 30 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set(((e.clientY - rect.top) / rect.height - 0.5) * -6)
    rawY.set(((e.clientX - rect.left) / rect.width - 0.5) * 6)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
    setHovered(false)
  }

  return (
    <div className={cn('w-full min-w-0', className)}>
      <Link href={item.href} className="group block w-full h-full">
        {/* Outer Machined Bezel Shell */}
        <div className="p-2 sm:p-2.5 rounded-[2.2rem] bg-white/50 backdrop-blur-xs border border-[#E8DDD0] shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(201,160,91,0.12)] hover:border-[#C9A05B]/40 transition-all duration-700 h-full flex flex-col">
          {/* Inner Concentric Core */}
          <motion.div
            ref={cardRef}
            className={cn(
              'relative w-full h-full overflow-hidden rounded-[calc(2.2rem-0.625rem)] bg-[#1C1C1E]',
              aspectClass
            )}
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onMouseEnter={() => setHovered(true)}
          >
            {/* Primary High-Jewellery Photo */}
            <Image
              src={item.src}
              alt={item.title}
              fill
              className={cn(
                'object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106',
                hovered ? 'opacity-0 scale-104' : 'opacity-100 scale-100'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Hover Editorial Lifestyle Shot */}
            <Image
              src={item.hover}
              alt={`${item.title} editorial`}
              fill
              className={cn(
                'object-cover absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106',
                hovered ? 'opacity-100 scale-104' : 'opacity-0 scale-100'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Cinematic Scrim Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/95 via-[#1C1C1E]/35 to-black/15 pointer-events-none" />

            {/* Hover Gold Ambient Wash */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 60% 80%, ${item.accent}30 0%, transparent 65%)`,
              }}
            />

            {/* Top Bar inside Card: Hallmark & Roman Numeral */}
            <div className="absolute top-5 inset-x-5 sm:inset-x-6 flex items-center justify-between pointer-events-none">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] text-white/60 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {item.hallmark}
              </span>
              <span className="font-serif text-sm tracking-widest text-[#C9A05B] font-light">
                {item.roman}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 md:p-8 flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A05B] font-semibold block mb-1">
                  {item.num} · {item.subtitle}
                </span>
                <h3
                  className={cn(
                    'font-serif text-white leading-[1.05] tracking-tight truncate',
                    isHero ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl'
                  )}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 font-light mt-1.5 line-clamp-2 max-w-md hidden sm:block">
                  {item.description}
                </p>
              </div>

              {/* Nested Button-in-Button Island Architecture */}
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 text-white group-hover:bg-[#C9A05B] group-hover:border-[#C9A05B] group-hover:rotate-45 group-hover:scale-105 transition-all duration-500 shadow-md">
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* Bottom Gold Hairline Sweep */}
            <div
              className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
            />
          </motion.div>
        </div>
      </Link>
    </div>
  )
}

export default function CollectionsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-80px' })

  const heroItem = PRIMARY_COLLECTIONS[0] // Rings
  const necklaceItem = PRIMARY_COLLECTIONS[1] // Necklaces
  const earringsItem = PRIMARY_COLLECTIONS[2] // Earrings
  const banglesItem = PRIMARY_COLLECTIONS[3] // Bangles & Bracelets

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 bg-[#F2EBE0] relative overflow-hidden"
    >
      {/* Subtle Noise / Engraving Texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none texture-engrave" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3.5">
              <span className="w-9 h-[1.5px] bg-[#C9A05B]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A05B] font-semibold">
                Haute Joaillerie Atelier
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] text-[#1C1C1E] leading-[0.94] tracking-[-0.025em]">
              Jewellery for<br />
              <em className="italic font-light">every chapter.</em>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-xs sm:text-sm text-[#8A8A8E] max-w-xs leading-relaxed md:text-right font-light">
              Eight distinct ateliers, from diamond-pavé solitaires to imperial bridal heirlooms.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1C1C1E] hover:text-[#C9A05B] transition-colors border-b border-[#1C1C1E] pb-0.5 hover:border-[#C9A05B]"
            >
              <span>Explore All Ateliers</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>

        {/* ─── ACT I: THE SIGNATURE ATELIER SHOWCASE ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8 sm:mb-10"
        >
          {/* Monumental Hero Piece: Rings Atelier (7 Columns) */}
          <div className="lg:col-span-7 flex">
            <DoubleBezelCard
              item={heroItem}
              isHero={true}
              aspectClass="aspect-[4/5] sm:aspect-[16/13] lg:aspect-auto lg:h-full lg:min-h-[580px]"
              className="h-full"
            />
          </div>

          {/* Interlocked Companion Atelier (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Top Wide Showcase: Necklaces */}
            <DoubleBezelCard
              item={necklaceItem}
              aspectClass="aspect-[16/9] sm:aspect-[16/9]"
              className="w-full"
            />

            {/* Bottom Equal Duet: Earrings + Bangles & Bracelets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 flex-1">
              <DoubleBezelCard
                item={earringsItem}
                aspectClass="aspect-[4/5] sm:aspect-[4/5]"
                className="w-full"
              />
              <DoubleBezelCard
                item={banglesItem}
                aspectClass="aspect-[4/5] sm:aspect-[4/5]"
                className="w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* ─── ACT II: THE TRADITIONS & ACCENTS SALON (4 Curated Cards) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A8A8E]">
              Curated Heritage & Specialist Ateliers
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-[#C9A05B] font-mono">
              Chapters V – VIII
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {SECONDARY_COLLECTIONS.map((item) => (
              <DoubleBezelCard
                key={item.id}
                item={item}
                aspectClass="aspect-[4/5]"
                className="w-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

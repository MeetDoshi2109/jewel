'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CollectionItem {
  id: string
  num: string
  roman: string
  title: string
  subtitle: string
  heroTitle: string
  description: string
  hallmark: string
  spec: string
  href: string
  src: string
  hover: string
  accent: string
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'rings',
    num: '01',
    roman: 'I',
    title: 'Rings',
    subtitle: 'Solitaires & Bands',
    heroTitle: 'The Solitaire Atelier',
    description:
      'Conflict-free natural diamonds and hand-carved 18-karat gold bands engineered for eternity. Each piece is hand-finished in our Jaipur atelier.',
    hallmark: '18K SOLID GOLD · VVS1 CLARITY',
    spec: 'Certified Natural Solitaires',
    href: '/collections/rings',
    src: '/images/2ring.jpg',
    hover: '/images/4.jpg',
    accent: '#C9A05B',
  },
  {
    id: 'necklaces',
    num: '02',
    roman: 'II',
    title: 'Necklaces',
    subtitle: 'Chokers & Heirlooms',
    heroTitle: 'High Jewellery Chains',
    description:
      'Inspired by Rajput royal courts, sculpted with cascading gold florets and luminous South Sea pearls that drape like liquid silk across the collarbone.',
    hallmark: '22K ROYAL FILIGREE · PEARL ACCENTS',
    spec: 'Artisan Collar Draping',
    href: '/collections/necklaces',
    src: '/images/necklace.jpg',
    hover: '/images/3.jpg',
    accent: '#B76E79',
  },
  {
    id: 'earrings',
    num: '03',
    roman: 'III',
    title: 'Earrings',
    subtitle: 'Chandbalis & Drops',
    heroTitle: 'Architectural Drops',
    description:
      'Weightless articulated movement featuring interlocking geometric halos paved with precision-cut diamonds for uninterrupted light refraction.',
    hallmark: 'HAND-SET PAVÉ PRONGS',
    spec: 'Feather-Light Balance',
    href: '/collections/earrings',
    src: '/images/5.jpg',
    hover: '/images/6.jpg',
    accent: '#C9A05B',
  },
  {
    id: 'bangles',
    num: '04',
    roman: 'IV',
    title: 'Bangles',
    subtitle: 'Kadas & Tennis Cuffs',
    heroTitle: 'Sculptural Wristwear',
    description:
      'Articulated hinged kadas and continuous diamond tennis bracelets engineered with discreet safety clasps for effortless day-to-evening opulence.',
    hallmark: 'MICRO-PAVÉ DIAMOND SET',
    spec: 'Seamless Safety Hinge',
    href: '/collections/bangles',
    src: '/images/6.jpg',
    hover: '/images/7.jpg',
    accent: '#A8823A',
  },
  {
    id: 'mangalsutra',
    num: '05',
    roman: 'V',
    title: 'Mangalsutra',
    subtitle: 'Sacred Heirlooms',
    heroTitle: 'Auspicious Heirlooms',
    description:
      'Reimagining sacred vows with minimalist solitaire diamonds and artisan-strung auspicious black beads that honor ancestral traditions.',
    hallmark: 'BRIDAL SANCTUM EDITION',
    spec: 'Solid Gold & Black Spinel',
    href: '/collections/mangalsutra',
    src: '/images/mangalsutra.jpg',
    hover: '/images/necklace.jpg',
    accent: '#C9A05B',
  },
  {
    id: 'anklets',
    num: '06',
    roman: 'VI',
    title: 'Anklets',
    subtitle: 'Payals & Charms',
    heroTitle: 'Whisper Payals',
    description:
      'Chime-free delicate gold chains adorned with bezel-set emerald droplets and teardrop charms that chime only with silent poetic elegance.',
    hallmark: 'EVERYDAY FEATHERWEIGHT',
    spec: 'Hypoallergenic Solid Gold',
    href: '/collections/anklets',
    src: '/images/8.jpg',
    hover: '/images/9.jpg',
    accent: '#B76E79',
  },
  {
    id: 'nosepins',
    num: '07',
    roman: 'VII',
    title: 'Nose Pins',
    subtitle: 'Solitaire Accents',
    heroTitle: 'Solitaire Studs',
    description:
      'Micro-diamond solitaires and traditional South Asian floral press pins cast with hypoallergenic solid gold stems for supreme comfort.',
    hallmark: 'NATURAL SOLITAIRE BRILLIANCE',
    spec: 'Hand-Polished Stems',
    href: '/collections/nosepins',
    src: '/images/9.jpg',
    hover: '/images/2.webp',
    accent: '#C9A05B',
  },
  {
    id: 'mens',
    num: '08',
    roman: 'VIII',
    title: "Men's",
    subtitle: 'Sovereign Heritage',
    heroTitle: 'Sovereign Atelier',
    description:
      'Substantial curb link chains, hand-engraved brushed signet rings, and solid gold kada cuffs engineered for understated power.',
    hallmark: 'MATTE & POLISHED DUO-TONE',
    spec: 'Heavy Gauge Solid Castings',
    href: '/collections/mens',
    src: '/images/7.jpg',
    hover: '/images/8.jpg',
    accent: '#8A8A8E',
  },
]

export default function CollectionsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-60px' })
  const [activeIndex, setActiveIndex] = useState(0)

  const activeItem = COLLECTIONS[activeIndex]

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 bg-[#F2EBE0] relative overflow-hidden"
    >
      {/* Background Architectural Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none texture-engrave"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3.5">
              <span className="w-10 h-[1.5px] bg-[#C9A05B]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A05B] font-semibold">
                Haute Joaillerie Atelier
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.4rem,5.5vw,5rem)] text-[#1C1C1E] leading-[0.94] tracking-[-0.025em]">
              Jewellery for<br />
              <em className="italic font-light">every chapter.</em>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-xs sm:text-sm text-[#8A8A8E] max-w-xs leading-relaxed md:text-right font-light">
              Select an atelier below to immerse into bespoke Jaipur craftsmanship and gemstone archives.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A05B]">
              <span>ATELIER ARCHIVE</span>
              <span>•</span>
              <span>{activeItem.num} OF 08</span>
            </div>
          </div>
        </motion.div>

        {/* ─── ACT I: THE HIGH JEWELLERY EXHIBITION STAGE ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-14">
          {/* Main Exhibition Stage (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-2 sm:p-2.5 rounded-[2.5rem] bg-white/60 backdrop-blur-md border border-[#E8DDD0] shadow-[0_20px_60px_rgba(0,0,0,0.04)] h-full flex flex-col">
              <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] overflow-hidden rounded-[calc(2.5rem-0.625rem)] bg-[#1C1C1E]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    {/* Primary Piece Photography */}
                    <Image
                      src={activeItem.src}
                      alt={activeItem.heroTitle}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />

                    {/* Dark Dramatic Scrim Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/95 via-[#1C1C1E]/30 to-black/20" />

                    {/* Ambient Gold Radial Flare */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 65% 85%, ${activeItem.accent}35 0%, transparent 65%)`,
                      }}
                    />

                    {/* Top Floating Badge Bar */}
                    <div className="absolute top-6 inset-x-6 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/80 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                        {activeItem.hallmark}
                      </span>
                      <span className="font-serif text-lg tracking-widest text-[#C9A05B] font-light">
                        {activeItem.roman}
                      </span>
                    </div>

                    {/* Bottom Editorial Content Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      <div className="max-w-md">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A05B] font-semibold block mb-1.5">
                          CHAPTER {activeItem.roman} · {activeItem.subtitle}
                        </span>
                        <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-[1.02] tracking-tight">
                          {activeItem.heroTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 font-light mt-2.5 leading-relaxed line-clamp-3">
                          {activeItem.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-[11px] text-[#C9A05B] font-mono">
                          <ShieldCheck size={13} />
                          <span>{activeItem.spec}</span>
                        </div>
                      </div>

                      {/* Nested Button-in-Button CTA */}
                      <Link
                        href={activeItem.href}
                        className="inline-flex items-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-[#C9A05B] hover:text-white transition-all duration-300 shadow-xl group/btn self-start sm:self-auto shrink-0"
                      >
                        <span>Explore {activeItem.title}</span>
                        <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                          <ArrowUpRight size={14} />
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Interactive Collection Rail (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DDD0]">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-gray-500">
                Atelier Catalog
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Click to Preview</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5">
              {COLLECTIONS.map((item, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      'text-left p-3 sm:p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 border group',
                      isActive
                        ? 'bg-white border-[#C9A05B] shadow-md'
                        : 'bg-white/40 hover:bg-white/80 border-[#E8DDD0]/70'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/60">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-400">{item.num}</span>
                          <span className="font-serif text-sm font-semibold text-gray-900 truncate">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActive && (
                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#C9A05B]/15 text-[#96722D] font-bold">
                          Active
                        </span>
                      )}
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                          isActive
                            ? 'bg-[#C9A05B] text-white'
                            : 'text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100'
                        )}
                      >
                        <ChevronRight size={13} />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ─── ACT II: COMPLETE LOOKBOOK DIRECT LINK STRIP ─── */}
        <div>
          <div className="flex items-center justify-between mb-5 border-t border-[#E8DDD0] pt-8">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1C1C1E]">
              All 8 Signature Collections
            </h3>
            <Link
              href="/collections"
              className="text-xs text-[#C9A05B] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Entire Catalogue</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {COLLECTIONS.map((c, i) => (
              <Link
                key={c.id}
                href={c.href}
                className="group p-2 bg-white/70 hover:bg-white rounded-2xl border border-[#E8DDD0] hover:border-[#C9A05B] transition-all flex flex-col items-center text-center shadow-2xs hover:shadow-md"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                  <Image
                    src={c.src}
                    alt={c.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
                <span className="text-[9px] font-mono text-gray-400">{c.num}</span>
                <span className="font-serif text-xs font-semibold text-gray-900 truncate w-full group-hover:text-[#C9A05B] transition-colors">
                  {c.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { CATEGORIES, cn } from '@/lib/utils'

interface CategoryMeta {
  src: string
  hover: string
  accent: string
  tagline: string
  tier: 'signature' | 'tradition'
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  rings: {
    src: '/images/2ring.jpg',
    hover: '/images/4.jpg',
    accent: '#C9A05B',
    tagline: 'Solitaires, Bands & Cocktail Rings',
    tier: 'signature',
  },
  necklaces: {
    src: '/images/necklace.jpg',
    hover: '/images/3.jpg',
    accent: '#B76E79',
    tagline: 'Chokers, Chains & Majestic Pendants',
    tier: 'signature',
  },
  earrings: {
    src: '/images/5.jpg',
    hover: '/images/6.jpg',
    accent: '#C9A05B',
    tagline: 'Studs, Drops, Jhumkas & Chandbalis',
    tier: 'signature',
  },
  bangles: {
    src: '/images/6.jpg',
    hover: '/images/7.jpg',
    accent: '#A8823A',
    tagline: 'Kadas, Cuffs & Diamond Tennis Bangles',
    tier: 'signature',
  },
  mangalsutra: {
    src: '/images/mangalsutra.jpg',
    hover: '/images/necklace.jpg',
    accent: '#C9A05B',
    tagline: 'Sacred Auspicious Heirlooms',
    tier: 'tradition',
  },
  anklets: {
    src: '/images/8.jpg',
    hover: '/images/9.jpg',
    accent: '#B76E79',
    tagline: 'Delicate Gold Payals & Charms',
    tier: 'tradition',
  },
  nosepins: {
    src: '/images/9.jpg',
    hover: '/images/2.webp',
    accent: '#C9A05B',
    tagline: 'Diamond & Solid Gold Studs',
    tier: 'tradition',
  },
  mens: {
    src: '/images/7.jpg',
    hover: '/images/8.jpg',
    accent: '#8A8A8E',
    tagline: 'Bold Chains, Signet Rings & Kadas',
    tier: 'tradition',
  },
}

function CategoryCard({
  category,
  index,
}: {
  category: typeof CATEGORIES[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const meta = CATEGORY_META[category.value] || CATEGORY_META.rings
  const [hovered, setHovered] = useState(false)

  /* Per-card 3D tilt */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const tiltX = useSpring(rawX, { stiffness: 280, damping: 25 })
  const tiltY = useSpring(rawY, { stiffness: 280, damping: 25 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set(((e.clientY - rect.top) / rect.height - 0.5) * -8)
    rawY.set(((e.clientX - rect.left) / rect.width - 0.5) * 8)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="w-full min-w-0"
    >
      <Link
        href={`/collections/${category.value}`}
        data-cursor="Shop"
        className="group block w-full h-full"
      >
        <motion.div
          ref={cardRef}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#E8DDD0] shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-[#C9A05B]/40 border border-transparent"
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d', transformPerspective: 900 }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onMouseEnter={() => setHovered(true)}
        >
          {/* Primary piece image */}
          <Image
            src={meta.src}
            alt={category.label}
            fill
            className={cn(
              'object-cover transition-all duration-700 ease-out group-hover:scale-108',
              hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Hover cross-fade alternate editorial photo */}
          <Image
            src={meta.hover}
            alt={`${category.label} lifestyle`}
            fill
            className={cn(
              'object-cover absolute inset-0 transition-all duration-700 ease-out group-hover:scale-108',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Dark cinematic vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/90 via-[#1C1C1E]/30 to-black/10 transition-opacity duration-300" />

          {/* Hover radial gold glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 85%, ${meta.accent}33 0%, transparent 65%)`,
            }}
          />

          {/* Top Header inside card: Index number & subtle pill */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#FAF6F0] bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Piece
            </span>
          </div>

          {/* Bottom Card Details */}
          <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 block"
                style={{ color: meta.accent }}
              >
                {category.emoji} &nbsp;{category.label}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight truncate">
                {category.label}
              </h3>
              <p className="text-[11px] text-white/70 font-light mt-1 line-clamp-1">
                {meta.tagline}
              </p>
            </div>

            {/* Floating Action Arrow */}
            <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 text-white group-hover:bg-[#C9A05B] group-hover:border-[#C9A05B] group-hover:rotate-45 transition-all duration-300 shadow-md">
              <ArrowUpRight size={15} />
            </div>
          </div>

          {/* Bottom gold accent hairline on hover */}
          <div
            className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 ease-out"
            style={{ background: `linear-gradient(90deg, ${meta.accent}, transparent)` }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function CollectionsShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [filter, setFilter] = useState<'all' | 'signature' | 'tradition'>('all')

  const filteredCategories = CATEGORIES.filter((cat) => {
    if (filter === 'all') return true
    const meta = CATEGORY_META[cat.value]
    return meta?.tier === filter
  })

  return (
    <section ref={ref} className="py-[var(--section-y)] bg-[#F2EBE0] relative overflow-hidden">
      {/* Texture background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none texture-engrave" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-[#C9A05B]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A05B] font-semibold">
                Haute Horlogerie & Joaillerie
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2.4rem,4.5vw,4.5rem)] text-[#1C1C1E] leading-[0.95] tracking-[-0.02em]">
              Jewellery for<br />
              <em className="italic font-light">every chapter.</em>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center p-1 bg-white/70 backdrop-blur-md rounded-full border border-[#E8DDD0] shadow-2xs self-start sm:self-auto">
              {[
                { key: 'all', label: 'All Collections (8)' },
                { key: 'signature', label: 'Signatures' },
                { key: 'tradition', label: 'Traditions' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as 'all' | 'signature' | 'tradition')}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300',
                    filter === tab.key
                      ? 'bg-[#1C1C1E] text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              href="/collections"
              className="text-xs uppercase tracking-wider font-semibold text-[#C9A05B] hover:text-[#A8823A] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              Catalogue <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* 4-Column Balanced Luxury Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredCategories.map((cat, i) => (
              <CategoryCard key={cat.value} category={cat} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

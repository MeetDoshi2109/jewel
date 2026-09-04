'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { CATEGORIES } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────
// All images: Unsplash License — free for commercial use
// https://unsplash.com/license
// Images are curated to match each category's visual identity.
// ─────────────────────────────────────────────────────────────────
const categoryImages: Record<string, { src: string; hover: string; accent: string }> = {
  rings: {
    src:    '/images/2ring.jpg',
    hover:  '/images/4.jpg',
    accent: '#C9A05B',
  },
  necklaces: {
    src:    '/images/necklace.jpg',
    hover:  '/images/3.jpg',
    accent: '#B76E79',
  },
  earrings: {
    src:    '/images/5.jpg',
    hover:  '/images/6.jpg',
    accent: '#C9A05B',
  },
  bangles: {
    src:    '/images/6.jpg',
    hover:  '/images/7.jpg',
    accent: '#A8823A',
  },
  mangalsutra: {
    src:    '/images/mangalsutra.jpg',
    hover:  '/images/necklace.jpg',
    accent: '#C9A05B',
  },
  anklets: {
    src:    '/images/8.jpg',
    hover:  '/images/9.jpg',
    accent: '#B76E79',
  },
  nosepins: {
    src:    '/images/9.jpg',
    hover:  '/images/2.webp',
    accent: '#C9A05B',
  },
  mens: {
    src:    '/images/7.jpg',
    hover:  '/images/8.jpg',
    accent: '#8A8A8E',
  },
}

/* Layout config: first card is hero-tall, rest are uniform */
const LAYOUTS = [
  { colSpan: 'lg:col-span-2', rowSpan: 'row-span-2', aspect: 'aspect-[4/5]' },
  { colSpan: '',               rowSpan: '',            aspect: 'aspect-[3/4]' },
  { colSpan: '',               rowSpan: '',            aspect: 'aspect-[3/4]' },
  { colSpan: 'lg:col-span-2', rowSpan: '',            aspect: 'aspect-[16/7]' },
  { colSpan: '',               rowSpan: '',            aspect: 'aspect-[3/4]' },
  { colSpan: '',               rowSpan: '',            aspect: 'aspect-[3/4]' },
  { colSpan: '',               rowSpan: '',            aspect: 'aspect-[3/4]' },
  { colSpan: '',               rowSpan: '',            aspect: 'aspect-[3/4]' },
]

function CategoryCard({
  category,
  index,
  layout,
}: {
  category: typeof CATEGORIES[0]
  index: number
  layout: typeof LAYOUTS[0]
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { src, hover, accent } = categoryImages[category.value] || categoryImages.rings
  const [hovered, setHovered] = useState(false)

  /* Per-card 3D tilt */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const tiltX = useSpring(rawX, { stiffness: 300, damping: 30 })
  const tiltY = useSpring(rawY, { stiffness: 300, damping: 30 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set(((e.clientY - rect.top)  / rect.height - 0.5) * -10)
    rawY.set(((e.clientX - rect.left) / rect.width  - 0.5) *  10)
  }
  const onLeave = () => { rawX.set(0); rawY.set(0); setHovered(false) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`${layout.colSpan} ${layout.rowSpan}`}
    >
      <Link
        href={`/collections/${category.value}`}
        data-cursor="Shop"
        className="group block h-full"
      >
        <motion.div
          ref={cardRef}
          className={`relative ${layout.aspect} h-full overflow-hidden rounded-2xl cursor-none`}
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d', transformPerspective: 900 }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onMouseEnter={() => setHovered(true)}
        >
          {/* Primary image */}
          <Image
            src={src}
            alt={category.label}
            fill
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] ${hovered ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          />
          {/* Hover image cross-fade */}
          <Image
            src={hover}
            alt={`${category.label} alternate`}
            fill
            className={`object-cover absolute inset-0 transition-all duration-700 ease-out group-hover:scale-[1.06] ${hovered ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          />

          {/* Dark scrim gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/80 via-[#1C1C1E]/15 to-transparent" />

          {/* Mouse-reactive colour tint */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse at 60% 80%, ${accent}22 0%, transparent 60%)` }}
          />

          {/* Top-right index number */}
          <div className="absolute top-4 right-5 font-serif text-[11px] text-white/30 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-1.5" style={{ color: accent }}>
                {category.emoji} &nbsp;{category.label.toUpperCase()}
              </p>
              <p className="font-serif text-xl md:text-2xl text-white leading-tight">
                {category.label}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                            transition-all duration-350 ease-out flex-shrink-0">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </div>

          {/* Gold bottom border on hover */}
          <div
            className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function CollectionsShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-[var(--section-y)] bg-[#F2EBE0] relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none texture-engrave" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="rule-gold" />
              <span className="eyebrow">Collections</span>
            </div>
            <h2 className="font-serif text-[clamp(2.8rem,5vw,5rem)] text-[#1C1C1E] leading-[0.92] tracking-[-0.025em]">
              Jewellery for<br /><em>every chapter.</em>
            </h2>
          </div>
          <p className="text-sm text-[#8A8A8E] max-w-xs leading-relaxed md:text-right font-light">
            Eight distinct collections, from delicate everyday
            adornments to ceremonial heirlooms.
          </p>
        </motion.div>

        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.value}
              category={cat}
              index={i}
              layout={LAYOUTS[i] || LAYOUTS[1]}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

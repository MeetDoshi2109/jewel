'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { ArrowUpRight } from 'lucide-react'

const STATS = [
  { value: '15+',  label: 'Years of craft',    sub: 'Est. 2009, Jaipur' },
  { value: '50K+', label: 'Pieces created',    sub: 'Across 8 collections' },
  { value: '4.9',  label: 'Average rating',    sub: 'From 12,000+ reviews' },
  { value: '2',    label: 'Flagship stores',   sub: 'Mumbai & Delhi' },
]

const PROCESS_STEPS = [
  { n: '01', title: 'Sketch & Design',  body: 'Every piece begins as a pencil drawing in our Jaipur atelier, refined until the proportions sing.' },
  { n: '02', title: 'Wax Carving',      body: 'Master craftspeople carve the design in wax — a technique unchanged for four centuries.' },
  { n: '03', title: 'Lost-Wax Casting', body: 'The wax model is encased in plaster and molten gold poured in, replacing wax with metal.' },
  { n: '04', title: 'Stone Setting',    body: 'Setters individually place each stone by hand, ensuring perfect alignment and maximum brilliance.' },
]

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef    = useRef(null)
  const statsRef   = useRef(null)
  const textInView  = useInView(textRef,  { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  /* Scroll parallax on the image */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  /* Mouse parallax on small accent image */
  const { x: mx, y: my } = useMouseParallax({ strength: 16 })

  return (
    <section ref={sectionRef} className="relative bg-[#1C1C1E] overflow-hidden">

      {/* ── Background: fine engraving texture ── */}
      <div className="absolute inset-0 opacity-[0.03] texture-engrave pointer-events-none" aria-hidden="true" />

      {/* ── Gold blob accent ── */}
      <div
        className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl pointer-events-none animate-blob-delay opacity-20"
        style={{ background: 'radial-gradient(circle, #C9A05B 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      {/* ═══ PART 1: FULL-BLEED SPLIT ═══════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* Image column */}
        <div className="relative overflow-hidden min-h-[50vh] lg:min-h-0">
          <motion.div className="absolute inset-0" style={{ y: imgY }}>
            <Image
              src="/images/necklace.jpg"
              alt="Aurelia artisan crafting jewellery by hand"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1C1E]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/50 to-transparent lg:hidden" />
          </motion.div>

          {/* Floating accent badge */}
          <motion.div
            style={{ x: mx, y: my }}
            className="absolute bottom-8 left-8 bg-[#C9A05B] p-5 rounded-2xl shadow-2xl hidden md:block"
          >
            <p className="font-serif text-4xl text-white leading-none">100%</p>
            <p className="eyebrow text-white/75 mt-2">Ethically sourced</p>
          </motion.div>
        </div>

        {/* Text column */}
        <div ref={textRef} className="flex items-center px-8 md:px-14 lg:px-16 py-20 lg:py-24">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={textInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="rule-gold" />
              <span className="eyebrow">Our Story</span>
            </motion.div>

            {/* Big headline */}
            <div className="overflow-hidden mb-2">
              <motion.h2
                initial={{ y: 80 }}
                animate={textInView ? { y: 0 } : {}}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(2.8rem,4.5vw,4.5rem)] text-[#FAF6F0] leading-[0.95] tracking-[-0.025em]"
              >
                Jewellery that
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h2
                initial={{ y: 80 }}
                animate={textInView ? { y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(2.8rem,4.5vw,4.5rem)] italic text-gold-gradient leading-[0.95] tracking-[-0.025em]"
              >
                tells your story.
              </motion.h2>
            </div>

            {/* Body paragraphs */}
            {[
              'Aurelia was born from a single conviction: that fine jewellery should be worn every day — not locked away for occasions that never come.',
              'Our artisans in Jaipur blend centuries-old goldsmithing with contemporary design, creating pieces that feel both timeless and entirely modern.',
              'From our ateliers to our flagship stores in Mumbai and Delhi, every Aurelia piece is made with intention — to be worn, passed down, and cherished across generations.',
            ].map((t, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                className="text-[14px] text-[#8A8A8E] leading-[1.8] mb-4 font-light"
              >
                {t}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={textInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 mt-2 text-[11px] tracking-[0.22em] uppercase text-[#C9A05B] border-b border-[#C9A05B]/30 pb-1 hover:border-[#C9A05B] transition-colors"
              >
                Read Our Full Story
                <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Gold divider ── */}
      <div className="divider-gold mx-auto max-w-[1400px] px-16 opacity-20" />

      {/* ═══ PART 2: STATS GRID ══════════════════════════════════ */}
      <div ref={statsRef} className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#2A2A2C]">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="lg:px-10 first:pl-0 last:pr-0 flex flex-col"
            >
              <p className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] text-[#C9A05B] leading-none mb-2 tabular-nums">{s.value}</p>
              <p className="text-sm font-medium text-[#FAF6F0] mb-1">{s.label}</p>
              <p className="text-[11px] text-[#8A8A8E]">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Gold divider ── */}
      <div className="divider-gold mx-auto max-w-[1400px] px-16 opacity-20" />

      {/* ═══ PART 3: CRAFTSMANSHIP PROCESS ══════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="flex items-center gap-3 mb-12">
          <span className="rule-gold" />
          <span className="eyebrow">The Process</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative"
            >
              {/* Connector line */}
              {i < PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-[1px] bg-[#2A2A2C] z-0" />
              )}
              <div className="relative z-10">
                <p className="font-serif text-[3rem] leading-none text-[#2A2A2C] group-hover:text-[#C9A05B]/30 transition-colors duration-500 tabular-nums mb-4">
                  {step.n}
                </p>
                <h3 className="font-serif text-lg text-[#FAF6F0] mb-3">{step.title}</h3>
                <p className="text-[13px] text-[#8A8A8E] leading-[1.75] font-light">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  )
}

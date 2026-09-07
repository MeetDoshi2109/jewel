'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const TESTIMONIALS = [
  {
    id: 1, avatar: 'PS', name: 'Priya Sharma', location: 'Mumbai', rating: 5,
    product: 'Diamond Solitaire Pendant',
    text: "The piece itself is breathtaking — the photography doesn't do it justice. It's become something I literally never take off. Every element of the Aurelia experience was flawless, from the first click to the moment I opened the box.",
  },
  {
    id: 2, avatar: 'MK', name: 'Meera Krishnan', location: 'Bangalore', rating: 5,
    product: 'Royal Kundan Choker',
    text: "The Kundan Choker I reserved for my wedding was extraordinary. The meenakari work on the reverse is as beautiful as the front — you can tell these pieces are made by people who care deeply about their craft.",
  },
  {
    id: 3, avatar: 'AR', name: 'Ananya Reddy', location: 'Hyderabad', rating: 5,
    product: 'Pearl Drop Earrings',
    text: "Aurelia genuinely feels different from every other jewellery brand I've tried. The packaging alone made my husband feel like he'd bought something from a Parisian boutique. I'll never shop anywhere else.",
  },
  {
    id: 4, avatar: 'KN', name: 'Kavita Nair', location: 'Kochi', rating: 4,
    product: 'Crescent Moon Pendant',
    text: "The quality-to-price ratio is unmatched. My Crescent Moon Pendant looks more expensive than items I've bought for three times the price elsewhere. I've recommended Aurelia to everyone I know.",
  },
  {
    id: 5, avatar: 'RK', name: 'Rahul Kapoor', location: 'Delhi', rating: 5,
    product: 'Bold Chain Necklace',
    text: "Bought the Bold Chain from the Men's range. Arrived in two days, looked exactly like the product photos. The staff responded to my sizing query within an hour. The service matches the quality of the jewellery.",
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12}
          className={i <= rating ? 'fill-[#C9A05B] text-[#C9A05B]' : 'text-[#3A3A3C]'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const { x: mx, y: my } = useMouseParallax({ strength: 12 })

  /* Auto-advance */
  useEffect(() => {
    const id = setInterval(() => {
      setDir(1)
      setActive(a => (a + 1) % TESTIMONIALS.length)
    }, 5500)
    return () => clearInterval(id)
  }, [])

  const go = (next: number) => {
    setDir(next > active ? 1 : -1)
    setActive(next)
  }
  const prev = () => go((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => go((active + 1) % TESTIMONIALS.length)

  const t = TESTIMONIALS[active]

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#FAF6F0] overflow-hidden py-[var(--section-y)]"
    >
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.025] texture-engrave pointer-events-none" aria-hidden="true" />

      {/* Giant faded numeral background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-serif text-[clamp(16rem,40vw,36rem)] text-[#F2EBE0] leading-none tabular-nums tracking-tighter"
            style={{ lineHeight: 1 }}
          >
            {String(active + 1).padStart(2, '0')}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="rule-gold" />
              <span className="eyebrow">Testimonials</span>
            </div>
            <h2 className="font-serif text-[clamp(2.8rem,5vw,5rem)] text-[#1C1C1E] leading-[0.92] tracking-[-0.025em]">
              Worn and loved<br /><em>across India.</em>
            </h2>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-12 h-12 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#1C1C1E] hover:border-[#C9A05B] hover:text-[#C9A05B] transition-colors duration-250 group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="w-12 h-12 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#1C1C1E] hover:border-[#C9A05B] hover:text-[#C9A05B] transition-colors duration-250 group"
            >
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>

        {/* Main featured testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">

          {/* Quote block */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Opening quote mark */}
                <p className="font-serif text-[6rem] leading-none text-[#C9A05B]/20 select-none -mb-4">&ldquo;</p>

                <p className="font-serif text-[clamp(1.3rem,2.5vw,2.1rem)] text-[#1C1C1E] leading-[1.45] tracking-[-0.01em] mb-8">
                  {t.text}
                </p>

                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #C9A05B, #A8823A)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">{t.name}</p>
                    <p className="text-xs text-[#8A8A8E] mt-0.5">{t.location} · {t.product}</p>
                  </div>
                  <div className="ml-auto">
                    <Stars rating={t.rating} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: thumbnail list */}
          <div className="lg:col-span-5 space-y-3">
            {TESTIMONIALS.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => go(i)}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
                className={`
                  w-full text-left px-5 py-4 rounded-xl border transition-all duration-300
                  ${i === active
                    ? 'bg-[#1C1C1E] border-[#1C1C1E] shadow-lg'
                    : 'bg-white border-[#E8DDD0] hover:border-[#C9A05B]/40'}
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Stars rating={item.rating} />
                    </div>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${i === active ? 'text-[#FAF6F0]' : 'text-[#1C1C1E]'}`}>
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-medium mt-0.5 ${i === active ? 'text-[#C9A05B]' : 'text-[#8A8A8E]'}`}>
                    {item.avatar}
                  </span>
                </div>
                <p className={`text-[10px] mt-2 tracking-wide ${i === active ? 'text-[#8A8A8E]' : 'text-[#AEAEB2]'}`}>
                  {item.name} · {item.location}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to review ${i + 1}`}
              className="flex-1 h-[2px] rounded-full overflow-hidden bg-[#E8DDD0] relative"
            >
              {i === active && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#C9A05B]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5.5, ease: 'linear' }}
                />
              )}
              {i < active && <div className="absolute inset-0 bg-[#C9A05B]/40" />}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}

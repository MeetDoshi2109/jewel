'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import MarqueeTicker from '@/components/ui/MarqueeTicker'

const PREMIUM_ITEMS = [
  { label: 'Diamond Rings',       price: 'from ₹14,999', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80' },
  { label: 'Gold Necklaces',      price: 'from ₹12,500', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
  { label: 'Kundan Chokers',      price: 'from ₹24,000', img: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500&q=80' },
  { label: 'Diamond Earrings',    price: 'from ₹12,999', img: 'https://images.unsplash.com/photo-1630350434070-e9a27b89e4a9?w=500&q=80' },
]

export default function PremiumBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef(null)
  const inView = useInView(textRef, { once: true, margin: '-60px' })

  const { x: mx, y: my } = useMouseParallax({ strength: 14 })

  return (
    <section ref={sectionRef} className="relative bg-[#1C1C1E] overflow-hidden">

      {/* ── Top ticker ── */}
      <MarqueeTicker dark />

      {/* ── Fine texture ── */}
      <div className="absolute inset-0 opacity-[0.03] texture-engrave pointer-events-none" aria-hidden="true" />

      {/* ── Large gold accent blob ── */}
      <motion.div
        style={{ x: mx, y: my, background: 'radial-gradient(circle, #C9A05B 0%, transparent 65%)' }}
        className="absolute top-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full blur-3xl pointer-events-none opacity-[0.08]"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">

        {/* ── Header ── */}
        <div ref={textRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="rule-gold" />
              <span className="eyebrow">Premium Collection</span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3rem,5.5vw,5.5rem)] text-[#FAF6F0] leading-[0.9] tracking-[-0.03em]"
              >
                Investment pieces.<br />
                <em className="text-gold-gradient">Heirloom quality.</em>
              </motion.h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.35 }}
          >
            <p className="text-[14px] text-[#8A8A8E] leading-[1.8] mb-8 font-light max-w-md">
              Our premium collection — pieces above ₹10,000 — represents the pinnacle
              of the Aurelia craft. Diamonds, solid 18k and 22k gold, and certified stones.
              Available exclusively via in-store reservation.
            </p>
            <Link
              href="/collections?filter=premium"
              data-cursor="Reserve"
              className="group inline-flex items-center gap-3 bg-[#C9A05B] hover:bg-[#A8823A] text-white px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-250 btn-shine"
            >
              Reserve Your Piece
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── 4-item showcase strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PREMIUM_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/collections?filter=premium"
                data-cursor="View"
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  sizes="(max-width:640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/85 via-[#1C1C1E]/20 to-transparent" />

                {/* Gold shimmer line on hover */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: 'linear-gradient(90deg, #C9A05B, transparent)' }} />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-serif text-lg text-[#FAF6F0] mb-0.5">{item.label}</p>
                  <p className="eyebrow text-[#C9A05B]">{item.price}</p>
                </div>

                {/* Reserve badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#C9A05B]/90 rounded-full">
                  <span className="eyebrow text-white text-[8px]">Reserve In-Store</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-center text-[11px] text-[#3A3A3C] tracking-wider"
        >
          All premium pieces require in-store consultation · No online payment taken
        </motion.p>

      </div>
    </section>
  )
}

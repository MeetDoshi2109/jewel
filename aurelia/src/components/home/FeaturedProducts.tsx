'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'

interface Props {
  products: Product[]
  title: string
  eyebrow: string
  viewAllHref: string
  dark?: boolean
}

export default function FeaturedProducts({ products, title, eyebrow, viewAllHref, dark = false }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const bg   = dark ? 'bg-[#1C1C1E]' : 'bg-[#FAF6F0]'
  const text = dark ? 'text-[#FAF6F0]' : 'text-[#1C1C1E]'
  const sub  = dark ? 'text-[#8A8A8E]' : 'text-[#8A8A8E]'

  return (
    <section ref={ref} className={`${bg} py-[var(--section-y)] relative overflow-hidden`}>
      {/* Texture on dark */}
      {dark && <div className="absolute inset-0 opacity-[0.025] texture-engrave pointer-events-none" aria-hidden="true" />}

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="rule-gold" />
              <span className="eyebrow">{eyebrow}</span>
            </div>
            <h2 className={`font-serif text-[clamp(2.6rem,4.5vw,4.5rem)] ${text} leading-[0.92] tracking-[-0.025em]`}>
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className={`group hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase ${sub} hover:text-[#C9A05B] transition-colors`}
          >
            <span className="underline-anim">View All</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Product grid — first item larger on large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile view-all */}
        <div className="flex md:hidden justify-center mt-10">
          <Link
            href={viewAllHref}
            className={`inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase border-b border-[#C9A05B] pb-0.5 ${text}`}
          >
            View All {eyebrow} <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </section>
  )
}

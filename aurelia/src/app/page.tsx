import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import CollectionsShowcase from '@/components/home/CollectionsShowcase'
import BrandStory from '@/components/home/BrandStory'
import Testimonials from '@/components/home/Testimonials'
import ScrollScene from '@/components/home/ScrollScene'
import ScrollBackground from '@/components/ui/ScrollBackground'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, inStock: true },
    take: 8,
    orderBy: { isBestseller: 'desc' },
  })
  return products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags: JSON.parse(p.tags || '[]'),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as Product[]
}

async function getBestsellers() {
  const products = await prisma.product.findMany({
    where: { isBestseller: true, inStock: true },
    take: 8,
    orderBy: { price: 'asc' },
  })
  return products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags: JSON.parse(p.tags || '[]'),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as Product[]
}

export default async function HomePage() {
  const [featured, bestsellers] = await Promise.all([getFeaturedProducts(), getBestsellers()])

  return (
    <>
      {/* Scroll-reactive background colour transitions */}
      <ScrollBackground />

      {/* Scene 1: Hero — warm ivory */}
      <div data-bg="#FAF6F0">
        <HeroSection />
      </div>

      {/* Featured products — ivory */}
      <section
        data-bg="#FAF6F0"
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-3">Handpicked</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C1C1E]">Featured Pieces</h2>
          </div>
          <Link
            href="/collections?filter=featured"
            className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-[#1C1C1E] hover:text-[#C9A05B] transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-child">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex sm:hidden justify-center mt-8">
          <Link
            href="/collections?filter=featured"
            className="text-xs tracking-widest uppercase border-b border-[#C9A05B] pb-0.5 text-[#1C1C1E]"
          >
            View All Featured
          </Link>
        </div>
      </section>

      {/* Collections showcase — soft blush */}
      <div data-bg="#F2EBE0">
        <CollectionsShowcase />
      </div>

      {/* GSAP scroll scenes — ivory / dark */}
      <div data-bg="#FAF6F0">
        <ScrollScene />
      </div>

      {/* Brand story — charcoal */}
      <div data-bg="#1C1C1E">
        <BrandStory />
      </div>

      {/* Bestsellers — back to ivory */}
      <section
        data-bg="#FAF6F0"
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-3">Most Loved</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C1C1E]">Bestsellers</h2>
          </div>
          <Link
            href="/collections?filter=bestseller"
            className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-[#1C1C1E] hover:text-[#C9A05B] transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-child">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Premium banner — deep charcoal */}
      <section
        data-bg="#1C1C1E"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1C1C1E] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23C9A05B' stroke-width='0.5'/%3E%3C/svg%3E")` }}
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-4">Exclusive</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#FAF6F0] mb-6">Our Premium Collection</h2>
          <p className="text-sm text-[#8A8A8E] max-w-lg mx-auto mb-8 leading-relaxed">
            Investment pieces above ₹10,000 — diamonds, solid gold, and certified fine jewellery. Reserve in-store for a personalised consultation and secure payment.
          </p>
          <Link
            href="/collections?filter=premium"
            className="inline-flex items-center gap-3 border border-[#C9A05B] text-[#C9A05B] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#C9A05B] hover:text-white transition-colors duration-300"
          >
            View Premium Pieces <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Testimonials — soft blush */}
      <div data-bg="#F2EBE0">
        <Testimonials />
      </div>
    </>
  )
}

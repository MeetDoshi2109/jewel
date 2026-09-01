import { prisma } from '@/lib/prisma'
import HeroSection        from '@/components/home/HeroSection'
import CollectionsShowcase from '@/components/home/CollectionsShowcase'
import BrandStory         from '@/components/home/BrandStory'
import Testimonials       from '@/components/home/Testimonials'
import ScrollScene        from '@/components/home/ScrollScene'
import ScrollBackground   from '@/components/ui/ScrollBackground'
import FeaturedProducts   from '@/components/home/FeaturedProducts'
import PremiumBanner      from '@/components/home/PremiumBanner'
import { Product } from '@/types'

async function getFeaturedProducts() {
  const rows = await prisma.product.findMany({
    where: { isFeatured: true, inStock: true },
    take: 8,
    orderBy: { isBestseller: 'desc' },
  })
  return rows.map(p => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags:   JSON.parse(p.tags   || '[]'),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as Product[]
}

async function getBestsellers() {
  const rows = await prisma.product.findMany({
    where: { isBestseller: true, inStock: true },
    take: 8,
    orderBy: { price: 'asc' },
  })
  return rows.map(p => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags:   JSON.parse(p.tags   || '[]'),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as Product[]
}

export default async function HomePage() {
  const [featured, bestsellers] = await Promise.all([
    getFeaturedProducts(),
    getBestsellers(),
  ])

  return (
    <>
      {/* Scroll-reactive body background */}
      <ScrollBackground />

      {/* ─── Scene 1: Hero ─────────────────────── */}
      <div data-bg="#FAF6F0">
        <HeroSection />
      </div>

      {/* ─── Featured pieces ───────────────────── */}
      <div data-bg="#FAF6F0">
        <FeaturedProducts
          products={featured}
          eyebrow="Handpicked"
          title="Featured Pieces"
          viewAllHref="/collections?filter=featured"
        />
      </div>

      {/* ─── Collections editorial grid ────────── */}
      <div data-bg="#F2EBE0">
        <CollectionsShowcase />
      </div>

      {/* ─── GSAP Scroll scenes (ring / horizontal / split) ── */}
      <div data-bg="#FAF6F0">
        <ScrollScene />
      </div>

      {/* ─── Brand story + process ─────────────── */}
      <div data-bg="#1C1C1E">
        <BrandStory />
      </div>

      {/* ─── Bestsellers ───────────────────────── */}
      <div data-bg="#FAF6F0">
        <FeaturedProducts
          products={bestsellers}
          eyebrow="Most Loved"
          title="Bestsellers"
          viewAllHref="/collections?filter=bestseller"
        />
      </div>

      {/* ─── Premium collection banner ─────────── */}
      <div data-bg="#1C1C1E">
        <PremiumBanner />
      </div>

      {/* ─── Testimonials ──────────────────────── */}
      <div data-bg="#FAF6F0">
        <Testimonials />
      </div>
    </>
  )
}

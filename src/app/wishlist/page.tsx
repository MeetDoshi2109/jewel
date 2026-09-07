'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWishlistStore } from '@/store/cart'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { Heart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function WishlistPage() {
  const { ids } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); return }
    setLoading(true)
    // Fetch all products and filter client-side (for simplicity)
    fetch('/api/products?limit=100')
      .then((r) => r.json())
      .then((d) => {
        setProducts((d.products || []).filter((p: Product) => ids.includes(p.id)))
        setLoading(false)
      })
  }, [ids])

  return (
    <div className="min-h-screen pt-24 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-[#1C1C1E]">Your Wishlist</h1>
          <p className="text-sm text-[#8A8A8E] mt-2">{ids.length} saved {ids.length === 1 ? 'piece' : 'pieces'}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#F2EBE0] rounded-lg mb-3" />
                <div className="h-3 bg-[#F2EBE0] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#F2EBE0] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : ids.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-[#F2EBE0] flex items-center justify-center mx-auto mb-5">
              <Heart size={28} className="text-[#C9A05B]" />
            </div>
            <h2 className="font-serif text-2xl text-[#1C1C1E] mb-3">Nothing saved yet</h2>
            <p className="text-sm text-[#8A8A8E] mb-8">Heart a piece to save it here for later.</p>
            <Link href="/collections" className="inline-flex items-center gap-2 bg-[#C9A05B] text-white px-6 py-3 text-xs tracking-widest uppercase">
              Browse the Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 stagger-child">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}

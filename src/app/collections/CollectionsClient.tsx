'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { cn, CATEGORIES } from '@/lib/utils'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const PRICE_RANGES = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10001, max: 999999 },
]

export default function CollectionsClient() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filterParam = searchParams.get('filter')
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt_desc')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [q] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)
  const [featured, setFeatured] = useState(filterParam === 'featured')
  const [bestseller, setBestseller] = useState(filterParam === 'bestseller')
  const [premiumOnly, setPremiumOnly] = useState(filterParam === 'premium')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (q) params.set('q', q)
      params.set('sort', sort)
      params.set('page', String(page))
      if (priceRange) {
        params.set('minPrice', String(priceRange.min))
        params.set('maxPrice', String(priceRange.max))
      }
      if (featured) params.set('featured', 'true')
      if (bestseller) params.set('bestseller', 'true')
      if (premiumOnly) params.set('minPrice', '10001')

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [category, q, sort, page, priceRange, featured, bestseller, premiumOnly])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const clearFilters = () => {
    setCategory(''); setPriceRange(null)
    setFeatured(false); setBestseller(false); setPremiumOnly(false)
    setSort('createdAt_desc'); setPage(1)
  }

  const activeFiltersCount =
    (category ? 1 : 0) + (priceRange ? 1 : 0) + (featured ? 1 : 0) + (bestseller ? 1 : 0) + (premiumOnly ? 1 : 0)

  const pageLabel = category
    ? CATEGORIES.find((c) => c.value === category)?.label || category
    : q ? `Search: "${q}"` : 'All Collections'

  return (
    <div className="pt-20 min-h-screen bg-[#FAF6F0]">
      {/* Header */}
      <div className="bg-[#F2EBE0] py-14 px-4 text-center mb-8">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-3">Explore</p>
        <h1 className="font-serif text-5xl text-[#1C1C1E]">{pageLabel}</h1>
        <p className="text-sm text-[#8A8A8E] mt-3">{total} pieces</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 text-sm text-[#1C1C1E] border border-[#E8DDD0] rounded-full px-4 py-2 hover:border-[#C9A05B] transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C9A05B] text-white text-[9px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => { setCategory(''); setPage(1) }}
              className={cn(
                'flex-shrink-0 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-colors',
                !category ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]' : 'border-[#E8DDD0] text-[#8A8A8E] hover:border-[#C9A05B]'
              )}
            >All</button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); setPage(1) }}
                className={cn(
                  'flex-shrink-0 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap',
                  category === cat.value
                    ? 'bg-[#C9A05B] text-white border-[#C9A05B]'
                    : 'border-[#E8DDD0] text-[#8A8A8E] hover:border-[#C9A05B]'
                )}
              >{cat.label}</button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1) }}
              className="appearance-none text-xs text-[#1C1C1E] border border-[#E8DDD0] rounded-full px-4 py-2 pr-8 bg-white focus:outline-none focus:border-[#C9A05B] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8E] pointer-events-none" />
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white border border-[#E8DDD0] rounded-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#8A8A8E] mb-3">Price Range</p>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((r) => (
                        <label key={r.label} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio" name="price"
                            checked={priceRange?.min === r.min && priceRange?.max === r.max}
                            onChange={() => { setPriceRange({ min: r.min, max: r.max }); setPage(1) }}
                            className="accent-[#C9A05B]"
                          />
                          <span className="text-sm text-[#2D2D2F]">{r.label}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="price" checked={!priceRange} onChange={() => { setPriceRange(null); setPage(1) }} className="accent-[#C9A05B]" />
                        <span className="text-sm text-[#2D2D2F]">Any price</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#8A8A8E] mb-3">Special</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Featured', state: featured, setter: setFeatured },
                        { label: 'Bestseller', state: bestseller, setter: setBestseller },
                        { label: 'Premium (>₹10,000)', state: premiumOnly, setter: setPremiumOnly },
                      ].map(({ label, state, setter }) => (
                        <label key={label} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox" checked={state}
                            onChange={(e) => { setter(e.target.checked); setPage(1) }}
                            className="accent-[#C9A05B]"
                          />
                          <span className="text-sm text-[#2D2D2F]">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 mt-4 text-xs text-[#B76E79]">
                    <X size={12} /> Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#F2EBE0] rounded-lg mb-3" />
                <div className="h-3 bg-[#F2EBE0] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#F2EBE0] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-[#1C1C1E] mb-3">No pieces found</p>
            <p className="text-sm text-[#8A8A8E] mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="text-xs tracking-widest uppercase text-[#C9A05B] border-b border-[#C9A05B] pb-0.5">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 stagger-child">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {/* Pagination */}
        {total > 24 && (
          <div className="flex justify-center gap-2 mt-12 pb-8">
            {Array.from({ length: Math.ceil(total / 24) }, (_, i) => i + 1).map((p) => (
              <button
                key={p} onClick={() => setPage(p)}
                className={cn('w-9 h-9 text-sm rounded-full transition-colors', p === page ? 'bg-[#C9A05B] text-white' : 'text-[#8A8A8E] hover:text-[#1C1C1E]')}
              >{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

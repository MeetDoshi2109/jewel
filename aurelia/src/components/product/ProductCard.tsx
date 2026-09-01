'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { Product } from '@/types'
import WishlistButton from '@/components/ui/WishlistButton'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [addedFlash, setAddedFlash] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCartStore()

  const images = product.images || []
  const primaryImg = images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
  const secondaryImg = images[1] || primaryImg

  // 3D tilt on hover (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-5px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = ''
    setHovered(false)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.isPremium) {
      window.location.href = `/products/${product.slug}`
      return
    }
    if (!product.inStock) return
    addItem(product)
    setAddedFlash(true)
    toast.success(`${product.name} added to bag`, {
      style: {
        background: '#FAF6F0',
        color: '#1C1C1E',
        border: '1px solid #E8DDD0',
        borderRadius: '4px',
        fontSize: '13px',
      },
      iconTheme: { primary: '#C9A05B', secondary: '#fff' },
      duration: 2000,
    })
    setTimeout(() => setAddedFlash(false), 700)
  }

  return (
    <div
      ref={cardRef}
      className={cn('group relative', className)}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      <Link href={`/products/${product.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A05B] focus-visible:ring-offset-2 rounded-xl" tabIndex={0}>

        {/* ── Image area ── */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F2EBE0]">

          {/* Primary image */}
          <Image
            src={primaryImg}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-opacity duration-[400ms] ease-in-out',
              imgLoaded ? 'opacity-100' : 'opacity-0',
              hovered ? 'opacity-0' : 'opacity-100'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImgLoaded(true)}
          />

          {/* Secondary image (cross-fade on hover) */}
          <Image
            src={secondaryImg}
            alt={`${product.name} — alternate view`}
            fill
            className={cn(
              'object-cover absolute inset-0 transition-opacity duration-[400ms] ease-in-out',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2EBE0] via-[#FAF6F0] to-[#F2EBE0] animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isPremium && (
              <span className="px-2 py-0.5 bg-[#1C1C1E] text-[#C9A05B] text-[9px] font-medium tracking-[0.12em] uppercase rounded-full">
                Premium
              </span>
            )}
            {product.isBestseller && !product.isPremium && (
              <span className="px-2 py-0.5 bg-[#C9A05B] text-white text-[9px] font-medium tracking-[0.12em] uppercase rounded-full">
                Bestseller
              </span>
            )}
            {!product.inStock && (
              <span className="px-2 py-0.5 bg-[#8A8A8E]/80 text-white text-[9px] font-medium tracking-[0.12em] uppercase rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist button — fades in on hover */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <WishlistButton productId={product.id} size={14} />
            </div>
          </div>

          {/* Add-to-cart CTA — slides up from bottom */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute bottom-0 left-0 right-0 z-10"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  aria-label={product.isPremium ? 'Reserve in-store' : 'Add to bag'}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors duration-200',
                    product.isPremium
                      ? 'bg-[#1C1C1E] hover:bg-[#2D2D2F] text-[#C9A05B]'
                      : product.inStock
                        ? 'bg-[#C9A05B] hover:bg-[#A8823A] text-white'
                        : 'bg-[#8A8A8E] cursor-not-allowed text-white'
                  )}
                >
                  <ShoppingBag
                    size={13}
                    className={cn(
                      'transition-transform duration-300',
                      addedFlash ? 'scale-125' : 'scale-100'
                    )}
                  />
                  {product.isPremium
                    ? 'Reserve In-Store'
                    : product.inStock
                      ? addedFlash ? 'Added ✓' : 'Add to Bag'
                      : 'Out of Stock'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Text info ── */}
        <div className="mt-3 px-0.5">
          <p className="text-[10px] tracking-[0.14em] uppercase text-[#8A8A8E] mb-0.5">
            {product.material}
          </p>

          {/* Name with animated underline draw */}
          <h3 className="text-sm font-medium text-[#1C1C1E] leading-snug line-clamp-2 underline-anim group-hover:text-[#C9A05B] transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-[#1C1C1E]">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-[#C9A05B] fill-[#C9A05B]" />
              <span className="text-[10px] text-[#8A8A8E]">4.8</span>
            </div>
          </div>
        </div>

      </Link>
    </div>
  )
}

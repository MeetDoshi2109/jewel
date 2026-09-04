'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Star, Share2, ChevronLeft, Shield, Truck, RotateCcw, CalendarCheck, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useWishlistStore } from '@/store/cart'
import { formatPrice, cn, getCategoryLabel } from '@/lib/utils'
import { Product, ReservationForm } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

const STORES = [
  'Aurelia Mumbai — Palladium Mall, Lower Parel',
  'Aurelia Delhi — DLF Promenade, Vasant Kunj',
]

interface Props {
  product: Product & { reviews?: Array<{
    id: string; authorName: string; rating: number; title: string; body: string; createdAt: string
  }> }
  related: Product[]
}

export default function ProductDetailClient({ product, related }: Props) {
  const [selectedImg, setSelectedImg] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [qty, setQty] = useState(1)
  const [reserveOpen, setReserveOpen] = useState(false)
  const [reserveForm, setReserveForm] = useState<ReservationForm>({
    name: '', email: '', phone: '', preferredStore: STORES[0], preferredDate: '', notes: '',
  })
  const [reserving, setReserving] = useState(false)
  const [reservationDone, setReservationDone] = useState(false)
  const [addedPulse, setAddedPulse] = useState(false)

  const { addItem, openCart } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const isWishlisted = has(product.id)

  const images = product.images?.length ? product.images : [
    '/images/2ring.jpg',
  ]

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 4.8

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const handleAddToCart = () => {
    if (product.isPremium) return
    addItem(product, qty)
    setAddedPulse(true)
    setTimeout(() => setAddedPulse(false), 600)
    openCart()
    toast.success('Added to your bag')
  }

  const handleWishlist = () => {
    toggle(product.id)
    toast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
      icon: isWishlisted ? '💔' : '♥',
      style: { background: '#FAF6F0', color: '#1C1C1E', border: '1px solid #E8DDD0', fontSize: '13px' },
    })
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reserveForm.name || !reserveForm.email || !reserveForm.phone) {
      toast.error('Please fill all required fields')
      return
    }
    setReserving(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reservation',
          items: [{ productId: product.id, quantity: 1, price: product.price, name: product.name }],
          guestName: reserveForm.name,
          guestEmail: reserveForm.email,
          guestPhone: reserveForm.phone,
          preferredStore: reserveForm.preferredStore,
          preferredDate: reserveForm.preferredDate,
          reservationNotes: reserveForm.notes,
        }),
      })
      if (res.ok) {
        setReservationDone(true)
      } else {
        toast.error('Failed to create reservation. Please try again.')
      }
    } finally {
      setReserving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8A8A8E] mb-8">
          <Link href="/" className="hover:text-[#C9A05B] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#C9A05B] transition-colors">Collections</Link>
          <span>/</span>
          <Link href={`/collections/${product.category}`} className="hover:text-[#C9A05B] transition-colors capitalize">
            {getCategoryLabel(product.category)}
          </Link>
          <span>/</span>
          <span className="text-[#1C1C1E] truncate max-w-32">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-[#F2EBE0] cursor-zoom-in"
              onMouseMove={handleImageHover}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              <Image
                src={images[selectedImg]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300"
                style={
                  zoomed
                    ? { transform: 'scale(2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : {}
                }
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.isPremium && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#1C1C1E] text-[#C9A05B] text-[9px] font-medium tracking-widest uppercase rounded-full">
                  Premium · Reserve In-Store
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={cn(
                      'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                      selectedImg === i ? 'border-[#C9A05B]' : 'border-transparent hover:border-[#E8DDD0]'
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Category & SKU */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A05B]">
                {getCategoryLabel(product.category)}
              </p>
              <p className="text-[10px] text-[#8A8A8E]">SKU: {product.sku}</p>
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl text-[#1C1C1E] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.round(avgRating) ? 'text-[#C9A05B] fill-[#C9A05B]' : 'text-[#E8DDD0]'}
                  />
                ))}
              </div>
              <span className="text-xs text-[#8A8A8E]">
                {avgRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <p className="font-serif text-3xl text-[#1C1C1E]">{formatPrice(product.price)}</p>
              {product.isPremium && (
                <span className="text-xs text-[#8A8A8E] italic">In-store purchase only</span>
              )}
            </div>

            {/* Material */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#C9A05B] to-[#A8823A]" />
              <p className="text-sm text-[#2D2D2F]">{product.material}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-[#2D2D2F] leading-relaxed mb-8 border-t border-[#E8DDD0] pt-6">
              {product.description}
            </p>

            {/* Premium: Reserve Flow */}
            {product.isPremium ? (
              <div className="space-y-4">
                <div className="bg-[#F2EBE0] border border-[#E8DDD0] rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1C1C1E] mb-1">In-Store Purchase Only</p>
                      <p className="text-xs text-[#8A8A8E] leading-relaxed">
                        This premium piece requires in-person verification and payment at one of our flagship stores. Reserve it now and we'll hold it for your visit.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setReserveOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white py-4 text-xs tracking-widest uppercase font-medium transition-colors duration-200 btn-sweep"
                >
                  <CalendarCheck size={16} />
                  Reserve for In-Store Payment
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-full flex items-center justify-center gap-2 border border-[#E8DDD0] py-3.5 text-xs tracking-widest uppercase text-[#1C1C1E] hover:border-[#C9A05B] transition-colors"
                >
                  <Heart
                    size={14}
                    className={cn(isWishlisted ? 'fill-[#B76E79] text-[#B76E79]' : '')}
                  />
                  {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>
              </div>
            ) : (
              /* Standard: Add to Cart */
              <div className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <p className="text-xs tracking-widest uppercase text-[#8A8A8E]">Qty</p>
                  <div className="flex items-center gap-3 border border-[#E8DDD0] rounded-full px-4 py-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="text-[#8A8A8E] hover:text-[#1C1C1E] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="text-[#8A8A8E] hover:text-[#1C1C1E] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-xs text-[#B76E79]">Only {product.stock} left</p>
                  )}
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-4 text-xs tracking-widest uppercase font-medium transition-all duration-200 btn-sweep',
                    product.inStock
                      ? 'bg-[#C9A05B] hover:bg-[#A8823A] text-white'
                      : 'bg-[#E8DDD0] text-[#8A8A8E] cursor-not-allowed'
                  )}
                >
                  <ShoppingBag size={16} className={cn(addedPulse ? 'scale-125' : '', 'transition-transform')} />
                  {product.inStock ? 'Add to Bag' : 'Out of Stock'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-full flex items-center justify-center gap-2 border border-[#E8DDD0] py-3.5 text-xs tracking-widest uppercase text-[#1C1C1E] hover:border-[#C9A05B] transition-colors"
                >
                  <Heart size={14} className={cn(isWishlisted ? 'fill-[#B76E79] text-[#B76E79]' : '')} />
                  {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-[#E8DDD0]">
              {[
                { icon: Shield, label: 'Hallmarked', sub: 'Certified quality' },
                { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹999' },
                { icon: RotateCcw, label: '30-Day Returns', sub: 'Hassle-free' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon size={20} className="mx-auto text-[#C9A05B] mb-2" />
                  <p className="text-xs font-medium text-[#1C1C1E]">{label}</p>
                  <p className="text-[10px] text-[#8A8A8E] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-20 border-t border-[#E8DDD0] pt-12">
            <h2 className="font-serif text-3xl text-[#1C1C1E] mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((r) => (
                <div key={r.id} className="bg-white border border-[#E8DDD0] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-sm text-[#1C1C1E]">{r.authorName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} className={i < r.rating ? 'text-[#C9A05B] fill-[#C9A05B]' : 'text-[#E8DDD0]'} />
                      ))}
                    </div>
                  </div>
                  {r.title && <p className="text-sm font-medium text-[#1C1C1E] mb-1">{r.title}</p>}
                  <p className="text-sm text-[#8A8A8E] leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-[#E8DDD0] pt-12">
            <h2 className="font-serif text-3xl text-[#1C1C1E] mb-8">You May Also Love</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DDD0] p-4 flex gap-3 lg:hidden z-30">
        <p className="flex-1 font-medium text-[#1C1C1E] self-center">{formatPrice(product.price)}</p>
        {product.isPremium ? (
          <button
            onClick={() => setReserveOpen(true)}
            className="flex-1 bg-[#1C1C1E] text-[#C9A05B] py-3 text-xs tracking-widest uppercase font-medium"
          >
            Reserve In-Store
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'flex-1 py-3 text-xs tracking-widest uppercase font-medium',
              product.inStock ? 'bg-[#C9A05B] text-white' : 'bg-[#E8DDD0] text-[#8A8A8E]'
            )}
          >
            {product.inStock ? 'Add to Bag' : 'Sold Out'}
          </button>
        )}
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {reserveOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => !reserving && setReserveOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-[#FAF6F0] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {reservationDone ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C9A05B]/10 flex items-center justify-center mx-auto mb-5">
                    <CalendarCheck size={28} className="text-[#C9A05B]" />
                  </div>
                  <h2 className="font-serif text-2xl text-[#1C1C1E] mb-3">Your piece is reserved</h2>
                  <p className="text-sm text-[#8A8A8E] leading-relaxed mb-6">
                    Please visit <strong className="text-[#1C1C1E]">{reserveForm.preferredStore.split('—')[0].trim()}</strong> to complete your payment and collect your piece. We'll hold it for 7 days.
                  </p>
                  <p className="text-xs text-[#8A8A8E] bg-[#F2EBE0] p-3 rounded-lg mb-6 text-left">
                    A confirmation has been sent to <strong className="text-[#1C1C1E]">{reserveForm.email}</strong>.
                    Our team will also call you to confirm your visit details.
                  </p>
                  <button
                    onClick={() => { setReserveOpen(false); setReservationDone(false) }}
                    className="w-full bg-[#C9A05B] text-white py-3 text-xs tracking-widest uppercase"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl text-[#1C1C1E]">Reserve In-Store</h2>
                    <button onClick={() => setReserveOpen(false)} className="text-[#8A8A8E] hover:text-[#1C1C1E]">✕</button>
                  </div>

                  {/* Product summary */}
                  <div className="flex gap-3 bg-[#F2EBE0] rounded-lg p-3 mb-6">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={images[0]} alt={product.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1C1E] line-clamp-1">{product.name}</p>
                      <p className="text-xs text-[#8A8A8E] mt-0.5">{product.material}</p>
                      <p className="text-sm font-medium text-[#C9A05B] mt-1">{formatPrice(product.price)}</p>
                    </div>
                  </div>

                  <form onSubmit={handleReservation} className="space-y-4">
                    {[
                      { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your name' },
                      { label: 'Email *', key: 'email', type: 'email', placeholder: 'your@email.com' },
                      { label: 'Phone Number *', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-xs tracking-wide text-[#8A8A8E] mb-1 block">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={reserveForm[field.key as keyof ReservationForm]}
                          onChange={(e) => setReserveForm((f) => ({ ...f, [field.key]: e.target.value }))}
                          required
                          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="text-xs tracking-wide text-[#8A8A8E] mb-1 block">Preferred Store</label>
                      <select
                        value={reserveForm.preferredStore}
                        onChange={(e) => setReserveForm((f) => ({ ...f, preferredStore: e.target.value }))}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                      >
                        {STORES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs tracking-wide text-[#8A8A8E] mb-1 block">Preferred Visit Date</label>
                      <input
                        type="date"
                        value={reserveForm.preferredDate}
                        onChange={(e) => setReserveForm((f) => ({ ...f, preferredDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wide text-[#8A8A8E] mb-1 block">Notes (optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Any special requests..."
                        value={reserveForm.notes}
                        onChange={(e) => setReserveForm((f) => ({ ...f, notes: e.target.value }))}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B] resize-none"
                      />
                    </div>

                    <div className="bg-[#F2EBE0] rounded-lg p-3 text-xs text-[#8A8A8E] leading-relaxed">
                      No payment is taken now. Your item will be reserved for 7 days pending your in-store visit.
                    </div>

                    <button
                      type="submit"
                      disabled={reserving}
                      className="w-full bg-[#C9A05B] hover:bg-[#A8823A] text-white py-4 text-xs tracking-widest uppercase font-medium transition-colors disabled:opacity-60"
                    >
                      {reserving ? 'Reserving...' : 'Confirm Reservation'}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Package,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

interface OrderItemProduct {
  name: string
  slug: string
  images: string | string[]
  material?: string
}

interface OrderItemData {
  id: string
  name: string
  price: number
  quantity: number
  product?: OrderItemProduct
}

interface TrackedOrder {
  id: string
  orderNumber: string
  type: 'online' | 'reservation'
  status: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingAddress: {
    name?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
    phone?: string
  } | null
  preferredStore?: string
  preferredDate?: string
  reservationNotes?: string
  trackingNumber?: string
  courierName?: string
  createdAt: string
  estimatedDelivery?: string
  items: OrderItemData[]
}

function getItemImage(item: OrderItemData): string {
  if (!item.product?.images) return '/images/2ring.jpg'
  if (Array.isArray(item.product.images)) {
    return item.product.images[0] || '/images/2ring.jpg'
  }
  try {
    const parsed = JSON.parse(item.product.images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/images/2ring.jpg'
  } catch {
    return '/images/2ring.jpg'
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const initialOrderNumber = searchParams.get('orderNumber') || ''

  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber)
  const [emailInput, setEmailInput] = useState('')
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack(initialOrderNumber)
    }
  }, [initialOrderNumber])

  async function handleTrack(numberToSearch?: string) {
    const num = (numberToSearch || orderNumberInput).trim()
    if (!num) {
      setError('Please enter your Order Number')
      return
    }

    setError('')
    setLoading(true)

    try {
      const url = new URL('/api/orders/track', window.location.origin)
      url.searchParams.set('orderNumber', num)
      if (emailInput.trim()) {
        url.searchParams.set('email', emailInput.trim())
      }

      const res = await fetch(url.toString())
      const data = await res.json()

      if (res.ok && data.order) {
        setOrder(data.order)
      } else {
        setOrder(null)
        setError(data.error || 'No order found with the provided details.')
      }
    } catch {
      setError('An error occurred while tracking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyOrderNumber(num: string) {
    navigator.clipboard.writeText(num)
    setCopied(true)
    toast.success('Order number copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Delivery Stages Definition
  const ONLINE_STAGES = [
    {
      id: 'placed',
      title: 'Order Confirmed',
      description: 'Your payment was received & design logged with the atelier.',
    },
    {
      id: 'confirmed',
      title: 'Atelier Inspection & Packaging',
      description: 'Hallmarking certification & luxury velvet box packaging.',
    },
    {
      id: 'shipped',
      title: 'Dispatched with Insured Courier',
      description: 'Handed to BlueDart/Sequel with high-value transit security.',
    },
    {
      id: 'delivered',
      title: 'Delivered to You',
      description: 'Handed over securely with recipient signature.',
    },
  ]

  const RESERVATION_STAGES = [
    {
      id: 'pending_instore',
      title: 'Reservation Requested',
      description: 'Your appointment slot and requested pieces have been logged.',
    },
    {
      id: 'paid_instore',
      title: 'Boutique Confirmed',
      description: 'Pieces secured at your selected flagship salon.',
    },
    {
      id: 'ready_for_pickup',
      title: 'Ready for Private Viewing',
      description: 'Jewellery specialists prepared for your appointment.',
    },
    {
      id: 'completed',
      title: 'Viewing Completed',
      description: 'Appointment concluded at Aurelia Boutique.',
    },
  ]

  const stages = order?.type === 'reservation' ? RESERVATION_STAGES : ONLINE_STAGES

  function getActiveStageIndex(status: string): number {
    const s = status.toLowerCase()
    if (order?.type === 'reservation') {
      if (s === 'completed') return 3
      if (s === 'ready_for_pickup') return 2
      if (s === 'paid_instore') return 1
      return 0
    } else {
      if (s === 'delivered') return 3
      if (s === 'shipped') return 2
      if (s === 'confirmed') return 1
      return 0
    }
  }

  const activeIndex = order ? getActiveStageIndex(order.status) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A8A8E] hover:text-[#C9A05B] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Account
        </Link>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] tracking-[0.25em] text-[#C9A05B] uppercase font-semibold">
          Real-Time Transit & Atelier Tracker
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1E] mt-2 mb-3">
          Track Your Jewellery
        </h1>
        <p className="text-xs sm:text-sm text-[#8A8A8E] leading-relaxed">
          Enter your Order Number to check live crafting milestones, insured courier dispatch, or private viewing status.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white border border-[#E8DDD0] rounded-2xl p-5 sm:p-7 shadow-sm mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleTrack()
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Order Number (e.g. AUR-2026-0001)"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#FAF6F0]/50 border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#1C1C1E] placeholder:text-[#8A8A8E] focus:outline-none focus:border-[#C9A05B] transition-colors font-mono"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8E]"
            />
          </div>

          <div className="sm:col-span-4">
            <input
              type="email"
              placeholder="Email address (optional)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6F0]/50 border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#1C1C1E] placeholder:text-[#8A8A8E] focus:outline-none focus:border-[#C9A05B] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-full py-3 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Track'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Tracking Timeline & Details */}
      {order && (
        <div className="space-y-6">
          {/* Order Header Summary */}
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E8DDD0]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">
                  Tracking Order
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#1C1C1E]">
                    #{order.orderNumber}
                  </span>
                  <button
                    onClick={() => copyOrderNumber(order.orderNumber)}
                    className="p-1.5 rounded-md hover:bg-[#FAF6F0] text-[#8A8A8E] hover:text-[#C9A05B] transition-colors"
                    title="Copy Order Number"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C9A05B]/15 text-[#A8823A] border border-[#C9A05B]/30">
                  {order.type === 'reservation' ? 'Boutique Viewing' : 'Express Delivery'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="pt-8 pb-4">
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#E8DDD0] -z-0" />
                {/* Active Progress Bar */}
                <div
                  className="hidden sm:block absolute top-5 left-8 h-1 bg-[#C9A05B] transition-all duration-700 -z-0"
                  style={{
                    width: `${(activeIndex / (stages.length - 1)) * 100}%`,
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                  {stages.map((stg, idx) => {
                    const isCompleted = idx < activeIndex
                    const isCurrent = idx === activeIndex
                    const isPending = idx > activeIndex

                    return (
                      <div key={stg.id} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            isCompleted
                              ? 'bg-[#C9A05B] border-[#C9A05B] text-white'
                              : isCurrent
                              ? 'bg-white border-[#C9A05B] text-[#C9A05B] shadow-md ring-4 ring-[#C9A05B]/20'
                              : 'bg-white border-[#E8DDD0] text-[#8A8A8E]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={18} />
                          ) : isCurrent ? (
                            <Sparkles size={18} className="animate-pulse" />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <p
                            className={`text-xs sm:text-sm font-semibold ${
                              isCurrent ? 'text-[#C9A05B]' : isCompleted ? 'text-[#1C1C1E]' : 'text-[#8A8A8E]'
                            }`}
                          >
                            {stg.title}
                          </p>
                          <p className="text-[11px] text-[#8A8A8E] mt-0.5 leading-snug max-w-xs">
                            {stg.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Estimated Delivery / Appointment Highlight */}
            <div className="mt-8 p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DDD0] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C9A05B] border border-[#E8DDD0] shadow-sm">
                  {order.type === 'reservation' ? <Calendar size={18} /> : <Truck size={18} />}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">
                    {order.type === 'reservation' ? 'Scheduled Appointment' : 'Estimated Delivery'}
                  </span>
                  <span className="font-serif text-sm font-semibold text-[#1C1C1E]">
                    {order.type === 'reservation'
                      ? order.preferredDate || 'To be confirmed with Boutique Concierge'
                      : order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '2–3 Business Days'}
                  </span>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">
                    Courier AWB Tracking
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1C1E] bg-white px-2.5 py-1 rounded border border-[#E8DDD0]">
                    {order.courierName || 'BlueDart'}: {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items & Logistics Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items Card (2 Cols) */}
            <div className="md:col-span-2 bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-base font-semibold text-[#1C1C1E] mb-4 pb-3 border-b border-[#E8DDD0]">
                Package Contents ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
              </h3>

              <div className="divide-y divide-[#E8DDD0]/60">
                {order.items.map((item) => {
                  const img = getItemImage(item)
                  const slug = item.product?.slug

                  return (
                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#E8DDD0]">
                        <Image src={img} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-[#1C1C1E] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#8A8A8E] mt-0.5">
                          Quantity: {item.quantity} · {formatPrice(item.price)} each
                        </p>
                        {slug && (
                          <Link
                            href={`/products/${slug}`}
                            className="inline-flex items-center gap-1 text-[11px] text-[#C9A05B] hover:underline mt-1"
                          >
                            Product Details
                            <ChevronRight size={12} />
                          </Link>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1C1C1E]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E8DDD0] flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider text-[#8A8A8E]">Order Total</span>
                <span className="font-serif text-base font-bold text-[#1C1C1E]">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Delivery / Store Destination Card */}
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#1C1C1E] mb-4 pb-3 border-b border-[#E8DDD0]">
                  {order.type === 'reservation' ? 'Salon Location' : 'Shipping Address'}
                </h3>

                {order.type === 'online' && order.shippingAddress ? (
                  <div className="text-xs space-y-1.5 text-[#8A8A8E] leading-relaxed">
                    <p className="font-semibold text-[#1C1C1E]">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    {order.shippingAddress.phone && <p>Contact: {order.shippingAddress.phone}</p>}
                  </div>
                ) : order.type === 'reservation' ? (
                  <div className="text-xs space-y-2 text-[#8A8A8E] leading-relaxed">
                    <p className="font-semibold text-[#1C1C1E] flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#C9A05B]" />
                      {order.preferredStore || 'Aurelia Flagship'}
                    </p>
                    <p>Complimentary sparkling refreshments & personal jewellery stylist included.</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#8A8A8E]">Address information unavailable.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DDD0] bg-[#FAF6F0]/40 -mx-6 -mb-6 p-5 rounded-b-2xl">
                <p className="text-[11px] font-semibold text-[#1C1C1E] flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck size={14} className="text-[#C9A05B]" />
                  100% Insured Delivery
                </p>
                <p className="text-[10px] text-[#8A8A8E] leading-relaxed">
                  Every Aurelia shipment travels via armored logistics, fully insured up to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Concierge Assistance Card */}
      <div className="mt-12 bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-8 text-center shadow-sm">
        <h3 className="font-serif text-lg text-[#1C1C1E] mb-2">Need Assistance with Your Order?</h3>
        <p className="text-xs sm:text-sm text-[#8A8A8E] max-w-md mx-auto mb-6">
          Our Jaipur atelier concierge is available 7 days a week to answer queries regarding craftsmanship, transit, or custom sizing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <a
            href="tel:+918001234567"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E8DDD0] text-[#1C1C1E] hover:border-[#C9A05B] hover:text-[#C9A05B] transition-colors"
          >
            <Phone size={14} className="text-[#C9A05B]" />
            +91 800 123 4567
          </a>
          <a
            href="mailto:hello@aurelia.in"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E8DDD0] text-[#1C1C1E] hover:border-[#C9A05B] hover:text-[#C9A05B] transition-colors"
          >
            <Mail size={14} className="text-[#C9A05B]" />
            hello@aurelia.in
          </a>
        </div>
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF6F0]">
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <TrackOrderContent />
      </Suspense>
    </div>
  )
}

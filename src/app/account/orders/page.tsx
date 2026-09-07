'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  ArrowLeft,
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface OrderItemProduct {
  name: string
  slug: string
  images: string | string[]
}

interface OrderItemData {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  product?: OrderItemProduct
}

interface OrderData {
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
  items: OrderItemData[]
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof Clock }
> = {
  placed: {
    label: 'Order Placed',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: CheckCircle2,
  },
  shipped: {
    label: 'Shipped & In Transit',
    bg: 'bg-indigo-50 border-indigo-200',
    text: 'text-indigo-800',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
  },
  pending_instore: {
    label: 'Reservation Pending',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: Calendar,
  },
  paid_instore: {
    label: 'Paid In Store',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
  },
  ready_for_pickup: {
    label: 'Ready For Viewing',
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-800',
    icon: MapPin,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    icon: AlertCircle,
  },
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

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'reservation'>('all')

  useEffect(() => {
    checkAuthAndFetchOrders()
  }, [])

  async function checkAuthAndFetchOrders() {
    try {
      const authRes = await fetch('/api/auth/customer/me')
      const authData = await authRes.json()

      if (!authRes.ok || !authData.customer) {
        setIsAuth(false)
        setLoading(false)
        return
      }

      setIsAuth(true)
      const ordersRes = await fetch('/api/orders')
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.orders || [])
      }
    } catch {
      // Handle network errors gracefully
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true
    return o.type === activeTab
  })

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#8A8A8E]">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F0]">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white border border-[#E8DDD0] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package size={28} className="text-[#C9A05B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#1C1C1E] mb-3">Please Sign In</h1>
          <p className="text-sm text-[#8A8A8E] leading-relaxed mb-8">
            You need to be signed in to your Aurelia account to view your order history and track deliveries.
          </p>
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white px-8 py-3.5 text-xs uppercase tracking-widest transition-colors rounded-lg font-medium"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A8A8E] hover:text-[#C9A05B] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8DDD0]">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#C9A05B] uppercase font-medium">
              Order History & Tracking
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1E] mt-1">My Orders</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white p-1 rounded-lg border border-[#E8DDD0] shadow-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1C1C1E] text-white'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'online'
                  ? 'bg-[#1C1C1E] text-white'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              Online ({orders.filter((o) => o.type === 'online').length})
            </button>
            <button
              onClick={() => setActiveTab('reservation')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'reservation'
                  ? 'bg-[#1C1C1E] text-white'
                  : 'text-[#8A8A8E] hover:text-[#1C1C1E]'
              }`}
            >
              Boutique ({orders.filter((o) => o.type === 'reservation').length})
            </button>
          </div>
        </div>

        {/* Orders Content */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#E8DDD0] rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-[#C9A05B]" />
            </div>
            <h2 className="font-serif text-2xl text-[#1C1C1E] mb-2">No Orders Found</h2>
            <p className="text-sm text-[#8A8A8E] max-w-sm mx-auto mb-6">
              {activeTab === 'all'
                ? "You haven't placed any jewellery orders or reservations yet."
                : `You don't have any ${activeTab} orders at this moment.`}
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white px-7 py-3.5 text-xs uppercase tracking-widest font-medium rounded-lg transition-colors"
            >
              Discover The Collection
              <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || {
                label: order.status.replace(/_/g, ' '),
                bg: 'bg-neutral-100 border-neutral-200',
                text: 'text-neutral-700',
                icon: Clock,
              }
              const StatusIcon = statusCfg.icon

              return (
                <div
                  key={order.id}
                  className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden shadow-sm hover:border-[#C9A05B]/40 transition-colors"
                >
                  {/* Order Card Header */}
                  <div className="p-5 sm:p-6 bg-[#FAF6F0]/40 border-b border-[#E8DDD0] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">
                          Order Number
                        </span>
                        <span className="font-serif text-base font-semibold text-[#1C1C1E]">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <span className="hidden sm:inline-block w-px h-6 bg-[#E8DDD0]" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">
                          Date Placed
                        </span>
                        <span className="text-xs text-[#2D2D2F]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${statusCfg.bg} ${statusCfg.text}`}
                      >
                        <StatusIcon size={12} />
                        {statusCfg.label}
                      </span>
                      <span className="text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-md bg-[#1C1C1E] text-white">
                        {order.type === 'reservation' ? 'Boutique Viewing' : 'Online'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 sm:p-6 divide-y divide-[#E8DDD0]/50">
                    {order.items.map((item) => {
                      const imageUrl = getItemImage(item)
                      const itemSlug = item.product?.slug

                      return (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F2EBE0] shrink-0 border border-[#E8DDD0]">
                            <Image
                              src={imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#1C1C1E] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#8A8A8E] mt-0.5">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            {itemSlug && (
                              <Link
                                href={`/products/${itemSlug}`}
                                className="inline-flex items-center gap-1 text-[11px] text-[#C9A05B] hover:underline mt-1.5"
                              >
                                View Product
                                <ExternalLink size={11} />
                              </Link>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-semibold text-[#1C1C1E]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Order Details & Logistics */}
                  <div className="px-5 py-4 sm:px-6 bg-[#FAF6F0]/20 border-t border-[#E8DDD0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {order.type === 'online' && order.shippingAddress && (
                      <div>
                        <span className="font-medium text-[#1C1C1E] flex items-center gap-1.5 mb-1">
                          <Truck size={13} className="text-[#C9A05B]" />
                          Delivery Details
                        </span>
                        <p className="text-[#8A8A8E] leading-relaxed">
                          {order.shippingAddress.line1}
                          {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                          {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
                        </p>
                        {order.trackingNumber && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8DDD0] rounded-md text-[11px] font-mono text-[#1C1C1E]">
                            <span>Courier: {order.courierName || 'BlueDart'}</span>
                            <span className="text-[#8A8A8E]">|</span>
                            <span>AWB: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {order.type === 'reservation' && (
                      <div>
                        <span className="font-medium text-[#1C1C1E] flex items-center gap-1.5 mb-1">
                          <MapPin size={13} className="text-[#C9A05B]" />
                          Boutique Appointment
                        </span>
                        <p className="text-[#8A8A8E] leading-relaxed">
                          Store: <strong className="text-[#1C1C1E]">{order.preferredStore || 'Jaipur Flagship'}</strong>
                          {order.preferredDate && ` · Scheduled for ${order.preferredDate}`}
                        </p>
                        {order.reservationNotes && (
                          <p className="text-[11px] text-[#8A8A8E] italic mt-1">
                            &quot;{order.reservationNotes}&quot;
                          </p>
                        )}
                      </div>
                    )}

                    <div className="sm:text-right flex flex-col justify-center sm:items-end">
                      <span className="text-[11px] text-[#8A8A8E] uppercase tracking-wider">
                        Total Amount
                      </span>
                      <span className="font-serif text-lg font-bold text-[#1C1C1E]">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                        <ShieldCheck size={12} />
                        {order.paymentStatus === 'paid' ? 'Payment Verified' : 'Cash / Payment on Delivery / In-Store'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || ''

  return (
    <div className="max-w-xl mx-auto px-4 text-center">
      {/* Gold Seal Icon */}
      <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 size={36} className="text-emerald-600" />
      </div>

      <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A05B] font-semibold block mb-1">
        Order Received & Confirmed
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1E] mb-3">
        Thank You for Choosing Aurelia
      </h1>
      <p className="text-xs sm:text-sm text-[#8A8A8E] leading-relaxed mb-8">
        Your bespoke jewellery order has been placed with our Jaipur atelier. An order confirmation
        and digital authenticity certificate will be delivered to your email.
      </p>

      {/* Order Badge Card */}
      {orderNumber && (
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 mb-8 text-left shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD0]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">
                Order Reference
              </span>
              <span className="font-serif text-lg font-bold text-[#1C1C1E]">
                #{orderNumber}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              Processing
            </span>
          </div>

          <div className="pt-4 flex items-center gap-3 text-xs text-[#8A8A8E]">
            <ShieldCheck size={16} className="text-[#C9A05B] shrink-0" />
            <span>
              Includes tamper-evident luxury velvet presentation case and GIA/IGI diamond authentication.
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        {orderNumber ? (
          <Link
            href={`/account/track?orderNumber=${orderNumber}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white px-7 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-xl transition-colors"
          >
            <Truck size={14} className="text-[#C9A05B]" />
            Track Order Status
          </Link>
        ) : (
          <Link
            href="/account/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white px-7 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-xl transition-colors"
          >
            <Package size={14} className="text-[#C9A05B]" />
            View My Orders
          </Link>
        )}

        <Link
          href="/collections"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF6F0] text-[#1C1C1E] border border-[#E8DDD0] px-7 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-xl transition-colors"
        >
          <ShoppingBag size={14} />
          Continue Shopping
        </Link>
      </div>

      <p className="text-[11px] text-[#8A8A8E]">
        Need personal guidance? Contact our concierge at{' '}
        <a href="tel:+918001234567" className="text-[#C9A05B] hover:underline font-medium">
          +91 800 123 4567
        </a>{' '}
        or{' '}
        <a href="mailto:hello@aurelia.in" className="text-[#C9A05B] hover:underline font-medium">
          hello@aurelia.in
        </a>
      </p>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F0] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        }
      >
        <OrderConfirmedContent />
      </Suspense>
    </div>
  )
}

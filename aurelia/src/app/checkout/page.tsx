'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

type Step = 'details' | 'payment' | 'confirmed'

interface ShippingForm {
  name: string; email: string; phone: string
  line1: string; line2: string; city: string; state: string; pincode: string
}

const PAYMENT_METHODS = [
  { value: 'razorpay_card', label: 'Credit / Debit Card' },
  { value: 'razorpay_upi', label: 'UPI' },
  { value: 'razorpay_netbanking', label: 'Net Banking' },
  { value: 'razorpay_wallet', label: 'Wallet' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('details')
  const [shipping, setShipping] = useState<ShippingForm>({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: 'Maharashtra', pincode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('razorpay_card')
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const cartTotal = total()
  const shippingFee = cartTotal > 999 ? 0 : 99

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-5 px-4">
        <p className="font-serif text-2xl text-[#1C1C1E]">Your bag is empty</p>
        <Link href="/collections" className="text-sm text-[#C9A05B] underline-anim">Browse the collection</Link>
      </div>
    )
  }

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // In production: integrate Razorpay payment here
      // For now, simulate payment success and create order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'online',
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
            name: i.product.name,
          })),
          shippingAddress: shipping,
          paymentMethod,
          guestName: shipping.name,
          guestEmail: shipping.email,
          guestPhone: shipping.phone,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrderNumber(data.orderNumber)
        clearCart()
        setStep('confirmed')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error('Failed to place order. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen pt-28 bg-[#FAF6F0]">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-[#C9A05B]/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={36} className="text-[#C9A05B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#1C1C1E] mb-3">Order Confirmed</h1>
          <p className="text-sm text-[#8A8A8E] mb-6">
            Thank you for shopping with Aurelia. Your order <strong className="text-[#1C1C1E]">#{orderNumber}</strong> has been placed successfully.
          </p>
          <div className="bg-[#F2EBE0] rounded-xl p-5 text-left mb-8">
            <p className="text-xs text-[#8A8A8E] mb-1">Delivering to</p>
            <p className="text-sm font-medium text-[#1C1C1E]">{shipping.name}</p>
            <p className="text-xs text-[#8A8A8E] mt-1">{shipping.line1}, {shipping.city} {shipping.pincode}</p>
            <p className="text-xs text-[#8A8A8E]">{shipping.email} · {shipping.phone}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/account/orders" className="w-full bg-[#C9A05B] text-white py-4 text-xs tracking-widest uppercase text-center font-medium">
              Track Your Order
            </Link>
            <Link href="/collections" className="w-full border border-[#E8DDD0] py-3 text-xs tracking-widest uppercase text-center text-[#1C1C1E]">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-[#FAF6F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step === 'payment' ? setStep('details') : router.back()} className="text-[#8A8A8E] hover:text-[#1C1C1E]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif text-2xl text-[#1C1C1E]">Checkout</h1>
            <div className="flex items-center gap-2 mt-1">
              {['details', 'payment'].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] tracking-widest uppercase',
                    step === s ? 'text-[#C9A05B]' : i === 0 && step === 'payment' ? 'text-[#8A8A8E] line-through' : 'text-[#E8DDD0]'
                  )}>{s}</span>
                  {i === 0 && <span className="text-[#E8DDD0]">/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === 'details' && (
              <form onSubmit={handleSubmitDetails} className="space-y-5">
                <h2 className="font-medium text-[#1C1C1E] mb-4 text-lg">Delivery Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name *', key: 'name', type: 'text', col: 2 },
                    { label: 'Email Address *', key: 'email', type: 'email', col: 1 },
                    { label: 'Phone Number *', key: 'phone', type: 'tel', col: 1 },
                    { label: 'Address Line 1 *', key: 'line1', type: 'text', col: 2 },
                    { label: 'Address Line 2', key: 'line2', type: 'text', col: 2 },
                    { label: 'City *', key: 'city', type: 'text', col: 1 },
                    { label: 'State *', key: 'state', type: 'text', col: 1 },
                    { label: 'PIN Code *', key: 'pincode', type: 'text', col: 1 },
                  ].map((f) => (
                    <div key={f.key} className={f.col === 2 ? 'sm:col-span-2' : ''}>
                      <label className="text-xs text-[#8A8A8E] mb-1 block">{f.label}</label>
                      <input
                        type={f.type}
                        required={f.label.endsWith('*')}
                        value={shipping[f.key as keyof ShippingForm]}
                        onChange={(e) => setShipping((s) => ({ ...s, [f.key]: e.target.value }))}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C9A05B] hover:bg-[#A8823A] text-white py-4 text-xs tracking-widest uppercase font-medium transition-colors mt-4"
                >
                  Continue to Payment →
                </button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <h2 className="font-medium text-[#1C1C1E] mb-4 text-lg">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.value}
                      className={cn(
                        'flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors',
                        paymentMethod === m.value ? 'border-[#C9A05B] bg-[#C9A05B]/5' : 'border-[#E8DDD0] hover:border-[#C9A05B]/50'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.value}
                        checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)}
                        className="accent-[#C9A05B]"
                      />
                      <span className="text-sm text-[#1C1C1E]">{m.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#8A8A8E] bg-[#F2EBE0] p-3 rounded-lg">
                  <Lock size={12} />
                  Payments are processed securely. Card details are never stored.
                </div>

                <div className="text-xs text-[#8A8A8E] italic p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  ⚠️ This is a demo. Razorpay integration requires valid API keys. Click &quot;Place Order&quot; to simulate a successful payment.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white py-4 text-xs tracking-widest uppercase font-medium transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Processing...' : `Place Order · ${formatPrice(cartTotal + shippingFee)}`}
                </button>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E8DDD0] rounded-xl p-6 sticky top-24">
              <h2 className="font-medium text-[#1C1C1E] mb-5 text-sm tracking-wide">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F2EBE0] flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1C1C1E] line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-[#8A8A8E] mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-[#1C1C1E] flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E8DDD0] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8A8E]">Subtotal</span>
                  <span className="text-[#1C1C1E]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8A8E]">Shipping</span>
                  <span className="text-[#1C1C1E]">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-medium text-[#1C1C1E] border-t border-[#E8DDD0] pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(cartTotal + shippingFee)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

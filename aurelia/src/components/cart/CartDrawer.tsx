'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const cartTotal = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-[#FAF6F0] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DDD0]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#C9A05B]" />
                <h2 className="font-serif text-xl text-[#1C1C1E]">Your Bag</h2>
                {items.length > 0 && (
                  <span className="text-xs text-[#8A8A8E]">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-full hover:bg-[#F2EBE0] transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F2EBE0] flex items-center justify-center">
                    <ShoppingBag size={28} className="text-[#C9A05B]" />
                  </div>
                  <p className="font-serif text-xl text-[#1C1C1E]">Your bag is empty</p>
                  <p className="text-sm text-[#8A8A8E]">Discover pieces you'll love forever.</p>
                  <Link
                    href="/collections"
                    onClick={closeCart}
                    className="mt-2 text-sm text-[#C9A05B] underline-anim"
                  >
                    Shop the collection →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence>
                    {items.map((item) => {
                      const images = item.product.images
                      const img = images[0]
                      return (
                        <motion.li
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-4"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#F2EBE0]">
                            <Image
                              src={img}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-medium text-[#1C1C1E] hover:text-[#C9A05B] transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-[#8A8A8E] mt-0.5">{item.product.material}</p>
                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity controls */}
                              <div className="flex items-center gap-2 border border-[#E8DDD0] rounded-full px-2 py-1">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="text-[#8A8A8E] hover:text-[#1C1C1E] transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="text-[#8A8A8E] hover:text-[#1C1C1E] transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <p className="text-sm font-medium text-[#1C1C1E]">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="self-start p-1 text-[#8A8A8E] hover:text-[#1C1C1E] transition-colors mt-0.5"
                            aria-label="Remove item"
                          >
                            <X size={14} />
                          </button>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#E8DDD0] bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-[#8A8A8E]">Subtotal</span>
                  <span className="text-lg font-medium text-[#1C1C1E]">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-[#8A8A8E] mb-4">Shipping and taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-[#C9A05B] hover:bg-[#A8823A] text-white py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 btn-sweep"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/collections"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full mt-3 text-xs text-[#8A8A8E] hover:text-[#1C1C1E] transition-colors tracking-wide"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

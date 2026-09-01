'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWishlistStore } from '@/store/cart'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Props {
  productId: string
  size?: number
  className?: string
}

// Small sparkle burst particles emitted on add
function SparkBurst() {
  const sparks = Array.from({ length: 6 }, (_, i) => ({
    angle: (i / 6) * 360,
    delay: i * 0.04,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#B76E79]"
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((s.angle * Math.PI) / 180) * 18,
            y: Math.sin((s.angle * Math.PI) / 180) * 18,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default function WishlistButton({ productId, size = 18, className }: Props) {
  const { toggle, has } = useWishlistStore()
  const saved = has(productId)
  const [bursting, setBursting] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(productId)

    if (!saved) {
      setBursting(true)
      setTimeout(() => setBursting(false), 600)
      toast('Saved to wishlist', {
        icon: '♥',
        style: {
          background: '#FAF6F0',
          color: '#1C1C1E',
          border: '1px solid #E8DDD0',
          fontSize: '13px',
        },
      })
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={saved}
      className={cn('relative flex items-center justify-center', className)}
    >
      <motion.div
        animate={
          bursting
            ? { scale: [1, 1.45, 0.88, 1.1, 1] }
            : {}
        }
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <Heart
          size={size}
          className={cn(
            'transition-colors duration-200',
            saved
              ? 'text-[#B76E79] fill-[#B76E79]'
              : 'text-[#1C1C1E] hover:text-[#B76E79]'
          )}
        />
      </motion.div>

      <AnimatePresence>
        {bursting && <SparkBurst />}
      </AnimatePresence>
    </button>
  )
}

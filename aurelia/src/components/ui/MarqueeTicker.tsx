import React from 'react'

const ITEMS = [
  '✦  Handcrafted in Jaipur',
  '✦  Ethically Sourced',
  '✦  18k Gold & Sterling Silver',
  '✦  Free Shipping Above ₹999',
  '✦  30-Day Returns',
  '✦  GIA Certified Diamonds',
  '✦  New Collection 2026',
  '✦  In-Store Consultation Available',
]

interface Props {
  dark?: boolean
  className?: string
}

export default function MarqueeTicker({ dark = false, className = '' }: Props) {
  const track = [...ITEMS, ...ITEMS] // double for seamless loop
  return (
    <div
      className={`overflow-hidden w-full ${dark ? 'bg-[#1C1C1E]' : 'bg-[#FAF6F0]'} border-y ${dark ? 'border-[#2A2A2C]' : 'border-[#E8DDD0]'} ${className}`}
      aria-hidden="true"
    >
      <div className="marquee-track py-3">
        {track.map((item, i) => (
          <span
            key={i}
            className={`
              text-[10px] tracking-[0.28em] uppercase font-light mx-10 whitespace-nowrap
              ${dark ? 'text-[#8A8A8E]' : 'text-[#8A8A8E]'}
            `}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

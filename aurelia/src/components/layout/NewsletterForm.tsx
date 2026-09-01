'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Thanks for subscribing!', {
        style: { background: '#FAF6F0', color: '#1C1C1E', border: '1px solid #E8DDD0' },
      })
      setEmail('')
    }
  }

  return (
    <form className="flex gap-0 w-full max-w-sm" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 bg-[#2D2D2F] text-[#FAF6F0] placeholder:text-[#8A8A8E] px-4 py-3 text-sm focus:outline-none focus:bg-[#333335]"
      />
      <button
        type="submit"
        className="bg-[#C9A05B] hover:bg-[#A8823A] text-white px-5 py-3 text-xs tracking-widest uppercase font-medium transition-colors duration-200"
      >
        Join
      </button>
    </form>
  )
}

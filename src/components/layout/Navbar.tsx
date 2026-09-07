'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn, CATEGORIES } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Collections', href: '/collections', hasDropdown: true },
  { label: 'New Arrivals', href: '/collections?sort=newest' },
  { label: 'Bestsellers', href: '/collections?filter=bestseller' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { count, openCart, toggleCart } = useCartStore()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const cartCount = count()

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#FAF6F0]/95 backdrop-blur-md shadow-sm border-b border-[#E8DDD0]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-2xl md:text-3xl text-[#1C1C1E] tracking-wider leading-none group-hover:text-[#C9A05B] transition-colors duration-300">
                AURELIA
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#C9A05B] uppercase font-light">
                Fine Jewellery
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.label} className="relative" ref={dropdownRef}>
                    <button
                      className="flex items-center gap-1 text-sm tracking-widest uppercase text-[#2D2D2F] hover:text-[#C9A05B] transition-colors duration-200 underline-anim"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          dropdownOpen ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#FAF6F0] border border-[#E8DDD0] rounded-lg shadow-xl p-4"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          <div className="grid grid-cols-1 gap-1">
                            {CATEGORIES.map((cat) => (
                              <Link
                                key={cat.value}
                                href={`/collections/${cat.value}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#2D2D2F] hover:bg-[#F2EBE0] hover:text-[#C9A05B] transition-colors duration-200"
                              >
                                <span className="text-base">{cat.emoji}</span>
                                <span className="tracking-wide">{cat.label}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'text-sm tracking-widest uppercase transition-colors duration-200 underline-anim',
                      pathname === link.href
                        ? 'text-[#C9A05B]'
                        : 'text-[#2D2D2F] hover:text-[#C9A05B]'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-[#2D2D2F] hover:text-[#C9A05B] transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-[#2D2D2F] hover:text-[#C9A05B] transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-[#2D2D2F] hover:text-[#C9A05B] transition-colors duration-200 hidden md:block"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-2 text-[#2D2D2F] hover:text-[#C9A05B] transition-colors duration-200 relative"
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A05B] text-white text-[9px] font-semibold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 text-[#2D2D2F]"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#E8DDD0] bg-[#FAF6F0]/95 backdrop-blur-md"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    window.location.href = `/collections?q=${encodeURIComponent(searchQuery)}`
                  }
                }}
                className="max-w-2xl mx-auto px-6 py-4 flex gap-3"
              >
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search rings, necklaces, earrings..."
                  className="flex-1 bg-transparent border-b border-[#C9A05B] text-[#1C1C1E] placeholder:text-[#8A8A8E] py-2 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-[#C9A05B] hover:text-[#A8823A] transition-colors"
                >
                  <Search size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FAF6F0] pt-20 px-6 overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 pt-8">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/collections/${cat.value}`}
                  className="flex items-center gap-3 text-lg font-serif text-[#1C1C1E] hover:text-[#C9A05B] transition-colors"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  {cat.label}
                </Link>
              ))}
              <div className="h-px bg-[#E8DDD0] my-2" />
              <Link href="/about" className="text-base tracking-widest uppercase text-[#2D2D2F]">About</Link>
              <Link href="/account" className="text-base tracking-widest uppercase text-[#2D2D2F]">Account</Link>
              <Link href="/wishlist" className="text-base tracking-widest uppercase text-[#2D2D2F]">Wishlist</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

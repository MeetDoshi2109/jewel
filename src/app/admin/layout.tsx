'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Store, CalendarCheck, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminUser { name: string; email: string; role: string }

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Online Orders' },
  { href: '/admin/orders?type=reservation', icon: CalendarCheck, label: 'In-Store Reservations' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/admin/me').then((r) => r.json()).then((d) => {
      setAdmin(d.admin || null)
      setLoading(false)
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
    const data = await res.json()
    if (res.ok) setAdmin(data.admin)
    else setError(data.error || 'Login failed')
  }

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    setAdmin(null)
    router.refresh()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
      <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!admin) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center px-4">
        <div className="bg-[#FAF6F0] rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <Store size={32} className="text-[#C9A05B] mx-auto mb-3" />
            <h1 className="font-serif text-2xl text-[#1C1C1E]">Aurelia Admin</h1>
            <p className="text-xs text-[#8A8A8E] mt-1">Staff portal — authorised access only</p>
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#8A8A8E] mb-1 block">Email</label>
              <input
                type="email" required
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A05B]"
              />
            </div>
            <div>
              <label className="text-xs text-[#8A8A8E] mb-1 block">Password</label>
              <input
                type="password" required
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A05B]"
              />
            </div>
            <button type="submit" className="w-full bg-[#C9A05B] text-white py-3 text-xs tracking-widest uppercase mt-2">
              Sign In
            </button>
            <p className="text-center text-xs text-[#8A8A8E]">Demo: admin@aurelia.in / admin123</p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-60 bg-[#1C1C1E] flex flex-col transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between p-5 border-b border-[#2D2D2F]">
          <div>
            <p className="font-serif text-lg text-[#FAF6F0] tracking-wide">AURELIA</p>
            <p className="text-[9px] tracking-[0.2em] text-[#C9A05B] uppercase">Admin Portal</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-[#8A8A8E]">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href.split('?')[0]) && href !== '/admin'
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-[#C9A05B] text-white'
                    : 'text-[#8A8A8E] hover:text-[#FAF6F0] hover:bg-[#2D2D2F]'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#2D2D2F]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A05B] flex items-center justify-center">
              <span className="text-white text-xs font-medium">{admin.name[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#FAF6F0] truncate">{admin.name}</p>
              <p className="text-[10px] text-[#8A8A8E] capitalize">{admin.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-[#8A8A8E] hover:text-[#FAF6F0] transition-colors w-full"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60">
        {/* Top bar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500">Logged in as <strong>{admin.email}</strong></span>
            <span className="px-2 py-0.5 bg-[#C9A05B]/10 text-[#C9A05B] text-[9px] uppercase rounded-full font-medium">{admin.role}</span>
          </div>
        </div>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}

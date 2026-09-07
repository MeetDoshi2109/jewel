'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Package, Heart, LogOut, Settings } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Customer { id: string; name: string; email: string; phone: string }
interface Order { id: string; orderNumber: string; status: string; totalAmount: number; type: string; createdAt: string }

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/customer/me')
      const data = await res.json()
      if (data.customer) {
        setCustomer(data.customer)
        fetchOrders()
      }
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrders() {
    const res = await fetch('/api/orders')
    if (res.ok) {
      const data = await res.json()
      setOrders(data.orders || [])
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSubmitting(true)
    const res = await fetch('/api/auth/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
    const data = await res.json()
    if (res.ok) { setCustomer(data.customer); fetchOrders() }
    else { setError(data.error || 'Login failed') }
    setSubmitting(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSubmitting(true)
    const res = await fetch('/api/auth/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    })
    const data = await res.json()
    if (res.ok) { setCustomer(data.customer) }
    else { setError(data.error || 'Registration failed') }
    setSubmitting(false)
  }

  async function handleLogout() {
    await fetch('/api/auth/customer/logout', { method: 'POST' })
    setCustomer(null); setOrders([])
  }

  if (loading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!customer) {
    return (
      <div className="min-h-screen pt-24 bg-[#FAF6F0]">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#1C1C1E] mb-2">My Account</h1>
            <p className="text-sm text-[#8A8A8E]">Sign in to track orders and manage your preferences.</p>
          </div>

          {/* Mode tabs */}
          <div className="flex border border-[#E8DDD0] rounded-full p-1 mb-8">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 text-xs tracking-widest uppercase rounded-full transition-colors ${
                  mode === m ? 'bg-[#C9A05B] text-white' : 'text-[#8A8A8E]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4 text-center">
              {error}
            </p>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-[#8A8A8E] mb-1 block">Email</label>
                <input
                  type="email" required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A8A8E] mb-1 block">Password</label>
                <input
                  type="password" required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-[#C9A05B] hover:bg-[#A8823A] text-white py-3.5 text-xs tracking-widest uppercase transition-colors disabled:opacity-60 mt-2"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-xs text-[#8A8A8E]">
                Demo: priya@example.com / password123
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Password', key: 'password', type: 'password' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-[#8A8A8E] mb-1 block">{f.label}</label>
                  <input
                    type={f.type} required
                    value={registerForm[f.key as keyof typeof registerForm]}
                    onChange={(e) => setRegisterForm((r) => ({ ...r, [f.key]: e.target.value }))}
                    className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                  />
                </div>
              ))}
              <button
                type="submit" disabled={submitting}
                className="w-full bg-[#C9A05B] hover:bg-[#A8823A] text-white py-3.5 text-xs tracking-widest uppercase transition-colors disabled:opacity-60 mt-2"
              >
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    pending_instore: 'bg-yellow-100 text-yellow-700',
    paid_instore: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen pt-24 bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl text-[#1C1C1E]">Hello, {customer.name.split(' ')[0]}</h1>
            <p className="text-sm text-[#8A8A8E] mt-1">{customer.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-[#8A8A8E] hover:text-[#1C1C1E] border border-[#E8DDD0] px-3 py-2 rounded-full transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Package, label: 'My Orders', href: '/account/orders', count: orders.length },
            { icon: Heart, label: 'Wishlist', href: '/wishlist' },
            { icon: Settings, label: 'Settings', href: '#' },
            { icon: User, label: 'Profile', href: '#' },
          ].map(({ icon: Icon, label, href, count }) => (
            <Link
              key={label}
              href={href}
              className="bg-white border border-[#E8DDD0] rounded-xl p-4 flex flex-col items-center gap-2 hover:border-[#C9A05B] transition-colors text-center group"
            >
              <Icon size={20} className="text-[#C9A05B] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#1C1C1E]">{label}</span>
              {count !== undefined && <span className="text-[10px] text-[#8A8A8E]">{count} items</span>}
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <h2 className="font-medium text-[#1C1C1E] mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-white border border-[#E8DDD0] rounded-xl p-8 text-center">
            <Package size={32} className="text-[#E8DDD0] mx-auto mb-3" />
            <p className="text-sm text-[#8A8A8E]">No orders yet. Time to treat yourself.</p>
            <Link href="/collections" className="text-xs text-[#C9A05B] mt-3 inline-block underline-anim">Shop now</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="bg-white border border-[#E8DDD0] rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[#1C1C1E]">#{order.orderNumber}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    {order.type === 'reservation' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-[#C9A05B]/10 text-[#C9A05B]">
                        In-Store
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8A8A8E]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')} · {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

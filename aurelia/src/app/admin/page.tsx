'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, CalendarCheck, Users, TrendingUp, AlertTriangle, Package, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Stats {
  totalOrders: number; onlineOrders: number; pendingReservations: number
  totalRevenue: number; totalCustomers: number
  lowStockProducts: Array<{ id: string; name: string; stock: number; sku: string }>
}
interface RecentOrder {
  id: string; orderNumber: string; type: string; status: string; totalAmount: number; createdAt: string
  customer?: { name: string; email: string }; guestName?: string
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then((d) => {
      setStats(d.stats)
      setRecentOrders(d.recentOrders || [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const tiles = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/orders' },
    { label: 'Online Orders', value: String(stats?.onlineOrders || 0), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/orders' },
    { label: 'Pending Reservations', value: String(stats?.pendingReservations || 0), icon: CalendarCheck, color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/admin/orders?type=reservation' },
    { label: 'Customers', value: String(stats?.totalCustomers || 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/customers' },
  ]

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-[#C9A05B]/30 transition-colors">
            <div className={`w-10 h-10 rounded-lg ${tile.bg} flex items-center justify-center mb-3`}>
              <tile.icon size={18} className={tile.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{tile.value}</p>
            <p className="text-xs text-gray-500 mt-1">{tile.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#C9A05B] flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.slice(0, 8).map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">#{order.orderNumber}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.customer?.name || order.guestName || 'Guest'} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${order.type === 'reservation' ? 'bg-[#C9A05B]/10 text-[#C9A05B]' : 'bg-gray-100 text-gray-500'}`}>
                    {order.type === 'reservation' ? 'In-Store' : 'Online'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 p-5 border-b border-gray-100">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="font-semibold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {(stats?.lowStockProducts || []).length === 0 ? (
              <p className="text-sm text-gray-400 p-5 text-center">All products well-stocked</p>
            ) : (
              (stats?.lowStockProducts || []).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-32">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.sku}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {p.stock === 0 ? 'OOS' : `${p.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-100">
            <Link href="/admin/products" className="text-xs text-[#C9A05B] flex items-center gap-1">
              Manage products <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

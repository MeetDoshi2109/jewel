'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  CalendarCheck,
  Users,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowRight,
  Plus,
  Truck,
  ExternalLink,
  Store,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Stats {
  totalOrders: number
  onlineOrders: number
  pendingReservations: number
  totalRevenue: number
  totalCustomers: number
  lowStockProducts: Array<{ id: string; name: string; stock: number; sku: string }>
}

interface RecentOrder {
  id: string
  orderNumber: string
  type: string
  status: string
  totalAmount: number
  createdAt: string
  customer?: { name: string; email: string }
  guestName?: string
  trackingNumber?: string
}

interface StatusCount {
  status: string
  _count: { status: number }
}

const statusColors: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped: 'bg-orange-50 text-orange-700 border-orange-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending_instore: 'bg-amber-50 text-amber-700 border-amber-200',
  paid_instore: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [ordersByStatus, setOrdersByStatus] = useState<StatusCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats)
        setRecentOrders(d.recentOrders || [])
        setOrdersByStatus(d.ordersByStatus || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tiles = [
    {
      label: 'Gross Online Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/orders?type=online',
      hint: 'Paid online checkout orders',
    },
    {
      label: 'Insured Deliveries',
      value: String(stats?.onlineOrders || 0),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/orders?type=online',
      hint: 'Direct home shipments',
    },
    {
      label: 'Boutique Reservations',
      value: String(stats?.pendingReservations || 0),
      icon: CalendarCheck,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/orders?type=reservation&status=pending_instore',
      hint: 'Awaiting client store visit',
    },
    {
      label: 'Registered Patrons',
      value: String(stats?.totalCustomers || 0),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/admin/customers',
      hint: 'Client profiles & history',
    },
  ]

  const statusMap = ordersByStatus.reduce((acc, curr) => {
    acc[curr.status] = curr._count.status
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header & Quick Action Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maison Command Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time atelier oversight, order fulfillment, and client communications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products?action=new"
            className="flex items-center gap-2 bg-[#C9A05B] hover:bg-[#A8823A] text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus size={14} /> Catalog Piece
          </Link>
          <Link
            href="/account/track"
            target="_blank"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Truck size={14} className="text-[#C9A05B]" /> Track Tool
            <ExternalLink size={12} className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-[#C9A05B]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${tile.bg} flex items-center justify-center`}>
                <tile.icon size={19} className={tile.color} />
              </div>
              <ArrowRight
                size={14}
                className="text-gray-300 group-hover:text-[#C9A05B] group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-serif">{tile.value}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{tile.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{tile.hint}</p>
          </Link>
        ))}
      </div>

      {/* Order Status Pipeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#C9A05B]" />
            <h2 className="font-semibold text-gray-900 text-sm">Fulfillment Status Pipeline</h2>
          </div>
          <Link href="/admin/orders" className="text-xs text-[#C9A05B] hover:underline font-semibold">
            View all orders →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { key: 'placed', label: 'Placed (New)', count: statusMap['placed'] || 0, color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { key: 'confirmed', label: 'Confirmed', count: statusMap['confirmed'] || 0, color: 'text-purple-700 bg-purple-50 border-purple-200' },
            { key: 'shipped', label: 'In Transit', count: statusMap['shipped'] || 0, color: 'text-orange-700 bg-orange-50 border-orange-200' },
            { key: 'delivered', label: 'Delivered', count: statusMap['delivered'] || 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { key: 'pending_instore', label: 'In-Store Pending', count: statusMap['pending_instore'] || 0, color: 'text-amber-800 bg-amber-50 border-amber-200' },
            { key: 'paid_instore', label: 'Boutique Paid', count: statusMap['paid_instore'] || 0, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
          ].map((item) => (
            <Link
              key={item.key}
              href={`/admin/orders?status=${item.key}`}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-transform hover:-translate-y-0.5 ${item.color}`}
            >
              <span className="text-[11px] font-semibold">{item.label}</span>
              <span className="text-xl font-bold mt-1.5">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Orders & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#FAF6F0]/40">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Customer Inquiries & Orders</h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest 8 orders received across all channels</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#C9A05B] font-semibold flex items-center gap-1 hover:underline"
            >
              All Orders <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-400">No orders registered yet</p>
            ) : (
              recentOrders.slice(0, 8).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold font-mono text-gray-900">#{order.orderNumber}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold border ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      {order.type === 'reservation' && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 rounded font-medium">
                          Boutique
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.customer?.name || order.guestName || 'Guest'} •{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <Link
                      href={`/admin/orders?q=${order.orderNumber}`}
                      className="p-1.5 text-gray-400 hover:text-[#C9A05B] rounded-lg hover:bg-gray-100 transition-colors"
                      title="Manage Order"
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atelier Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center gap-2 p-5 border-b border-gray-100 bg-[#FAF6F0]/40">
              <AlertTriangle size={17} className="text-orange-500" />
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Low Stock Inventory</h2>
                <p className="text-[11px] text-gray-400">Pieces needing workshop casting</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {(stats?.lowStockProducts || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  All jewellery designs are well-stocked in the atelier
                </div>
              ) : (
                (stats?.lowStockProducts || []).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50/70 transition-colors">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-gray-900 truncate max-w-36">{p.name}</p>
                      <p className="text-[10px] font-mono text-gray-400">{p.sku}</p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        p.stock === 0
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Link
              href="/admin/products"
              className="w-full flex items-center justify-center gap-1.5 text-xs text-[#C9A05B] font-semibold hover:underline"
            >
              Open Inventory Manager <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

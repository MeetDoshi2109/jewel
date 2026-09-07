'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import {
  Search,
  User,
  ShoppingBag,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Package,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomerOrder {
  id: string
  orderNumber?: string
  totalAmount: number
  status: string
  type: string
  createdAt: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  orders: CustomerOrder[]
}

const statusColors: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped: 'bg-orange-50 text-orange-700 border-orange-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending_instore: 'bg-amber-50 text-amber-700 border-amber-200',
  paid_instore: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ready_for_pickup: 'bg-teal-50 text-teal-700 border-teal-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    params.set('page', String(page))
    params.set('limit', '20')
    const res = await fetch(`/api/admin/customers?${params}`)
    const data = await res.json()
    setCustomers(data.customers || [])
    setTotal(data.total || 0)
    setTotalPages(data.pages || 1)
    setLoading(false)
  }, [q, page])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-sm text-gray-500">{total} registered patrons & clients</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
          placeholder="Search by client name, email, or telephone..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C9A05B] bg-white shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3.5">Client</th>
                  <th className="text-left px-5 py-3.5 hidden sm:table-cell">Contact</th>
                  <th className="text-left px-5 py-3.5 hidden md:table-cell">Orders</th>
                  <th className="text-left px-5 py-3.5 hidden lg:table-cell">Lifetime Spend</th>
                  <th className="text-left px-5 py-3.5 hidden xl:table-cell">Member Since</th>
                  <th className="text-right px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <User size={36} className="mx-auto mb-2 opacity-30 text-[#C9A05B]" />
                      <p className="text-sm font-medium text-gray-600">No matching clients found</p>
                      <p className="text-xs text-gray-400 mt-0.5">Try refining your search keyword</p>
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0)
                    const onlineOrders = c.orders.filter((o) => o.type === 'online').length
                    const reservations = c.orders.filter((o) => o.type === 'reservation').length
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E8DDD0] flex items-center justify-center flex-shrink-0">
                              <span className="text-[#C9A05B] text-sm font-semibold uppercase">
                                {c.name ? c.name[0] : 'U'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{c.name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-400 truncate">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell font-mono text-xs">
                          {c.phone || '—'}
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <div className="flex gap-1.5 text-xs flex-wrap">
                            {onlineOrders > 0 && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium text-[11px]">
                                {onlineOrders} Online
                              </span>
                            )}
                            {reservations > 0 && (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium text-[11px]">
                                {reservations} In-Store
                              </span>
                            )}
                            {c.orders.length === 0 && <span className="text-gray-400 text-xs">No orders</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900 hidden lg:table-cell">
                          {totalSpent > 0 ? formatPrice(totalSpent) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs hidden xl:table-cell">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCustomer(c)
                            }}
                            className="text-xs text-[#C9A05B] font-semibold hover:underline px-2 py-1"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} clients)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-8 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#FAF6F0]/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border-2 border-[#C9A05B] flex items-center justify-center shadow-xs">
                    <span className="text-[#C9A05B] font-bold text-lg">
                      {selectedCustomer.name ? selectedCustomer.name[0] : 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-gray-900">{selectedCustomer.name}</h2>
                    <p className="text-xs text-gray-500">Aurelia Client Profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 rounded-lg hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Contact & Registration Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <Mail size={16} className="text-[#C9A05B] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Email</p>
                      <p className="text-xs font-medium text-gray-800 break-all">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <Phone size={16} className="text-[#C9A05B] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Telephone</p>
                      <p className="text-xs font-medium text-gray-800 font-mono">
                        {selectedCustomer.phone || 'Unlisted'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <Calendar size={16} className="text-[#C9A05B] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Client Since</p>
                      <p className="text-xs font-medium text-gray-800">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lifetime Spend Metrics */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DDD0]">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-semibold text-gray-500">Lifetime Purchases</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
                      {formatPrice(
                        selectedCustomer.orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
                      )}
                    </p>
                  </div>
                  <div className="text-center border-x border-[#E8DDD0]">
                    <p className="text-[10px] uppercase font-semibold text-gray-500">Online Deliveries</p>
                    <p className="text-base sm:text-lg font-bold text-blue-700 mt-0.5">
                      {selectedCustomer.orders.filter((o) => o.type === 'online').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-semibold text-gray-500">Boutique Visits</p>
                    <p className="text-base sm:text-lg font-bold text-[#A8823A] mt-0.5">
                      {selectedCustomer.orders.filter((o) => o.type === 'reservation').length}
                    </p>
                  </div>
                </div>

                {/* Orders History */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                      <Package size={14} className="text-[#C9A05B]" />
                      Order History ({selectedCustomer.orders.length})
                    </h3>
                  </div>

                  {selectedCustomer.orders.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400">
                      This client has not placed any orders yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {selectedCustomer.orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-900">
                                #{ord.orderNumber || ord.id.slice(0, 8)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold border ${
                                  statusColors[ord.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}
                              >
                                {ord.status.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 capitalize">
                              {ord.type === 'reservation' ? 'In-Store Boutique Reservation' : 'Online Insured Delivery'}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-900">
                              {formatPrice(ord.totalAmount)}
                            </span>
                            <div className="flex items-center gap-1">
                              {ord.orderNumber && (
                                <Link
                                  href={`/admin/orders?q=${ord.orderNumber}`}
                                  className="p-1.5 text-gray-400 hover:text-[#C9A05B] rounded"
                                  title="Manage Order"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

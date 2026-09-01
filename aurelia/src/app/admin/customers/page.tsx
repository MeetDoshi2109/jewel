'use client'

import { useEffect, useState, useCallback } from 'react'
import { formatPrice } from '@/lib/utils'
import { Search, User } from 'lucide-react'

interface Customer {
  id: string; name: string; email: string; phone: string; createdAt: string
  orders: Array<{ id: string; totalAmount: number; status: string; type: string }>
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    params.set('page', String(page))
    const res = await fetch(`/api/admin/customers?${params}`)
    const data = await res.json()
    setCustomers(data.customers || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [q, page])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{total} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A05B]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Orders</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Total Spent</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <User size={32} className="mx-auto mb-2 opacity-30" />
                    No customers found
                  </td>
                </tr>
              ) : customers.map((c) => {
                const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0)
                const onlineOrders = c.orders.filter((o) => o.type === 'online').length
                const reservations = c.orders.filter((o) => o.type === 'reservation').length
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#C9A05B]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#C9A05B] text-xs font-semibold">{c.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.phone || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-2 text-xs">
                        {onlineOrders > 0 && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">{onlineOrders} online</span>
                        )}
                        {reservations > 0 && (
                          <span className="px-1.5 py-0.5 bg-[#C9A05B]/10 text-[#C9A05B] rounded">{reservations} in-store</span>
                        )}
                        {c.orders.length === 0 && <span className="text-gray-400">No orders</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 hidden lg:table-cell">
                      {totalSpent > 0 ? formatPrice(totalSpent) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

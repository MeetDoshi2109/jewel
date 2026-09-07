'use client'

import { Suspense } from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatPrice, cn } from '@/lib/utils'
import { ChevronDown, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Order {
  id: string; orderNumber: string; type: string; status: string; totalAmount: number
  guestName: string; guestEmail: string; guestPhone: string
  preferredStore: string; preferredDate: string; reservationNotes: string; adminNotes: string
  inStorePaymentAmount: number; inStorePaymentMethod: string
  trackingNumber: string; courierName: string
  createdAt: string; updatedAt: string
  customer?: { name: string; email: string; phone: string }
  items: Array<{ id: string; name: string; quantity: number; price: number; product?: { images: string[] } }>
}

const ONLINE_STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled']
const RESERVATION_STATUSES = ['pending_instore', 'paid_instore', 'processing', 'ready_for_pickup', 'completed', 'cancelled']

const statusColors: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700',
  pending_instore: 'bg-yellow-100 text-yellow-700', paid_instore: 'bg-emerald-100 text-emerald-700',
  processing: 'bg-indigo-100 text-indigo-700', ready_for_pickup: 'bg-teal-100 text-teal-700',
  completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
}

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    status: order.status, adminNotes: order.adminNotes,
    inStorePaymentAmount: order.inStorePaymentAmount,
    inStorePaymentMethod: order.inStorePaymentMethod,
    trackingNumber: order.trackingNumber, courierName: order.courierName,
  })

  const isReservation = order.type === 'reservation'
  const statuses = isReservation ? RESERVATION_STATUSES : ONLINE_STATUSES
  const customerName = order.customer?.name || order.guestName || 'Guest'

  const handleSave = async () => {
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success('Order updated')
      setEditing(false)
      onUpdate()
    } else {
      toast.error('Update failed')
    }
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      {/* Summary row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <ChevronDown size={14} className={cn('text-gray-400 transition-transform flex-shrink-0', expanded ? 'rotate-180' : '')} />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-gray-400">Order</p>
            <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Customer</p>
            <p className="text-sm font-medium text-gray-900 truncate">{customerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Amount</p>
            <p className="text-sm font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
            {isReservation && (
              <span className="px-2 py-0.5 rounded-full text-[9px] uppercase bg-[#C9A05B]/10 text-[#C9A05B]">In-Store</span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
          {new Date(order.createdAt).toLocaleDateString('en-IN')}
        </p>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-5">
          {/* Customer + items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Customer Details</p>
              <p className="text-sm text-gray-900">{customerName}</p>
              <p className="text-xs text-gray-500">{order.customer?.email || order.guestEmail}</p>
              <p className="text-xs text-gray-500">{order.customer?.phone || order.guestPhone}</p>
              {isReservation && (
                <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs">
                  <p className="font-medium text-yellow-800 mb-1">Reservation Details</p>
                  <p className="text-yellow-700">Store: {order.preferredStore}</p>
                  {order.preferredDate && <p className="text-yellow-700">Visit: {order.preferredDate}</p>}
                  {order.reservationNotes && <p className="text-yellow-700 mt-1">Notes: {order.reservationNotes}</p>}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Items</p>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="text-gray-900 font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit section */}
          {editing ? (
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A05B]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                {isReservation && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Payment Amount (₹)</label>
                      <input
                        type="number"
                        value={form.inStorePaymentAmount}
                        onChange={(e) => setForm((f) => ({ ...f, inStorePaymentAmount: parseFloat(e.target.value) }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Payment Method</label>
                      <input
                        value={form.inStorePaymentMethod}
                        onChange={(e) => setForm((f) => ({ ...f, inStorePaymentMethod: e.target.value }))}
                        placeholder="Cash / Card / UPI"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </>
                )}
                {!isReservation && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Tracking Number</label>
                      <input
                        value={form.trackingNumber}
                        onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Courier</label>
                      <input
                        value={form.courierName}
                        onChange={(e) => setForm((f) => ({ ...f, courierName: e.target.value }))}
                        placeholder="Bluedart / DTDC / etc."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Internal Notes</label>
                <textarea
                  rows={2}
                  value={form.adminNotes}
                  onChange={(e) => setForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-[#C9A05B] text-white px-4 py-2 text-xs uppercase tracking-wider rounded-lg">Save Changes</button>
                <button onClick={() => setEditing(false)} className="text-gray-500 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditing(true)}
                className="bg-[#1C1C1E] text-white px-4 py-2 text-xs uppercase tracking-wider rounded-lg"
              >
                Update Order
              </button>
              {order.adminNotes && (
                <p className="text-xs text-gray-500 italic">Note: {order.adminNotes}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" /></div>}>
      <OrdersInner />
    </Suspense>
  )
}

function OrdersInner() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const [activeTab, setActiveTab] = useState<'online' | 'reservation'>(
    typeParam === 'reservation' ? 'reservation' : 'online'
  )
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/orders?type=${activeTab}&page=${page}&limit=15`)
    const data = await res.json()
    setOrders(data.orders || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [activeTab, page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{total} total</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: 'online', label: 'Online Orders' },
          { key: 'reservation', label: 'In-Store Reservations' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as 'online' | 'reservation'); setPage(1) }}
            className={cn(
              'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-[#C9A05B] text-[#C9A05B]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No {activeTab === 'reservation' ? 'reservations' : 'orders'} found</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onUpdate={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  )
}

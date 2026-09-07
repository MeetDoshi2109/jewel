'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, cn } from '@/lib/utils'
import {
  ChevronDown,
  Search,
  ExternalLink,
  Truck,
  Package,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  CreditCard,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  type: string
  status: string
  totalAmount: number
  guestName: string
  guestEmail: string
  guestPhone: string
  preferredStore: string
  preferredDate: string
  reservationNotes: string
  adminNotes: string
  inStorePaymentAmount: number
  inStorePaymentMethod: string
  trackingNumber: string
  courierName: string
  createdAt: string
  updatedAt: string
  customer?: { name: string; email: string; phone: string }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    product?: { images: string[]; slug?: string }
  }>
  shippingAddress?: {
    name?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
    phone?: string
  } | null
}

const ONLINE_STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled']
const RESERVATION_STATUSES = [
  'pending_instore',
  'paid_instore',
  'processing',
  'ready_for_pickup',
  'completed',
  'cancelled',
]

const statusColors: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped: 'bg-orange-50 text-orange-700 border-orange-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending_instore: 'bg-amber-50 text-amber-700 border-amber-200',
  paid_instore: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  ready_for_pickup: 'bg-teal-50 text-teal-700 border-teal-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    status: order.status,
    adminNotes: order.adminNotes || '',
    inStorePaymentAmount: order.inStorePaymentAmount || 0,
    inStorePaymentMethod: order.inStorePaymentMethod || '',
    trackingNumber: order.trackingNumber || '',
    courierName: order.courierName || '',
  })
  const [saving, setSaving] = useState(false)

  const isReservation = order.type === 'reservation'
  const statuses = isReservation ? RESERVATION_STATUSES : ONLINE_STATUSES
  const customerName = order.customer?.name || order.guestName || 'Guest'
  const customerEmail = order.customer?.email || order.guestEmail || '—'
  const customerPhone = order.customer?.phone || order.guestPhone || '—'

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success(`Order #${order.orderNumber} updated`)
        setEditing(false)
        onUpdate()
      } else {
        toast.error('Update failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:border-gray-300">
      {/* Summary Row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/70 transition-colors"
      >
        <ChevronDown
          size={16}
          className={cn('text-gray-400 transition-transform flex-shrink-0', expanded ? 'rotate-180' : '')}
        />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Order</span>
            <p className="text-sm font-semibold text-gray-900 font-mono">#{order.orderNumber}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Customer</span>
            <p className="text-sm font-medium text-gray-900 truncate">{customerName}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Amount</span>
            <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border',
                statusColors[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'
              )}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
            {isReservation && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-[#C9A05B]/15 text-[#96722D] border border-[#C9A05B]/30">
                In-Store
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-xs text-gray-500 font-medium">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 sm:p-6 space-y-6 bg-gray-50/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer & Destination */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                <User size={14} className="text-[#C9A05B]" />
                Customer & Destination
              </div>
              <div className="text-xs space-y-1 text-gray-700">
                <p className="font-semibold text-sm text-gray-900">{customerName}</p>
                <p className="text-gray-500">Email: <span className="text-gray-900">{customerEmail}</span></p>
                <p className="text-gray-500">Phone: <span className="text-gray-900">{customerPhone}</span></p>

                {order.shippingAddress && (
                  <div className="mt-3 pt-2 border-t border-gray-100 text-gray-600">
                    <p className="font-medium text-gray-900 mb-0.5">Shipping Address:</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                )}

                {isReservation && (
                  <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs">
                    <p className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                      <MapPin size={13} />
                      Boutique Reservation
                    </p>
                    <p className="text-amber-800 font-medium">Store: {order.preferredStore || 'Jaipur Flagship'}</p>
                    {order.preferredDate && (
                      <p className="text-amber-700 mt-0.5">Preferred Date: {order.preferredDate}</p>
                    )}
                    {order.reservationNotes && (
                      <p className="text-amber-700 italic mt-1">&quot;{order.reservationNotes}&quot;</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Package size={14} className="text-[#C9A05B]" />
                  Items ({order.items.length})
                </span>
                <span className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                {order.items.map((item) => {
                  const image = item.product?.images?.[0] || '/images/2ring.jpg'
                  return (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <Image src={image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Transit/AWB Info if Shipped */}
              {order.trackingNumber && (
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-500 font-sans">AWB Dispatch:</span>
                  <span className="font-semibold text-[#1C1C1E] bg-gray-100 px-2 py-0.5 rounded">
                    {order.courierName || 'BlueDart'}: {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Edit / Management Panel */}
          {editing ? (
            <div className="bg-white rounded-xl p-5 border-2 border-[#C9A05B]/30 space-y-4 shadow-sm">
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-800">
                Update Order #{order.orderNumber}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#C9A05B] bg-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {!isReservation && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-medium">Courier Service</label>
                      <input
                        value={form.courierName}
                        onChange={(e) => setForm((f) => ({ ...f, courierName: e.target.value }))}
                        placeholder="BlueDart / Sequel / Delhivery"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C9A05B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-medium">Tracking Number (AWB)</label>
                      <input
                        value={form.trackingNumber}
                        onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
                        placeholder="e.g. BLU-84920491"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C9A05B] font-mono"
                      />
                    </div>
                  </>
                )}

                {isReservation && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-medium">In-Store Paid Amount (₹)</label>
                      <input
                        type="number"
                        value={form.inStorePaymentAmount}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, inStorePaymentAmount: parseFloat(e.target.value) || 0 }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C9A05B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-medium">Payment Mode</label>
                      <input
                        value={form.inStorePaymentMethod}
                        onChange={(e) => setForm((f) => ({ ...f, inStorePaymentMethod: e.target.value }))}
                        placeholder="UPI / Card / Cash"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C9A05B]"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Internal Staff Notes</label>
                <textarea
                  rows={2}
                  value={form.adminNotes}
                  onChange={(e) => setForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  placeholder="Notes for salon team or dispatch log..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#C9A05B] resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#C9A05B] hover:bg-[#A8823A] text-white px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-500 hover:text-gray-700 text-xs px-3 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors"
                >
                  Update Status / Dispatch
                </button>

                {order.adminNotes && (
                  <span className="text-xs text-gray-500 italic bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                    Note: {order.adminNotes}
                  </span>
                )}
              </div>

              {/* Quick Customer Tracking Preview Link */}
              <Link
                href={`/account/track?orderNumber=${order.orderNumber}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9A05B] hover:underline"
              >
                <Truck size={13} />
                View Customer Tracking View
                <ExternalLink size={12} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OrdersInner() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'reservation'>(
    typeParam === 'reservation' ? 'reservation' : typeParam === 'online' ? 'online' : 'all'
  )
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeTab !== 'all') params.set('type', activeTab)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (searchQuery) params.set('q', searchQuery)
    params.set('page', String(page))
    params.set('limit', '15')

    const res = await fetch(`/api/admin/orders?${params}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setTotal(data.total || 0)
    setTotalPages(data.pages || 1)
    setLoading(false)
  }, [activeTab, statusFilter, searchQuery, page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setStatusFilter('all')
    setActiveTab('all')
    setPage(1)
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Reservations</h1>
          <p className="text-sm text-gray-500">
            {total} total orders matching criteria
          </p>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'online', label: 'Online Deliveries' },
          { key: 'reservation', label: 'In-Store Reservations' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as 'all' | 'online' | 'reservation')
              setPage(1)
            }}
            className={cn(
              'px-5 py-3 text-sm font-semibold border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-[#C9A05B] text-[#A8823A]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order #, customer name, email, phone, or courier AWB..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A05B]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white focus:outline-none focus:border-[#C9A05B]"
            >
              <option value="all">All Statuses</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending_instore">Pending In-Store</option>
              <option value="paid_instore">Paid In-Store</option>
              <option value="ready_for_pickup">Ready For Pickup</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all' || activeTab !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-xs text-rose-700 hover:text-rose-900 border border-rose-200 rounded-lg bg-rose-50/60 font-medium whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Package size={36} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 mb-1">No Orders Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query or filter parameters.
          </p>
          <button
            onClick={handleClearFilters}
            className="text-xs text-[#C9A05B] font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onUpdate={fetchOrders} />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} orders)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrdersInner />
    </Suspense>
  )
}

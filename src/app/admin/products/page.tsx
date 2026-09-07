'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { formatPrice, cn, CATEGORIES } from '@/lib/utils'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  material: string
  stock: number
  inStock: boolean
  isPremium: boolean
  isFeatured: boolean
  isBestseller: boolean
  images: string[]
  tags?: string[]
  description?: string
}

interface ProductForm {
  name: string
  sku: string
  category: string
  price: string
  material: string
  description: string
  images: string
  stock: string
  tags: string
  isPremium: boolean
  isFeatured: boolean
  isBestseller: boolean
}

const EMPTY_FORM: ProductForm = {
  name: '',
  sku: '',
  category: 'rings',
  price: '',
  material: '',
  description: '',
  images: '',
  stock: '',
  tags: '',
  isPremium: false,
  isFeatured: false,
  isBestseller: false,
}

function ProductsInner() {
  const searchParams = useSearchParams()
  const initialAction = searchParams.get('action')

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    params.set('page', String(page))
    params.set('limit', '15')
    const res = await fetch(`/api/admin/products?${params}`)
    const data = await res.json()
    setProducts(data.products || [])
    setTotal(data.total || 0)
    setTotalPages(data.pages || 1)
    setLoading(false)
  }, [q, category, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (initialAction === 'new') {
      openCreate()
    }
  }, [initialAction])

  const openCreate = () => {
    setEditingProduct(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingProduct(p)
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      material: p.material,
      description: p.description || '',
      images: (p.images || []).join(', '),
      stock: String(p.stock),
      tags: (p.tags || []).join(', '),
      isPremium: p.isPremium,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      images: form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
    const method = editingProduct ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        toast.success(editingProduct ? 'Product details updated' : 'New masterpiece catalogued')
        setModalOpen(false)
        fetchProducts()
      } else {
        toast.error('Failed to save product')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you wish to delete "${name}" from the catalogue?`)) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Product removed')
        fetchProducts()
      } else {
        toast.error('Delete failed')
      }
    } catch {
      toast.error('Network error')
    }
  }

  const handleToggleStock = async (p: Product) => {
    const nextInStock = !p.inStock
    const nextStock = nextInStock ? (p.stock > 0 ? p.stock : 5) : 0
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: nextInStock, stock: nextStock }),
      })
      if (res.ok) {
        toast.success(nextInStock ? `${p.name} marked In Stock` : `${p.name} marked Out of Stock`)
        fetchProducts()
      }
    } catch {
      toast.error('Stock toggle failed')
    }
  }

  const previewImages = form.images
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http') || s.startsWith('/'))

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalogue</h1>
          <p className="text-sm text-gray-500">{total} fine jewelry creations</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#C9A05B] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#A8823A] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Piece
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name, SKU, or metal..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C9A05B] bg-white shadow-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
          className="text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C9A05B] bg-white shadow-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <AlertCircle size={36} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No products match your criteria</p>
          <button
            onClick={() => {
              setQ('')
              setCategory('')
              setPage(1)
            }}
            className="text-xs text-[#C9A05B] font-semibold mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3.5">Piece</th>
                  <th className="text-left px-5 py-3.5 hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3.5">Price & Tier</th>
                  <th className="text-left px-5 py-3.5 hidden md:table-cell">Inventory Status</th>
                  <th className="text-left px-5 py-3.5 hidden lg:table-cell">Attributes</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F2EBE0] flex-shrink-0 border border-gray-200/80">
                          {p.images[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-44 sm:max-w-xs">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-gray-400">{p.sku}</span>
                            <span className="text-[11px] text-gray-500">• {p.material}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 capitalize hidden sm:table-cell font-medium text-xs">
                      {p.category}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900">{formatPrice(p.price)}</span>
                        {p.isPremium && (
                          <span className="text-[9px] text-[#A8823A] uppercase tracking-wider font-semibold">
                            High Jewelry
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStock(p)}
                          title="Click to toggle In/Out of Stock"
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-semibold transition-all border',
                            p.stock === 0 || !p.inStock
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : p.stock < 5
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          )}
                        >
                          {p.stock === 0 || !p.inStock ? 'Out of Stock' : `${p.stock} in atelier`}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="flex gap-1.5 flex-wrap max-w-xs">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-medium rounded-md">
                            Featured
                          </span>
                        )}
                        {p.isBestseller && (
                          <span className="px-2 py-0.5 bg-[#FAF6F0] text-[#A8823A] border border-[#E8DDD0] text-[10px] font-medium rounded-md">
                            Bestseller
                          </span>
                        )}
                        {p.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-gray-400 hover:text-[#C9A05B] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} pieces)
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

      {/* Product Edit / Add Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
              onClick={() => !saving && setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="fixed inset-x-4 top-8 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#FAF6F0]/70">
                <div>
                  <h2 className="font-serif text-lg font-bold text-gray-900">
                    {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Catalog New Piece'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editingProduct ? `SKU: ${editingProduct.sku}` : 'Enter luxury specifications and imagery'}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Product Title *', key: 'name', type: 'text', placeholder: 'e.g. Solitaire Diamond Ring' },
                    { label: 'SKU Code', key: 'sku', type: 'text', placeholder: 'e.g. AUR-RNG-001' },
                    { label: 'Price (₹) *', key: 'price', type: 'number', placeholder: '45000' },
                    { label: 'Stock in Atelier *', key: 'stock', type: 'number', placeholder: '10' },
                    { label: 'Precious Metal / Material *', key: 'material', type: 'text', placeholder: '18k Yellow Gold, VVS1' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">{f.label}</label>
                      <input
                        type={f.type}
                        required={f.label.endsWith('*')}
                        placeholder={f.placeholder}
                        value={form[f.key as keyof ProductForm] as string}
                        onChange={(e) => setForm((fr) => ({ ...fr, [f.key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#C9A05B] bg-white"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#C9A05B] bg-white capitalize"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Description & Craftsmanship Story</label>
                  <textarea
                    rows={3}
                    placeholder="Handcrafted in Jaipur with conflict-free diamonds..."
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#C9A05B] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Image URLs (Comma-separated HTTPS or internal /images/... links)
                  </label>
                  <textarea
                    rows={2}
                    value={form.images}
                    onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#C9A05B] resize-none"
                    placeholder="/images/1ring.jpg, https://images.unsplash.com/..."
                  />
                  {/* Live Thumbnails Preview */}
                  {previewImages.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Preview:</span>
                      {previewImages.map((url, i) => (
                        <div
                          key={i}
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
                        >
                          <Image src={url} alt={`Preview ${i}`} fill className="object-cover" sizes="48px" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="diamond, wedding, handcrafted, emerald"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#C9A05B]"
                  />
                </div>

                <div className="flex flex-wrap gap-6 pt-2 pb-2">
                  {[
                    { key: 'isPremium', label: 'High Jewelry (>₹10,000)' },
                    { key: 'isFeatured', label: 'Featured on Homepage' },
                    { key: 'isBestseller', label: 'Bestseller Badge' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={form[key as keyof ProductForm] as boolean}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                        className="accent-[#C9A05B] w-4 h-4 rounded"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#C9A05B] hover:bg-[#A8823A] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl disabled:opacity-60 transition-colors"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Save Modifications' : 'Publish to Atelier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-xs px-4 py-2 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsInner />
    </Suspense>
  )
}

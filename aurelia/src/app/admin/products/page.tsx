'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { formatPrice, cn, CATEGORIES } from '@/lib/utils'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Product {
  id: string; sku: string; name: string; category: string; price: number
  material: string; stock: number; inStock: boolean; isPremium: boolean
  isFeatured: boolean; isBestseller: boolean; images: string[]
}

interface ProductForm {
  name: string; sku: string; category: string; price: string; material: string
  description: string; images: string; stock: string; tags: string
  isPremium: boolean; isFeatured: boolean; isBestseller: boolean
}

const EMPTY_FORM: ProductForm = {
  name: '', sku: '', category: 'rings', price: '', material: '', description: '',
  images: '', stock: '', tags: '', isPremium: false, isFeatured: false, isBestseller: false,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
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
    const res = await fetch(`/api/admin/products?${params}`)
    const data = await res.json()
    setProducts(data.products || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [q, category, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const openCreate = () => {
    setEditingProduct(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingProduct(p)
    setForm({
      name: p.name, sku: p.sku, category: p.category, price: String(p.price),
      material: p.material, description: '', images: p.images.join(', '),
      stock: String(p.stock), tags: '', isPremium: p.isPremium,
      isFeatured: p.isFeatured, isBestseller: p.isBestseller,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    }
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
    const method = editingProduct ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      toast.success(editingProduct ? 'Product updated' : 'Product created')
      setModalOpen(false)
      fetchProducts()
    } else {
      toast.error('Failed to save product')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Product deleted'); fetchProducts() }
    else toast.error('Delete failed')
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#C9A05B] text-white px-4 py-2.5 text-xs uppercase tracking-wider rounded-lg hover:bg-[#A8823A] transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A05B]"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A05B] bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Product</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Tags</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2EBE0] flex-shrink-0">
                        {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-32">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-gray-900">{formatPrice(p.price)}</span>
                      {p.isPremium && <span className="text-[9px] text-[#C9A05B] uppercase tracking-wider">Premium</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock < 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'
                    )}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {p.isFeatured && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[9px] rounded">Featured</span>}
                      {p.isBestseller && <span className="px-1.5 py-0.5 bg-[#C9A05B]/10 text-[#C9A05B] text-[9px] rounded">Bestseller</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-[#C9A05B] rounded">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => !saving && setModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-4 top-8 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setModalOpen(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Product Name *', key: 'name', type: 'text' },
                    { label: 'SKU', key: 'sku', type: 'text' },
                    { label: 'Price (₹) *', key: 'price', type: 'number' },
                    { label: 'Stock *', key: 'stock', type: 'number' },
                    { label: 'Material *', key: 'material', type: 'text' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                      <input
                        type={f.type}
                        required={f.label.endsWith('*')}
                        value={form[f.key as keyof ProductForm] as string}
                        onChange={(e) => setForm((fr) => ({ ...fr, [f.key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A05B]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A05B]"
                    >
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A05B] resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Image URLs (comma-separated)</label>
                  <textarea
                    rows={2}
                    value={form.images}
                    onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A05B] resize-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="flex gap-5">
                  {[
                    { key: 'isPremium', label: 'Premium (>₹10k)' },
                    { key: 'isFeatured', label: 'Featured' },
                    { key: 'isBestseller', label: 'Bestseller' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={form[key as keyof ProductForm] as boolean}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                        className="accent-[#C9A05B]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit" disabled={saving}
                    className="bg-[#C9A05B] text-white px-5 py-2.5 text-xs uppercase tracking-wider rounded-lg disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="text-gray-500 text-sm">Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

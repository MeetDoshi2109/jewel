'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Bell,
  Package,
  Heart,
  LogOut,
  Save,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export default function ProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  // Preferences State
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    whatsappTracking: true,
    exclusiveCollections: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/auth/customer/me')
      const data = await res.json()
      if (res.ok && data.customer) {
        setCustomer(data.customer)
        setName(data.customer.name || '')
        setPhone(data.customer.phone || '')
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg('')

    try {
      const res = await fetch('/api/auth/customer/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })

      const data = await res.json()
      if (res.ok && data.customer) {
        setCustomer(data.customer)
        toast.success('Profile updated successfully!')
        setProfileMsg('Changes saved.')
        setTimeout(() => setProfileMsg(''), 3000)
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setSavingPassword(true)

    try {
      const res = await fetch('/api/auth/customer/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Password changed successfully!')
        setPasswordMsg({ type: 'success', text: 'Password updated successfully' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPasswordMsg(null), 4000)
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/customer/logout', { method: 'POST' })
    window.location.href = '/account'
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F0]">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white border border-[#E8DDD0] flex items-center justify-center mx-auto mb-6">
            <User size={28} className="text-[#C9A05B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#1C1C1E] mb-3">Sign in Required</h1>
          <p className="text-sm text-[#8A8A8E] mb-8">
            Please log in to manage your personal details and security settings.
          </p>
          <Link
            href="/account"
            className="inline-block bg-[#1C1C1E] text-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A8A8E] hover:text-[#C9A05B] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8DDD0]">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#C9A05B] uppercase font-semibold">
              Personal Credentials & Security
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1E] mt-1">Profile & Settings</h1>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs text-rose-700 hover:text-rose-900 border border-rose-200 bg-rose-50/60 px-4 py-2 rounded-full transition-colors self-start sm:self-auto"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Personal Info & Notifications */}
          <div className="md:col-span-2 space-y-8">
            {/* Personal Details Card */}
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-7 shadow-sm">
              <h2 className="font-serif text-xl text-[#1C1C1E] mb-1">Personal Details</h2>
              <p className="text-xs text-[#8A8A8E] mb-6">
                Your contact details used for order confirmations and courier delivery notifications.
              </p>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs text-[#8A8A8E] mb-1.5 block font-medium">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#1C1C1E] focus:outline-none focus:border-[#C9A05B]"
                    />
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#8A8A8E] mb-1.5 block font-medium">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={customer.email}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F2EBE0]/60 border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#8A8A8E] cursor-not-allowed"
                    />
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
                  </div>
                  <span className="text-[10px] text-[#8A8A8E] mt-1 block">
                    Email address is tied to your account authentication and cannot be changed.
                  </span>
                </div>

                <div>
                  <label className="text-xs text-[#8A8A8E] mb-1.5 block font-medium">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#1C1C1E] focus:outline-none focus:border-[#C9A05B]"
                    />
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white px-6 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors disabled:opacity-60"
                  >
                    <Save size={14} />
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                  {profileMsg && <span className="text-xs text-emerald-700">{profileMsg}</span>}
                </div>
              </form>
            </div>

            {/* Notification Preferences Card */}
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-7 shadow-sm">
              <h2 className="font-serif text-xl text-[#1C1C1E] mb-1 flex items-center gap-2">
                <Bell size={18} className="text-[#C9A05B]" />
                Concierge Updates & Alerts
              </h2>
              <p className="text-xs text-[#8A8A8E] mb-5">
                Choose how you wish to receive updates regarding shipments and private showcase invites.
              </p>

              <div className="space-y-4 text-xs">
                {[
                  {
                    key: 'whatsappTracking',
                    title: 'WhatsApp Dispatch Updates',
                    desc: 'Real-time transit notifications and OTP delivery details on your WhatsApp.',
                  },
                  {
                    key: 'orderUpdates',
                    title: 'Email Order Summaries & Invoices',
                    desc: 'Official GIA certificate copies, digital tax invoices, and receipts.',
                  },
                  {
                    key: 'exclusiveCollections',
                    title: 'Private Salon & High-Jewellery Invitations',
                    desc: 'First access to bespoke releases and private boutique showcase sessions.',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-[#FAF6F0]/60 transition-colors cursor-pointer border border-transparent hover:border-[#E8DDD0]"
                  >
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="mt-0.5 rounded border-[#E8DDD0] text-[#C9A05B] focus:ring-[#C9A05B] h-4 w-4"
                    />
                    <div>
                      <span className="font-semibold text-[#1C1C1E] block">{item.title}</span>
                      <span className="text-[11px] text-[#8A8A8E] leading-relaxed block mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Password & Account Info */}
          <div className="space-y-6">
            {/* Password Update Card */}
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-lg text-[#1C1C1E] mb-1 flex items-center gap-2">
                <Shield size={16} className="text-[#C9A05B]" />
                Change Password
              </h2>
              <p className="text-[11px] text-[#8A8A8E] mb-4">
                Ensure your account is using a strong, unique password.
              </p>

              <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                <div>
                  <label className="text-[11px] text-[#8A8A8E] block mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0]/40 border border-[#E8DDD0] rounded-lg text-xs text-[#1C1C1E] focus:outline-none focus:border-[#C9A05B]"
                    />
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#8A8A8E] block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0]/40 border border-[#E8DDD0] rounded-lg text-xs text-[#1C1C1E] focus:outline-none focus:border-[#C9A05B]"
                    />
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#8A8A8E] block mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0]/40 border border-[#E8DDD0] rounded-lg text-xs text-[#1C1C1E] focus:outline-none focus:border-[#C9A05B]"
                    />
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-2.5 rounded-lg text-[11px] flex items-center gap-2 ${
                      passwordMsg.type === 'error'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {passwordMsg.type === 'error' ? (
                      <AlertCircle size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full bg-[#1C1C1E] hover:bg-[#2D2D2F] text-white py-2.5 text-[11px] uppercase tracking-wider font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#8A8A8E] font-semibold block mb-2">
                Account Navigation
              </span>

              <Link
                href="/account/orders"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF6F0] text-xs font-medium text-[#1C1C1E] transition-colors border border-transparent hover:border-[#E8DDD0]"
              >
                <span className="flex items-center gap-2">
                  <Package size={15} className="text-[#C9A05B]" />
                  My Orders
                </span>
                <span className="text-[10px] text-[#8A8A8E]">View History →</span>
              </Link>

              <Link
                href="/account/track"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF6F0] text-xs font-medium text-[#1C1C1E] transition-colors border border-transparent hover:border-[#E8DDD0]"
              >
                <span className="flex items-center gap-2">
                  <Shield size={15} className="text-[#C9A05B]" />
                  Track Any Order
                </span>
                <span className="text-[10px] text-[#8A8A8E]">Live Status →</span>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF6F0] text-xs font-medium text-[#1C1C1E] transition-colors border border-transparent hover:border-[#E8DDD0]"
              >
                <span className="flex items-center gap-2">
                  <Heart size={15} className="text-[#C9A05B]" />
                  Wishlist
                </span>
                <span className="text-[10px] text-[#8A8A8E]">Saved Pieces →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setSent(true)
  }

  return (
    <div className="min-h-screen pt-24 bg-[#FAF6F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-3">Get in Touch</p>
          <h1 className="font-serif text-5xl text-[#1C1C1E]">Contact Aurelia</h1>
          <p className="text-sm text-[#8A8A8E] mt-4 max-w-md mx-auto">
            Have a question about a piece, need help with an order, or want to book a private styling consultation? We're here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-medium text-[#1C1C1E] mb-5 text-lg">Our Stores</h2>
              {[
                {
                  city: 'Mumbai',
                  address: 'Shop 12, Palladium Mall, Lower Parel, Mumbai 400 013',
                  hours: 'Mon–Sat: 11am–8pm · Sun: 12pm–7pm',
                  phone: '+91 22 1234 5678',
                },
                {
                  city: 'Delhi',
                  address: 'Level 3, DLF Promenade, Vasant Kunj, New Delhi 110 070',
                  hours: 'Mon–Sat: 11am–8pm · Sun: 12pm–7pm',
                  phone: '+91 11 1234 5678',
                },
              ].map((store) => (
                <div key={store.city} className="bg-white border border-[#E8DDD0] rounded-xl p-5 mb-4">
                  <h3 className="font-medium text-[#1C1C1E] mb-3">Aurelia {store.city}</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2 text-xs text-[#8A8A8E]">
                      <MapPin size={13} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex gap-2 text-xs text-[#8A8A8E]">
                      <Clock size={13} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex gap-2 text-xs text-[#8A8A8E]">
                      <Phone size={13} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                      <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="hover:text-[#C9A05B]">{store.phone}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#C9A05B]" />
              <div>
                <p className="text-xs text-[#8A8A8E]">Email us at</p>
                <a href="mailto:hello@aurelia.in" className="text-sm font-medium text-[#1C1C1E] hover:text-[#C9A05B] transition-colors">hello@aurelia.in</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="bg-white border border-[#E8DDD0] rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#C9A05B]/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-[#C9A05B]" />
                </div>
                <h2 className="font-serif text-2xl text-[#1C1C1E] mb-2">Message received</h2>
                <p className="text-sm text-[#8A8A8E]">We'll respond within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#E8DDD0] rounded-2xl p-8 space-y-5">
                <h2 className="font-medium text-[#1C1C1E] text-lg mb-2">Send a Message</h2>
                {[
                  { label: 'Your Name *', key: 'name', type: 'text' },
                  { label: 'Email Address *', key: 'email', type: 'email' },
                  { label: 'Subject *', key: 'subject', type: 'text' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-[#8A8A8E] mb-1 block">{f.label}</label>
                    <input
                      type={f.type} required
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm((fr) => ({ ...fr, [f.key]: e.target.value }))}
                      className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B]"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-[#8A8A8E] mb-1 block">Message *</label>
                  <textarea
                    rows={5} required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A05B] resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C9A05B] hover:bg-[#A8823A] text-white py-3.5 text-xs tracking-widest uppercase transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

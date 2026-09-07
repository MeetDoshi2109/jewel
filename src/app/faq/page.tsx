'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    category: 'Orders & Shopping',
    items: [
      { q: 'What is the difference between a standard and a premium (in-store) purchase?', a: 'Products priced above ₹10,000 are categorised as Premium and require an in-person purchase at one of our flagship stores. You can Reserve them online — we\'ll hold the piece for 7 days while you arrange your visit. Standard products (below ₹10,000) can be ordered and paid for online with delivery to your address.' },
      { q: 'How do I reserve a premium item?', a: 'On the product page, click "Reserve for In-Store Payment." You\'ll fill in your name, contact, preferred store, and a convenient date to visit. We\'ll confirm your reservation by phone within one business day and hold the piece for 7 days.' },
      { q: 'Can I mix premium and standard items in one order?', a: 'No — premium and standard items have separate purchase flows. Premium items must be reserved individually through the in-store reservation form. Your standard items can be added to the cart and checked out normally.' },
      { q: 'Do you accept returns?', a: 'Yes — standard (online) purchases can be returned within 30 days if unused and in original packaging. We cannot accept returns on items that have been worn, resized, or engraved. Premium in-store purchases follow a separate return policy discussed at the time of purchase.' },
    ],
  },
  {
    category: 'Shipping',
    id: 'shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 4–6 business days across India. Express 2-day delivery is available in Mumbai and Delhi for an additional fee. All shipments are fully insured and require a signature on delivery.' },
      { q: 'Is shipping free?', a: 'Yes — we offer free standard shipping on all orders above ₹999. Orders below ₹999 attract a flat shipping fee of ₹99.' },
      { q: 'Can I track my order?', a: 'Yes. Once your order ships, you\'ll receive an SMS and email with a tracking link. You can also view your order status in the My Account section.' },
    ],
  },
  {
    category: 'Sizing',
    id: 'sizing',
    items: [
      { q: 'How do I find my ring size?', a: 'The most accurate method is to visit any Aurelia store for a professional sizing. Alternatively, wrap a thin strip of paper around your finger, mark where it overlaps, measure the length in mm, and compare to our size chart. Note that fingers can swell in heat — measure at room temperature.' },
      { q: 'Can rings be resized?', a: 'Most sterling silver and gold rings can be resized by one or two sizes. Eternity bands and rings with stones set all around generally cannot be resized. Contact our team before purchase if sizing is a concern.' },
    ],
  },
  {
    category: 'Care Instructions',
    id: 'care',
    items: [
      { q: 'How do I care for sterling silver jewellery?', a: 'Silver naturally tarnishes with exposure to air and moisture. Store pieces in an airtight zip-lock bag when not wearing them. Clean with a soft silver polishing cloth. Avoid contact with perfume, hairspray, and chlorinated water.' },
      { q: 'How do I care for gold-plated pieces?', a: 'Gold plating can wear over time with heavy use. Remove pieces before showering, swimming, or exercising. Clean gently with a slightly damp soft cloth and dry immediately. Avoid abrasive cleaners or ultrasonic cleaners.' },
      { q: 'How do I care for diamond and gemstone pieces?', a: 'Diamond pieces can be cleaned at home with warm water, a drop of mild dish soap, and a soft toothbrush. Rinse thoroughly and dry with a lint-free cloth. Bring them in for a professional clean and inspection every 12–18 months.' },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E8DDD0]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#C9A05B] transition-colors pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-[#8A8A8E] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#8A8A8E] leading-relaxed pb-5 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-24 bg-[#FAF6F0]">
      <div className="bg-[#F2EBE0] py-14 px-4 text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-3">Help Centre</p>
        <h1 className="font-serif text-5xl text-[#1C1C1E]">Frequently Asked Questions</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {faqs.map((section) => (
          <div key={section.category} id={section.id}>
            <h2 className="font-serif text-2xl text-[#1C1C1E] mb-2">{section.category}</h2>
            <div className="bg-white border border-[#E8DDD0] rounded-xl px-6">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

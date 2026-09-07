import { MapPin, Phone, Clock, Car, Train } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Stores', description: 'Find Aurelia Fine Jewellery stores in Mumbai and Delhi.' }

const stores = [
  {
    city: 'Mumbai', flag: '🏙️',
    name: 'Aurelia Mumbai — Palladium',
    address: 'Shop 12, Ground Level\nPalladium Mall, Senapati Bapat Marg\nLower Parel, Mumbai 400 013',
    phone: '+91 22 1234 5678',
    email: 'mumbai@aurelia.in',
    hours: [
      { day: 'Monday – Saturday', time: '11:00 AM – 8:00 PM' },
      { day: 'Sunday', time: '12:00 PM – 7:00 PM' },
    ],
    directions: [
      { icon: Train, text: 'Lower Parel Station (Central) — 5 min walk via bridge' },
      { icon: Car, text: 'Valet parking available. Enter from Dr. Annie Besant Road.' },
    ],
    mapEmbed: 'https://maps.google.com/maps?q=Palladium+Mall+Mumbai&output=embed',
    mapLink: 'https://maps.google.com/maps?q=Palladium+Mall+Mumbai',
  },
  {
    city: 'Delhi', flag: '🕌',
    name: 'Aurelia Delhi — DLF Promenade',
    address: 'Shop 301, Level 3\nDLF Promenade, Nelson Mandela Marg\nVasant Kunj, New Delhi 110 070',
    phone: '+91 11 1234 5678',
    email: 'delhi@aurelia.in',
    hours: [
      { day: 'Monday – Saturday', time: '11:00 AM – 9:00 PM' },
      { day: 'Sunday', time: '12:00 PM – 8:00 PM' },
    ],
    directions: [
      { icon: Train, text: 'Vasant Kunj Metro (Phase 4) — 10 min walk or short auto ride' },
      { icon: Car, text: 'Free parking on Level B2. Follow jewellery-level signs from lobby.' },
    ],
    mapEmbed: 'https://maps.google.com/maps?q=DLF+Promenade+Delhi&output=embed',
    mapLink: 'https://maps.google.com/maps?q=DLF+Promenade+Delhi',
  },
]

export default function StoresPage() {
  return (
    <div className="min-h-screen pt-24 bg-[#FAF6F0]">
      {/* Header */}
      <div className="bg-[#F2EBE0] py-14 px-4 text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-3">Visit Us</p>
        <h1 className="font-serif text-5xl text-[#1C1C1E]">Our Stores</h1>
        <p className="text-sm text-[#8A8A8E] mt-3 max-w-md mx-auto">
          Experience Aurelia in person — our consultants are always on hand to help you find the perfect piece.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
        {stores.map((store) => (
          <div key={store.city} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Map */}
            <div className="lg:col-span-3 aspect-video rounded-2xl overflow-hidden bg-[#F2EBE0] relative">
              <iframe
                src={store.mapEmbed}
                width="100%" height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
                title={`Map of ${store.name}`}
              />
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <p className="text-2xl mb-1">{store.flag}</p>
                <h2 className="font-serif text-2xl text-[#1C1C1E]">{store.name}</h2>
              </div>

              <div className="flex gap-3">
                <MapPin size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#2D2D2F] whitespace-pre-line leading-relaxed">{store.address}</p>
              </div>

              <div className="flex gap-3">
                <Clock size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {store.hours.map((h) => (
                    <div key={h.day} className="text-sm">
                      <span className="text-[#1C1C1E] font-medium">{h.day}:</span>{' '}
                      <span className="text-[#8A8A8E]">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <a href={`tel:${store.phone}`} className="text-sm text-[#1C1C1E] hover:text-[#C9A05B]">{store.phone}</a>
              </div>

              <div className="space-y-2 border-t border-[#E8DDD0] pt-4">
                <p className="text-xs tracking-widest uppercase text-[#8A8A8E]">Getting Here</p>
                {store.directions.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex gap-2 text-xs text-[#8A8A8E]">
                    <Icon size={13} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <a
                href={store.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#C9A05B] border border-[#C9A05B] px-4 py-2.5 hover:bg-[#C9A05B] hover:text-white transition-colors"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

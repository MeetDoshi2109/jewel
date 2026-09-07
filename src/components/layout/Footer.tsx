import Link from 'next/link'
import { Share2, BookMarked, Send, Mail, MapPin, Phone } from 'lucide-react'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1E] text-[#FAF6F0] mt-24">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="font-serif text-3xl tracking-wider text-[#FAF6F0]">AURELIA</h2>
              <p className="text-[9px] tracking-[0.3em] text-[#C9A05B] uppercase font-light mt-1">Fine Jewellery</p>
            </div>
            <p className="text-sm text-[#8A8A8E] leading-relaxed mb-6">
              Every piece in the Aurelia collection is crafted with intention — to be worn, passed down, and cherished across generations.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Share2, href: '#', label: 'Instagram' },
                { icon: BookMarked, href: '#', label: 'Facebook' },
                { icon: Send, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[#2D2D2F] flex items-center justify-center text-[#8A8A8E] hover:text-[#C9A05B] hover:border-[#C9A05B] transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[#C9A05B] font-medium mb-6">Collections</h3>
            <ul className="space-y-3">
              {[
                { label: 'Rings', href: '/collections/rings' },
                { label: 'Necklaces & Pendants', href: '/collections/necklaces' },
                { label: 'Earrings', href: '/collections/earrings' },
                { label: 'Bangles & Bracelets', href: '/collections/bangles' },
                { label: 'Mangalsutra', href: '/collections/mangalsutra' },
                { label: "Men's Jewellery", href: '/collections/mens' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#8A8A8E] hover:text-[#FAF6F0] transition-colors duration-200 underline-anim"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[#C9A05B] font-medium mb-6">Help</h3>
            <ul className="space-y-3">
              {[
                { label: 'Store Locator', href: '/stores' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping & Returns', href: '/faq#shipping' },
                { label: 'Size Guide', href: '/faq#sizing' },
                { label: 'Care Instructions', href: '/faq#care' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#8A8A8E] hover:text-[#FAF6F0] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[#C9A05B] font-medium mb-6">Visit Us</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#FAF6F0] font-medium">Aurelia Mumbai</p>
                  <p className="text-xs text-[#8A8A8E] mt-1 leading-relaxed">
                    Shop 12, Palladium Mall<br />
                    Lower Parel, Mumbai 400 013
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#FAF6F0] font-medium">Aurelia Delhi</p>
                  <p className="text-xs text-[#8A8A8E] mt-1 leading-relaxed">
                    Level 3, DLF Promenade<br />
                    Vasant Kunj, New Delhi 110 070
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <a href="tel:+918001234567" className="text-sm text-[#8A8A8E] hover:text-[#FAF6F0] transition-colors">
                  +91 800 123 4567
                </a>
              </div>
              <div className="flex gap-3">
                <Mail size={16} className="text-[#C9A05B] mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@aurelia.in" className="text-sm text-[#8A8A8E] hover:text-[#FAF6F0] transition-colors">
                  hello@aurelia.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-[#2D2D2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-serif text-xl text-[#FAF6F0]">Stay in the know</p>
              <p className="text-sm text-[#8A8A8E] mt-1">New collections, exclusive access & styling inspiration.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2D2D2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A8A8E]">
          <p>© {new Date().getFullYear()} Aurelia Fine Jewellery. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#FAF6F0] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#FAF6F0] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

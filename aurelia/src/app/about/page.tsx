import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Aurelia',
  description: 'The story behind Aurelia Fine Jewellery — our craft, our values, our people.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] bg-[#1C1C1E] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1800&q=80"
          alt="Aurelia jewellery atelier"
          fill className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-4">Our Story</p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#FAF6F0]">Made with intention.</h1>
        </div>
      </section>

      {/* Story sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-4">The Beginning</p>
            <h2 className="font-serif text-4xl text-[#1C1C1E] mb-6">Born from a love of craft</h2>
            <p className="text-sm text-[#8A8A8E] leading-relaxed mb-4">
              Aurelia was founded in 2009 by Meera and Arjun Kapoor, two jewellery designers who met at the Gemological Institute and shared a single conviction: that fine jewellery should not be intimidating, overpriced, or reserved for special occasions.
            </p>
            <p className="text-sm text-[#8A8A8E] leading-relaxed">
              They started with a small workshop in Jaipur's Johari Bazaar, collaborating with master craftspeople to create pieces that blended traditional Indian goldsmithing with contemporary European design sensibilities. Within three years, the first Aurelia boutique opened in Mumbai.
            </p>
          </div>
          <div className="aspect-square relative rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1615655096345-61a54750068d?w=600&q=80"
              alt="Aurelia founders at their Jaipur workshop"
              fill className="object-cover"
            />
          </div>
        </div>

        {/* Craft */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 aspect-square relative rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1573408301828-def33c4cdf7d?w=600&q=80"
              alt="Aurelia artisan at work"
              fill className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-4">The Craft</p>
            <h2 className="font-serif text-4xl text-[#1C1C1E] mb-6">Handcrafted in Jaipur</h2>
            <p className="text-sm text-[#8A8A8E] leading-relaxed mb-4">
              Every Aurelia piece is made by hand in our Jaipur atelier, where over 40 artisans bring decades of expertise to each step of the process — from wax carving and casting to stone setting and polishing.
            </p>
            <p className="text-sm text-[#8A8A8E] leading-relaxed">
              We work exclusively with ethically sourced materials: recycled gold and silver, conflict-free diamonds, and gemstones sourced directly from certified mines with full traceability. Our Kundan and meenakari pieces follow traditions passed down through Rajasthani families for generations.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A05B] mb-4">Our Values</p>
          <h2 className="font-serif text-4xl text-[#1C1C1E] mb-12">What we believe in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Radical Transparency', body: 'We list every material, its source, and its weight. No vague "gold-toned alloy" — you know exactly what you are buying.' },
              { title: 'Artisan Equity', body: 'Every craftsperson in our workshop earns above industry rate. We publish our wage floor annually and invite audits.' },
              { title: 'Enduring Design', body: 'We design for permanence, not trend cycles. A piece you buy today should look as right in twenty years.' },
            ].map((v) => (
              <div key={v.title} className="p-6 bg-white border border-[#E8DDD0] rounded-xl text-left">
                <div className="w-8 h-0.5 bg-[#C9A05B] mb-4" />
                <h3 className="font-serif text-lg text-[#1C1C1E] mb-3">{v.title}</h3>
                <p className="text-xs text-[#8A8A8E] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#1C1C1E] rounded-2xl p-12">
          <h2 className="font-serif text-3xl text-[#FAF6F0] mb-4">Ready to find your piece?</h2>
          <p className="text-sm text-[#8A8A8E] mb-8">Explore over 100 handcrafted jewellery pieces, from everyday essentials to exceptional heirlooms.</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#C9A05B] hover:bg-[#A8823A] text-white px-8 py-4 text-xs tracking-widest uppercase transition-colors"
          >
            Shop the Collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

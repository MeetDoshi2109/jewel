import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import dynamic from 'next/dynamic'
import './globals.css'

// Cursor is client-only — load after paint
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false })

export const metadata: Metadata = {
  title: {
    default: 'Aurelia Fine Jewellery — Crafted for Timeless Moments',
    template: '%s | Aurelia Fine Jewellery',
  },
  description:
    "Discover Aurelia's collection of fine jewellery — rings, necklaces, earrings, bangles and more. Premium handcrafted pieces for every occasion.",
  keywords: ['jewellery', 'fine jewellery', 'gold', 'diamond', 'silver', 'rings', 'necklaces', 'earrings', 'India'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aurelia Fine Jewellery',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAF6F0] antialiased">
        {/* Custom cursor — desktop only, hidden on touch */}
        <CustomCursor />
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FAF6F0',
              color: '#1C1C1E',
              border: '1px solid #E8DDD0',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            },
            iconTheme: { primary: '#C9A05B', secondary: '#fff' },
          }}
        />
      </body>
    </html>
  )
}

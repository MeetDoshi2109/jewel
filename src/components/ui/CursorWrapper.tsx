'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false })

export default function CursorWrapper() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }
  return <CustomCursor />
}

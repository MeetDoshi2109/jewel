import { Suspense } from 'react'
import CollectionsClient from './CollectionsClient'

export const dynamic = 'force-dynamic'

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A05B] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CollectionsClient />
    </Suspense>
  )
}

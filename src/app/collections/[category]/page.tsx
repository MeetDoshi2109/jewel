import { redirect } from 'next/navigation'
import { CATEGORIES } from '@/lib/utils'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.value }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  // Redirect to collections with category param
  redirect(`/collections?category=${category}`)
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
      },
    },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Related products (same category, different)
  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id }, inStock: true },
    take: 4,
    orderBy: { isBestseller: 'desc' },
  })

  const serialize = (p: typeof product) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  })

  return NextResponse.json({
    product: serialize(product),
    related: related.map((r) => ({
      ...r,
      images: JSON.parse(r.images || '[]'),
      tags: JSON.parse(r.tags || '[]'),
    })),
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const sort = searchParams.get('sort') || 'createdAt_desc'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const material = searchParams.get('material')
  const featured = searchParams.get('featured') === 'true'
  const bestseller = searchParams.get('bestseller') === 'true'
  const limit = parseInt(searchParams.get('limit') || '24')
  const page = parseInt(searchParams.get('page') || '1')

  const where: Record<string, unknown> = { inStock: true }

  if (category) where.category = category
  if (featured) where.isFeatured = true
  if (bestseller) where.isBestseller = true
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { material: { contains: q } },
      { tags: { contains: q } },
    ]
  }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
  }
  if (material) where.material = { contains: material }

  const orderByMap: Record<string, unknown> = {
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    newest: { createdAt: 'desc' },
    createdAt_desc: { createdAt: 'desc' },
    popularity: { isBestseller: 'desc' },
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: (orderByMap[sort] ?? { createdAt: 'desc' }) as any,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reviews: { select: { rating: true }, take: 20 },
      },
    }),
    prisma.product.count({ where }),
  ])

  const serialized = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags: JSON.parse(p.tags || '[]'),
    avgRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
    reviews: undefined,
  }))

  return NextResponse.json({ products: serialized, total, page, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ products: [], total: 0, page: 1, pages: 0 })
  }
}

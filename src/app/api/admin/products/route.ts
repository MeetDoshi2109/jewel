import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookies } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = {}
  if (category) where.category = category
  if (q) where.OR = [{ name: { contains: q } }, { sku: { contains: q } }]

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products: products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      tags: JSON.parse(p.tags || '[]'),
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, category, price, material, description, images, stock, tags, isPremium, isFeatured, isBestseller, sku } = body

  const slug = slugify(name) + '-' + Date.now()

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      sku: sku || `AUR-${category.toUpperCase().slice(0, 3)}-${Date.now()}`,
      category,
      price: parseFloat(price),
      material,
      description,
      images: JSON.stringify(images || []),
      stock: parseInt(stock) || 0,
      inStock: parseInt(stock) > 0,
      tags: JSON.stringify(tags || []),
      isPremium: isPremium || price > 10000,
      isFeatured: isFeatured || false,
      isBestseller: isBestseller || false,
    },
  })

  return NextResponse.json({
    product: { ...product, images: JSON.parse(product.images), tags: JSON.parse(product.tags) },
  }, { status: 201 })
}

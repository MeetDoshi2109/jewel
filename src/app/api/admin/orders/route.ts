import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const type = searchParams.get('type') // 'online' | 'reservation'
  const status = searchParams.get('status')
  const q = searchParams.get('q')?.trim()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '15'))

  const where: Record<string, unknown> = {}
  if (type && type !== 'all') where.type = type
  if (status && status !== 'all') where.status = status

  if (q) {
    const cleanQ = q.replace(/^#/, '')
    where.OR = [
      { orderNumber: { contains: cleanQ, mode: 'insensitive' } },
      { guestName: { contains: q, mode: 'insensitive' } },
      { guestEmail: { contains: q, mode: 'insensitive' } },
      { guestPhone: { contains: q, mode: 'insensitive' } },
      { trackingNumber: { contains: q, mode: 'insensitive' } },
      { customer: { name: { contains: q, mode: 'insensitive' } } },
      { customer: { email: { contains: q, mode: 'insensitive' } } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { name: true, slug: true, images: true, isPremium: true } } },
        },
        customer: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  const serialized = orders.map((o) => ({
    ...o,
    shippingAddress: o.shippingAddress ? JSON.parse(o.shippingAddress) : null,
    items: o.items.map((i) => ({
      ...i,
      product: i.product
        ? { ...i.product, images: JSON.parse(i.product.images || '[]') }
        : null,
    })),
  }))

  return NextResponse.json({
    orders: serialized,
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}

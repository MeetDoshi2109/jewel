import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookies } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const { status, adminNotes, inStorePaymentAmount, inStorePaymentMethod, trackingNumber, courierName } = body

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(adminNotes !== undefined && { adminNotes }),
      ...(inStorePaymentAmount !== undefined && { inStorePaymentAmount }),
      ...(inStorePaymentMethod !== undefined && { inStorePaymentMethod }),
      ...(trackingNumber !== undefined && { trackingNumber }),
      ...(courierName !== undefined && { courierName }),
      // When admin confirms in-store payment
      ...(status === 'paid_instore' && { paymentStatus: 'paid' }),
      ...(status === 'delivered' && { paymentStatus: 'paid' }),
    },
  })

  return NextResponse.json({ order: updated })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
      customer: true,
    },
  })

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    order: {
      ...order,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      items: order.items.map((i) => ({
        ...i,
        product: i.product
          ? { ...i.product, images: JSON.parse(i.product.images || '[]'), tags: JSON.parse(i.product.tags || '[]') }
          : null,
      })),
    },
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCustomerFromCookies } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    type, // 'online' | 'reservation'
    items, // [{ productId, quantity, price, name }]
    shippingAddress,
    paymentMethod,
    guestName,
    guestEmail,
    guestPhone,
    // For reservations
    preferredStore,
    preferredDate,
    reservationNotes,
  } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 })
  }

  const customer = await getCustomerFromCookies()

  const totalAmount = items.reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
    0
  )

  const orderNumber = generateOrderNumber()
  const status = type === 'reservation' ? 'pending_instore' : 'placed'
  const paymentStatus = type === 'reservation' ? 'pending' : 'pending'

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: customer?.id || null,
      guestName: !customer ? (guestName || '') : '',
      guestEmail: !customer ? (guestEmail || '') : '',
      guestPhone: !customer ? (guestPhone || '') : '',
      type,
      status,
      totalAmount,
      shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
      paymentMethod: paymentMethod || '',
      paymentStatus,
      preferredStore: preferredStore || '',
      preferredDate: preferredDate || '',
      reservationNotes: reservationNotes || '',
      items: {
        create: items.map((i: { productId: string; quantity: number; price: number; name: string }) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
        })),
      },
    },
    include: { items: true },
  })

  // Decrement stock for online orders
  if (type === 'online') {
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          inStock: undefined,
        },
      })
    }
  }

  return NextResponse.json({ order, orderNumber }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const customer = await getCustomerFromCookies()
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

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

  return NextResponse.json({ orders: serialized })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCustomerFromCookies } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get('orderNumber')?.trim()
  const email = searchParams.get('email')?.trim()?.toLowerCase()

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number is required' }, { status: 400 })
  }

  // Remove leading '#' if user included it
  const cleanOrderNumber = orderNumber.replace(/^#/, '')

  const currentCustomer = await getCustomerFromCookies()

  // Find the order
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: {
        equals: cleanOrderNumber,
        mode: 'insensitive',
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: true, category: true, material: true },
          },
        },
      },
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  })

  if (!order) {
    return NextResponse.json(
      { error: 'No order found with the provided Order Number' },
      { status: 404 }
    )
  }

  // Security check: If the user is not logged in as the order owner,
  // require email verification unless requested by the authenticated owner
  const isOwner = currentCustomer && order.customerId === currentCustomer.id

  if (!isOwner && email) {
    const orderEmail = (order.customer?.email || order.guestEmail || '').toLowerCase()
    if (orderEmail && orderEmail !== email) {
      return NextResponse.json(
        { error: 'The email provided does not match the order records' },
        { status: 403 }
      )
    }
  }

  // Parse shipping address
  let parsedAddress = null
  if (order.shippingAddress) {
    try {
      parsedAddress = JSON.parse(order.shippingAddress)
    } catch {
      parsedAddress = null
    }
  }

  // Calculate estimated delivery / timeline dates based on createdAt
  const createdDate = new Date(order.createdAt)
  const confirmedDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 4) // +4 hours
  const dispatchedDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 24) // +1 day
  const estimatedDelivery = new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 3) // +3 days

  return NextResponse.json({
    order: {
      ...order,
      shippingAddress: parsedAddress,
      estimatedDelivery: estimatedDelivery.toISOString(),
      timelineDates: {
        placed: createdDate.toISOString(),
        confirmed: confirmedDate.toISOString(),
        dispatched: dispatchedDate.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
      },
    },
  })
}

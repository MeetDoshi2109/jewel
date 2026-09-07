import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    totalOrders,
    onlineOrders,
    pendingReservations,
    totalRevenue,
    totalCustomers,
    lowStockProducts,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { type: 'online' } }),
    prisma.order.count({ where: { type: 'reservation', status: 'pending_instore' } }),
    prisma.order.aggregate({
      where: { type: 'online', paymentStatus: 'paid' },
      _sum: { totalAmount: true },
    }),
    prisma.customer.count(),
    prisma.product.findMany({
      where: { stock: { lt: 5 }, inStock: true },
      select: { id: true, name: true, stock: true, sku: true },
      orderBy: { stock: 'asc' },
      take: 10,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        items: { include: { product: { select: { name: true } } } },
        customer: { select: { name: true, email: true } },
      },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ])

  return NextResponse.json({
    stats: {
      totalOrders,
      onlineOrders,
      pendingReservations,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalCustomers,
      lowStockProducts,
    },
    recentOrders: recentOrders.map((o) => ({
      ...o,
      shippingAddress: o.shippingAddress ? JSON.parse(o.shippingAddress) : null,
    })),
    ordersByStatus,
  })
}

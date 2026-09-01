import { NextResponse } from 'next/server'
import { getCustomerFromCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const payload = await getCustomerFromCookies()
  if (!payload) {
    return NextResponse.json({ customer: null }, { status: 401 })
  }

  const customer = await prisma.customer.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  })

  return NextResponse.json({ customer })
}

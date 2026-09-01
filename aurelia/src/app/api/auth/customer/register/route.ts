import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signCustomerToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { name, email, password, phone } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  const existing = await prisma.customer.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const hashed = await hashPassword(password)
  const customer = await prisma.customer.create({
    data: { name, email, password: hashed, phone: phone || '' },
  })

  const token = signCustomerToken({ id: customer.id, email: customer.email, name: customer.name })

  const res = NextResponse.json({
    customer: { id: customer.id, name: customer.name, email: customer.email },
    message: 'Account created',
  })
  res.cookies.set('customer_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
  return res
}

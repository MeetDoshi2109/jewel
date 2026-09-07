import { NextRequest, NextResponse } from 'next/server'
import { getCustomerFromCookies, verifyPassword, hashPassword } from '@/lib/auth'
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

export async function PATCH(req: NextRequest) {
  const payload = await getCustomerFromCookies()
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, phone, currentPassword, newPassword } = body

    const existingCustomer = await prisma.customer.findUnique({
      where: { id: payload.id },
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const updateData: { name?: string; phone?: string; password?: string } = {}

    if (name && typeof name === 'string' && name.trim()) {
      updateData.name = name.trim()
    }

    if (typeof phone === 'string') {
      updateData.phone = phone.trim()
    }

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        )
      }

      const isValid = await verifyPassword(currentPassword, existingCustomer.password)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password does not match' },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters' },
          { status: 400 }
        )
      }

      updateData.password = await hashPassword(newPassword)
    }

    const updated = await prisma.customer.update({
      where: { id: payload.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })

    return NextResponse.json({ customer: updated })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

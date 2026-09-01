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

  const { images, tags, ...rest } = body
  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(images !== undefined && { images: JSON.stringify(images) }),
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      ...(rest.stock !== undefined && { inStock: rest.stock > 0 }),
    },
  })

  return NextResponse.json({
    product: { ...updated, images: JSON.parse(updated.images), tags: JSON.parse(updated.tags) },
  })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ message: 'Product deleted' })
}

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductDetailClient from './ProductDetailClient'
import { Product } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
      },
    },
  })
  if (!product) return null

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id }, inStock: true },
    take: 4,
    orderBy: { isBestseller: 'desc' },
  })

  return {
    product: {
      ...product,
      images: JSON.parse(product.images || '[]') as string[],
      tags: JSON.parse(product.tags || '[]') as string[],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      reviews: product.reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    } as unknown as Product & { reviews: typeof product.reviews },
    related: related.map((r) => ({
      ...r,
      images: JSON.parse(r.images || '[]'),
      tags: JSON.parse(r.tags || '[]'),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })) as Product[],
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getProduct(slug)
  if (!data) notFound()

  return <ProductDetailClient product={data.product} related={data.related} />
}

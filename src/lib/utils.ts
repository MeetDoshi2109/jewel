import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AUR-${timestamp}-${random}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    rings: 'Rings',
    necklaces: 'Necklaces & Pendants',
    earrings: 'Earrings',
    bangles: 'Bangles & Bracelets',
    mangalsutra: 'Mangalsutra',
    anklets: 'Anklets',
    nosepins: 'Nose Pins & Accessories',
    mens: "Men's Jewellery",
  }
  return labels[category] || category
}

export const CATEGORIES = [
  { value: 'rings', label: 'Rings', emoji: '💍' },
  { value: 'necklaces', label: 'Necklaces & Pendants', emoji: '📿' },
  { value: 'earrings', label: 'Earrings', emoji: '✨' },
  { value: 'bangles', label: 'Bangles & Bracelets', emoji: '⭕' },
  { value: 'mangalsutra', label: 'Mangalsutra', emoji: '🪬' },
  { value: 'anklets', label: 'Anklets', emoji: '🦶' },
  { value: 'nosepins', label: 'Nose Pins & Accessories', emoji: '💫' },
  { value: 'mens', label: "Men's Jewellery", emoji: '⛓️' },
]

export const PREMIUM_THRESHOLD = 10000

export function isPremiumProduct(price: number): boolean {
  return price > PREMIUM_THRESHOLD
}

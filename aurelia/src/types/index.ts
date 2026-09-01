export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  price: number
  material: string
  category: string
  images: string[] // parsed from JSON
  stock: number
  inStock: boolean
  isPremium: boolean
  isFeatured: boolean
  isBestseller: boolean
  tags: string[]
  weight: string
  dimensions: string
  createdAt: string
  reviews?: Review[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  guestName: string
  guestEmail: string
  guestPhone: string
  type: 'online' | 'reservation'
  status: string
  totalAmount: number
  shippingAddress: ShippingAddress | null
  paymentMethod: string
  paymentStatus: string
  preferredStore: string
  preferredDate: string
  reservationNotes: string
  adminNotes: string
  inStorePaymentAmount: number
  inStorePaymentMethod: string
  trackingNumber: string
  courierName: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  customer?: Customer
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  name: string
  product?: Product
}

export interface ShippingAddress {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface Review {
  id: string
  productId: string
  customerId?: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
}

export interface ReservationForm {
  name: string
  email: string
  phone: string
  preferredStore: string
  preferredDate: string
  notes: string
}

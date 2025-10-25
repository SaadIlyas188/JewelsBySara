export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: "bridal-clutches" | "nikkah-pens" | "nikkah-glasses"
  images: string[]
  inStock: boolean
  stockQuantity: number
  featured: boolean
  trending: boolean
  specifications?: Record<string, string>
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  username?: string
  firstName?: string
  lastName?: string
  phone?: string
  shippingAddress?: {
    street: string
    city: string
    country: string
    postalCode: string
  }
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  userId?: string
  guestEmail?: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: "cod"
  createdAt: string
  trackingNumber?: string
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "@/lib/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  getCartItems: () => (CartItem & { product: Product | null })[]
  productsMap: Record<string, Product> // useful for components
  isLoadingProducts: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({})
  const [mounted, setMounted] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const supabase = createClientComponentClient()

  // Load cart from localStorage
  useEffect(() => {
    setMounted(true)
    const savedCart = localStorage.getItem("jewelsbysara-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Persist cart in localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("jewelsbysara-cart", JSON.stringify(items))
    }
  }, [items, mounted])

  // Fetch product data for all items in cart
  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) return
      const ids = items.map((i) => i.productId)

      // Only fetch if we don't already have them
      const missingIds = ids.filter((id) => !productsMap[id])
      if (missingIds.length === 0) return

      setIsLoadingProducts(true)
      const { data, error } = await supabase.from("products").select("*").in("id", missingIds)
      setIsLoadingProducts(false)

      if (error) {
        console.error("Error fetching products:", error.message)
        return
      }

      if (data && data.length > 0) {
        const newMap = { ...productsMap }
        for (const product of data) {
          newMap[product.id] = product
        }
        setProductsMap(newMap)
      }
    }

    fetchProducts()
  }, [items])

  // === Cart functions ===
  const addItem = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { productId, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  // Combine cart items with fetched product data
  const getCartItems = () => {
    return items.map((item) => ({
      ...item,
      product: productsMap[item.productId] || null,
    }))
  }

  const getCartTotal = () => {
    return getCartItems().reduce((total, item) => {
      const price = item.product?.price ? Number(item.product.price) : 0
      return total + price * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartItems,
        productsMap,
        isLoadingProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}

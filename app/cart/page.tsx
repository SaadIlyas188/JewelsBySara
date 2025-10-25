"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react"

export default function CartPage() {
  const supabase = createClientComponentClient()
  const { getCartItems, updateQuantity, removeItem } = useCart()

  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const fetchCartProducts = async () => {
      setLoading(true)
      const items = getCartItems()

      if (items.length === 0) {
        setCartItems([])
        setLoading(false)
        setTotal(0)
        setItemCount(0)
        return
      }

      const ids = items.map((i) => String(i.productId))
      const { data: products, error } = await supabase.from("products").select("*").in("id", ids)

      if (error) {
        console.error("Supabase fetch error:", error.message)
        setLoading(false)
        return
      }

      const merged = items
        .map((item) => ({
          ...item,
          product: products?.find((p) => p.id === String(item.productId)),
        }))
        .filter((item) => item.product)

      setCartItems(merged)
      setTotal(merged.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
      setItemCount(merged.reduce((sum, item) => sum + item.quantity, 0))
      setLoading(false)
    }

    fetchCartProducts()
  }, [getCartItems])

  // 🌀 Loader section
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-lg">Fetching your cart items...</p>
      </div>
    )

  // 🛒 Empty cart section
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some beautiful pieces to your cart to get started.
            </p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🧾 Cart items and summary
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <Link href={`/product/${item.product.slug}`} className="relative h-32 w-32 flex-shrink-0">
                    <Image
                      src={item.product.images?.[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{item.product.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-9 w-9"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                          className="h-9 w-9"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <h2 className="font-serif text-2xl font-bold">Order Summary</h2>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">
                    {total >= 5000 ? "FREE" : `Rs. 500`}
                  </span>
                </div>
                {total < 5000 && (
                  <p className="text-xs text-muted-foreground">
                    Add Rs. {(5000 - total).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  Rs. {(total + (total >= 5000 ? 0 : 500)).toLocaleString()}
                </span>
              </div>
              <Button size="lg" className="w-full h-12" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full h-12 bg-transparent" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import type { Order } from "@/lib/types"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CheckoutPage() {
  const router = useRouter()
  const { getCartItems, getCartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const cartItems = getCartItems()
  const subtotal = getCartTotal()
  const shipping = 250 // ✅ Fixed shipping fee
  const total = subtotal + shipping

  // ✅ Pre-fill user details if logged in
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.shippingAddress?.street || "",
    city: user?.shippingAddress?.city || "",
    country: user?.shippingAddress?.country || "",
    postalCode: user?.shippingAddress?.postalCode || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [guestCheckout, setGuestCheckout] = useState(!isAuthenticated)

  if (cartItems.length === 0) {
    router.push("/cart")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAuthenticated) return // ✅ Prevent editing if logged in
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  const toastId = toast.loading("Placing your order...")

  if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city) {
    toast.dismiss(toastId)
    toast.error("Please fill in all required fields.")
    setIsSubmitting(false)
    return
  }

  try {
    // 1️⃣ Check stock for all products
    for (const item of cartItems) {
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("id, stock_quantity, name")
        .eq("id", item.productId)
        .single()

      if (fetchError) throw fetchError

      if (!product || product.stock_quantity < item.quantity) {
        toast.dismiss(toastId)
        toast.error(`${product?.name || "Item"} is not available in requested quantity.`)
        setIsSubmitting(false)
        return
      }
    }

    // 2️⃣ Generate tracking number
    const trackingNumber = `PKJBS-${Math.random().toString(36).substring(2, 7).toUpperCase()}${Date.now()
      .toString()
      .slice(-4)}`

    // 3️⃣ Create the order record
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          email: formData.email,
          first_name: formData.name.split(" ")[0] || formData.name,
          last_name: formData.name.split(" ").slice(1).join(" ") || "",
          phone: formData.phone,
          city: formData.city,
          country: formData.country || "Pakistan",
          address: formData.street,
          postal_code: formData.postalCode || 0,
          items: cartItems.map((item) => ({
            product_id: item.productId,
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          subtotal,
          delivery_charges: shipping,
          user_id: isAuthenticated ? user?.id : null,
          tracking_number: trackingNumber,
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    // 4️⃣ Subtract product quantities
    for (const item of cartItems) {
      const { data: product } = await supabase.from("products").select("stock_quantity").eq("id", item.productId).single()

      const newQty = Math.max(0, (product?.stock_quantity || 0) - item.quantity)
      const inStock = newQty > 0

      await supabase
        .from("products")
        .update({ stock_quantity: newQty, in_stock: inStock })
        .eq("id", item.productId)
    }

    // 5️⃣ If user logged in, update their orders array in profiles
    if (isAuthenticated && user?.email) {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("orders")
        .eq("email", user.email)
        .single()

      if (profileErr) throw profileErr

      const updatedOrders = [...(profile?.orders || []), trackingNumber]

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ orders: updatedOrders })
        .eq("email", user.email)

      if (updateErr) throw updateErr
    }

    // 6️⃣ Clear cart and show success toast
    clearCart()
    toast.dismiss(toastId)
    toast.success(`Order placed successfully! Tracking #: ${trackingNumber}`)
    router.push(`/order-confirmation/${newOrder.id}`)
  } catch (err: any) {
    console.error("Order Error:", err)
    toast.dismiss(toastId)
    toast.error(err.message || "Something went wrong while placing your order.")
  
  } finally {
    setIsSubmitting(false)
  }
}



  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAuthenticated && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="guest"
                      checked={guestCheckout}
                      onCheckedChange={(checked) => setGuestCheckout(checked as boolean)}
                    />
                    <Label htmlFor="guest" className="text-sm cursor-pointer">
                      Continue as guest
                    </Label>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      readOnly={isAuthenticated}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      readOnly={isAuthenticated}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    readOnly={isAuthenticated}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Street Name"
                    readOnly={isAuthenticated}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Karachi"
                      readOnly={isAuthenticated}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Pakistan"
                      readOnly={isAuthenticated}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="75500"
                      readOnly={isAuthenticated}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/30">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Cash on Delivery (COD)</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Rs. {item.product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Rs. {shipping.toLocaleString()}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rs. {total.toLocaleString()}</span>
                </div>
                <Button type="submit" size="lg" className="w-full h-12" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

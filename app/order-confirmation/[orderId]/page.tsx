"use client"

import { use } from "react"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params)
  const orders: Order[] = JSON.parse(localStorage.getItem("jewelsbysara-orders") || "[]")
  const order = orders.find((o) => o.id === resolvedParams.orderId)

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-4">
              Thank you for your order. We have received your order and will process it shortly.
            </p>
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Order Number:</span>
              <span className="font-mono font-bold text-primary">{order.trackingNumber}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Included</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">Rs. {order.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.email}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
              <p className="text-sm">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}
                {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-muted-foreground">
                  We will prepare your order and send you a confirmation email.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Shipping</p>
                <p className="text-sm text-muted-foreground">
                  Your order will be shipped within 2-3 business days. You will receive tracking information via email.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered to your address. Payment will be collected upon delivery (COD).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="flex-1" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button size="lg" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/track-order">Track Order</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"
import { Eye, Package, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [orderProducts, setOrderProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(true)
  

  useEffect(() => {
    if (loading) return
    if (!loading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      console.log(user)
      setLoadingOrders(true)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("email", user.email)
        .order("time", { ascending: false })

      if (error) console.error(error)
      else setOrders(data || [])

      setLoadingOrders(false)
    }

    fetchOrders()
  }, [loading, user, isAuthenticated, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleViewDetails = async (order: any) => {
    setSelectedOrder(order)
    setLoadingProducts(true)

    // Some orders may store product ID under `id` or `product_id`
    const productIds = order.items.map((item: any) => item.id || item.product_id).filter(Boolean)

    if (productIds.length === 0) {
      setOrderProducts([])
      setLoadingProducts(false)
      return
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)

    if (error) console.error(error)
    else setOrderProducts(products || [])

    setLoadingProducts(false)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setOrderProducts([])
  }

  if (!isAuthenticated) return null

  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8">My Orders</h1>

        {/* Loader for orders */}
        {loadingOrders ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const latestStatus = order.status?.[order.status.length - 1]?.status || "pending"
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.tracking_number}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {new Date(order.time).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(latestStatus)}>
                        {latestStatus.charAt(0).toUpperCase() + latestStatus.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name || item.product_name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold text-primary">
                          Rs. {order.total.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => handleViewDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-serif text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here.
              </p>
              <Button asChild>
                <a href="/">Start Shopping</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Order #{selectedOrder.tracking_number}
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {selectedOrder.first_name} {selectedOrder.last_name}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city},{" "}
                {selectedOrder.country} - {selectedOrder.postal_code}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
            </div>

            <hr className="my-4" />

            <h3 className="font-semibold mb-3">Products</h3>

            {loadingProducts ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : orderProducts.length > 0 ? (
              <div className="space-y-3">
                {orderProducts.map((product) => {
                  const item = selectedOrder.items.find(
                    (i: any) => i.id === product.id || i.product_id === product.id
                  )
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No product details found.</p>
            )}

            <hr className="my-4" />

            <h3 className="font-semibold mb-3">Order Status</h3>
            <div className="space-y-2">
              {selectedOrder.status.map((s: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span
                    className={`capitalize ${getStatusColor(s.status)} px-2 py-1 rounded-md border`}
                  >
                    {s.status}
                  </span>
                  <span>{new Date(s.time).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Total:</p>
              <p className="text-xl font-bold text-primary">
                Rs. {selectedOrder.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

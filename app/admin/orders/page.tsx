"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"
import { Eye, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-hot-toast"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const STATUS_FLOW = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderProductsMap, setOrderProductsMap] = useState({})
  const [loadingOrderProducts, setLoadingOrderProducts] = useState(false)
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null)
  const [loadingCustomerProfile, setLoadingCustomerProfile] = useState(false)
  const [profileCache, setProfileCache] = useState({})
  const [productModal, setProductModal] = useState({ product: null, loading: false })

  // New: confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    order: null,
    newStatus: "",
  })

  useEffect(() => {
    const load = async () => {
      setLoadingOrders(true)
      const { data, error } = await supabase.from("orders").select("*").order("time", { ascending: false })
      if (error) toast.error("Failed to load orders")
      else setOrders(data || [])
      setLoadingOrders(false)
    }
    load()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered": return "bg-green-100 text-green-800 border-green-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // ------------- STATUS CHANGE WITH CONFIRM MODAL -------------
  const handleStatusChange = async (order, newStatus) => {
    const latestStatus = order?.status?.[order.status.length - 1]?.status || "pending"
    const currentIndex = STATUS_FLOW.indexOf(latestStatus)
    const nextIndex = STATUS_FLOW.indexOf(newStatus)

    if (latestStatus === "delivered" && newStatus === "cancelled") {
      toast.error("Delivered orders cannot be cancelled")
      return
    }

    if (nextIndex < currentIndex && newStatus !== "cancelled") {
      toast.error("You cannot move to a previous status")
      return
    }

    // Show confirmation dialog instead of confirm()
    setConfirmDialog({ show: true, order, newStatus })
  }

  // Confirm status update after dialog confirmation
  const confirmStatusUpdate = async () => {
    const { order, newStatus } = confirmDialog
    setConfirmDialog({ show: false, order: null, newStatus: "" })

    const latestStatus = order?.status?.[order.status.length - 1]?.status || "pending"
    const currentIndex = STATUS_FLOW.indexOf(latestStatus)
    const nextIndex = STATUS_FLOW.indexOf(newStatus)
    const newStatuses = []

    if (newStatus === "cancelled") {
      newStatuses.push({ status: "cancelled", time: new Date().toISOString() })

      // -------- ADD BACK PRODUCT QUANTITIES --------
     // -------- ADD BACK PRODUCT STOCK QUANTITIES --------
try {
  for (const item of order.items || []) {
    if (!item.product_id || !item.quantity) continue

    // Fetch the current stock quantity
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single()

    if (fetchError || !product) {
      console.warn(`Product ${item.product_id} not found or fetch error.`)
      continue
    }

    // Add back the cancelled quantity
    const newQty = product.stock_quantity + Number(item.quantity)

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_quantity: newQty })
      .eq("id", item.product_id)

    if (updateError) {
      console.error(`Failed to restore quantity for product ${item.product_id}:`, updateError)
    }
  }

  toast.success("Cancelled order items restocked successfully.")
} catch (err) {
  console.error("Error restoring product quantities:", err)
  toast.error("Error while restocking products.")
}

    } else if (nextIndex > currentIndex) {
      for (let i = currentIndex + 1; i <= nextIndex; i++) {
        newStatuses.push({ status: STATUS_FLOW[i], time: new Date().toISOString() })
      }
    }

    const updatedStatuses = [...(order.status || []), ...newStatuses]

    const { error } = await supabase.from("orders").update({ status: updatedStatuses }).eq("id", order.id)
    if (error) {
      toast.error("Failed to update status")
      return
    }

    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updatedStatuses } : o)))
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder({ ...selectedOrder, status: updatedStatuses })
    }

    toast.success(`Order ${order.tracking_number} marked ${newStatus}`)
  }

  const cancelDialog = () => setConfirmDialog({ show: false, order: null, newStatus: "" })

  // ------------------- REMAINING CODE (unchanged) -------------------
  const openOrderDetails = async (order) => {
    setSelectedOrder(order)
    if (!orderProductsMap[order.id]) {
      setLoadingOrderProducts(true)
      const productIds = (order.items || []).map((it) => it.product_id).filter(Boolean)
      let products = []
      if (productIds.length > 0) {
        const { data, error } = await supabase.from("products").select("*").in("id", productIds)
        if (!error) products = data || []
      }
      setOrderProductsMap((prev) => ({ ...prev, [order.id]: products }))
      setLoadingOrderProducts(false)
    }
  }

  const closeOrderDetails = () => setSelectedOrder(null)
  const openCustomerModalByEmailOrId = async (order) => {
  if (!order?.email && !order?.customer_id) {
    toast.error("No customer information found")
    return
  }

  // check cache first
  const cacheKey = order.email || order.customer_id
  if (profileCache[cacheKey]) {
    setSelectedCustomerProfile(profileCache[cacheKey])
    return
  }

  setLoadingCustomerProfile(true)

  // Try fetching customer by email first
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", order.email)
    .single()

  // If not found, try by ID
  if (error || !profile) {
    const { data: altProfile, error: altError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", order.customer_id)
      .single()
    profile = altProfile
    error = altError
  }

  setLoadingCustomerProfile(false)

  if (error || !profile) {
    toast.error("Customer not found")
    return
  }

  // cache and show modal
  setProfileCache((prev) => ({ ...prev, [cacheKey]: profile }))
  setSelectedCustomerProfile(profile)
}

  const closeCustomerModal = () => setSelectedCustomerProfile(null)
  const openProductModal = async (productId) => { /* unchanged */ }
  const closeProductModal = () => setProductModal({ product: null, loading: false })
  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) =>
      (o.tracking_number || "").toLowerCase().includes(q) ||
      (o.first_name || "").toLowerCase().includes(q) ||
      (o.last_name || "").toLowerCase().includes(q) ||
      (o.email || "").toLowerCase().includes(q)
    )
  }, [orders, searchQuery])

  const getProductsForOrder = (orderId) => orderProductsMap[orderId] || []


  // -------------------- RENDER --------------------
  return (
    <div className="space-y-8 p-4">
      <header className="mb-4">
        <h1 className="font-serif text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
      </header>

      <div className="flex gap-4 items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tracking #, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <Button onClick={async () => {
            setLoadingOrders(true)
            const { data, error } = await supabase.from("orders").select("*").order("time", { ascending: false })
            if (!error) setOrders(data || [])
            else toast.error("Failed to refresh orders")
            setLoadingOrders(false)
          }}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingOrders ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading orders...</TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders found</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map(order => {
                  const latest = order.status?.[order.status.length - 1]?.status || "pending"
                  return (
                    <TableRow key={order.id}>
                      <TableCell><p className="font-mono font-medium">{order.tracking_number}</p></TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.first_name} {order.last_name}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.time).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">Rs. {Number(order.total).toLocaleString()}</TableCell>
                      <TableCell>
                        <Select value={latest} onValueChange={(v) => handleStatusChange(order, v)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>
                              <Badge variant="outline" className={getStatusColor(latest)}>
                                {latest.charAt(0).toUpperCase() + latest.slice(1)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_FLOW.map(s => (
                              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openOrderDetails(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openCustomerModalByEmailOrId(order)}>
                          <User className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ---------------- ORDER DETAILS MODAL ---------------- */}
      {selectedOrder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modalIn">
      
      {/* PINK CLOSE BUTTON INSIDE MODAL */}
      <button
        onClick={closeOrderDetails}
        className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-transform duration-300 hover:rotate-90"
      >
        <X className="h-5 w-5" />
      </button>
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Order #{selectedOrder.tracking_number}</h2>
              <p className="text-sm text-muted-foreground">Placed on {new Date(selectedOrder.time).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Products */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-lg">Products</h3>

                {loadingOrderProducts ? (
                  <div className="py-10 text-center">Loading products...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    { (selectedOrder.items || []).map((it, idx) => {
                      // find matching product from cache
                      const products = getProductsForOrder(selectedOrder.id)
                      const matched = products.find(p => p.id === it.product_id) || null

                      return (
                        <div key={idx} className="border rounded-lg p-3 flex gap-3">
                          <div className="w-20 h-20 flex-shrink-0 rounded-md bg-gray-50 overflow-hidden">
                            {matched?.images?.[0] ? (
                              // show only first image
                              <Image src={matched.images[0]} alt={matched.name} width={80} height={80} className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No image</div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{it.product_name || matched?.name || "Unknown product"}</p>
                                <p className="text-sm text-muted-foreground mt-1">{matched?.category || ""}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">Rs. {Number(it.price).toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">x{it.quantity}</p>
                              </div>
                            </div>

                            {matched?.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{matched.description}</p>
                            )}

                            <div className="mt-3 flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openProductModal(it.product_id)}>View product</Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Right: Summary & Customer */}
              <aside className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>Rs. {Number(selectedOrder.subtotal).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Delivery</span><span>Rs. {Number(selectedOrder.delivery_charges ?? 0).toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>Rs. {Number(selectedOrder.total).toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Customer</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                    <p className="text-sm">{selectedOrder.phone}</p>
                    <p className="text-sm mt-2 text-muted-foreground">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country} - {selectedOrder.postal_code}</p>
                    <div className="mt-3">
                      <Button variant="ghost" size="sm" onClick={() => openCustomerModalByEmailOrId(selectedOrder)}>See customer</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Status timeline</h4>
                  <div className="space-y-4">
                    {/* vertical timeline */}
                    { (selectedOrder.status || []).map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border ${getStatusColor(s.status)}`} />
                          { i !== (selectedOrder.status.length - 1) && <div className="w-px h-full bg-gray-200 mt-1" style={{ minHeight: 24 }} /> }
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="capitalize font-medium">{s.status}</div>
                            <div className="text-sm text-muted-foreground">{new Date(s.time).toLocaleString()}</div>
                          </div>
                          {/* optional description placeholder */}
                        </div>
                      </div>
                    )) }
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CUSTOMER MODAL ---------------- */}
      {/* ---------------- CUSTOMER MODAL ---------------- */}
{selectedCustomerProfile && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modalIn">
      <button
        onClick={closeCustomerModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-transform duration-300 hover:rotate-90"
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-bold mb-3">Customer Details</h2>

      {loadingCustomerProfile ? (
        <div className="py-8 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-x-4">
            <div><strong>Name</strong></div>
            <div>{selectedCustomerProfile.first_name} {selectedCustomerProfile.last_name}</div>

            <div><strong>Email</strong></div>
            <div>{selectedCustomerProfile.email}</div>

            <div><strong>Phone</strong></div>
            <div>{selectedCustomerProfile.phone || "N/A"}</div>

            <div><strong>City</strong></div>
            <div>{selectedCustomerProfile.city || "N/A"}</div>

            <div><strong>Country</strong></div>
            <div>{selectedCustomerProfile.country || "N/A"}</div>

            <div><strong>Postal Code</strong></div>
            <div>{selectedCustomerProfile.postal_code ?? "N/A"}</div>

            <div className="col-span-2"><strong>Address</strong></div>
            <div className="col-span-2 text-muted-foreground">{selectedCustomerProfile.address || "N/A"}</div>

            <div><strong>Account created</strong></div>
            <div>{selectedCustomerProfile.created_at ? new Date(selectedCustomerProfile.created_at).toLocaleString() : "—"}</div>
          </div>
        </div>
      )}
    </div>
  </div>
)}


      {/* ---------------- PRODUCT MODAL ---------------- */}
    {productModal.product && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modalIn">
      
      {/* PINK CLOSE BUTTON INSIDE MODAL (TOP-RIGHT CORNER) */}
      <button
        onClick={closeProductModal}
        className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-transform duration-300 hover:rotate-90"
      >
        <X className="h-5 w-5" />
      </button>

      {/* HEADER */}
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-2xl font-bold">{productModal.product.name}</h2>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="w-full h-72 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
            {productModal.loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : productModal.product.images?.[0] ? (
              <Image
                src={productModal.product.images[0]}
                alt={productModal.product.name}
                width={400}
                height={400}
                className="object-cover"
              />
            ) : (
              <div className="text-sm text-muted-foreground">No image</div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground mb-3">{productModal.product.category}</p>
          <p className="text-muted-foreground mb-4">{productModal.product.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-pink-600">
                Rs. {Number(productModal.product.price).toLocaleString()}
              </p>
              {productModal.product.original_price && (
                <p className="text-sm text-muted-foreground line-through">
                  Rs. {Number(productModal.product.original_price).toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              In stock: {productModal.product.in_stock ? "Yes" : "No"}
            </div>
          </div>

          {productModal.product.specifications && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Specifications</h4>
              <div className="grid grid-cols-2 gap-x-4 text-sm">
                {Object.entries(productModal.product.specifications).map(([k, v]) => (
                  <div key={k} className="py-1">
                    <div className="text-muted-foreground text-xs">{k}</div>
                    <div>{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

 {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-3">Confirm Status Change</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to mark order{" "}
              <span className="font-semibold">{confirmDialog.order?.tracking_number}</span> as{" "}
              <span className="font-semibold text-pink-600">{confirmDialog.newStatus}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={cancelDialog}>
                Cancel
              </Button>
              <Button onClick={confirmStatusUpdate} className="bg-pink-600 hover:bg-pink-700 text-white">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

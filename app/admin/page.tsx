"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { products } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: products.length,
    pendingOrders: 0,
  })
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem("jewelsbysara-orders") || "[]")
    const allUsers = JSON.parse(localStorage.getItem("jewelsbysara-users") || "[]")

    setOrders(allOrders)
    setTotalUsers(allUsers.length)

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = allOrders.filter((order) => order.status === "pending").length

    setStats({
      totalOrders: allOrders.length,
      totalRevenue,
      totalProducts: products.length,
      pendingOrders,
    })
  }, [])

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8 pb-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-words">
              Rs. {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
          </CardContent>
        </Card>

        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-3 sm:p-4">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4 divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-medium">
                      Order #{order.trackingNumber}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {order.shippingAddress.name}
                    </p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-sm sm:text-base font-medium">
                      Rs. {order.total.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm sm:text-base text-muted-foreground py-8">
              No orders yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

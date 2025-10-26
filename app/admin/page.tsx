"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    orderStatusCounts: {},
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalProducts: 0,
    categoryCounts: {},
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch all three tables
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")

      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")

      if (ordersError || usersError || productsError) {
        console.error("Error fetching dashboard data:", {
          ordersError,
          usersError,
          productsError,
        })
        setLoading(false)
        return
      }

      // ---- ORDERS ----
      let totalRevenue = 0
      let orderStatusCounts: Record<string, number> = {}

      for (const order of ordersData) {
        const statusArray = order.status || []
        let lastStatus = "unknown"

        if (statusArray.length > 0) {
          lastStatus = statusArray[statusArray.length - 1].status
        }

        // Count order status
        orderStatusCounts[lastStatus] = (orderStatusCounts[lastStatus] || 0) + 1

        // ✅ Include only delivered orders in total revenue
        if (lastStatus.toLowerCase() === "delivered") {
          totalRevenue += Number(order.total)
        }
      }

      // ---- USERS ----
      const totalUsers = usersData.length
      const activeUsers = usersData.filter((u) => u.active === true).length
      const inactiveUsers = totalUsers - activeUsers

      // ---- PRODUCTS ----
      const totalProducts = productsData.length
      const categoryCounts: Record<string, number> = {}
      for (const product of productsData) {
        categoryCounts[product.category] =
          (categoryCounts[product.category] || 0) + 1
      }

      setOrders(ordersData)
      setUsers(usersData)
      setProducts(productsData)
      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        orderStatusCounts,
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalProducts,
        categoryCounts,
      })

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const recentOrders = orders.slice(0, 5)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin h-12 w-12 border-4 border-t-raspberry rounded-full"></div>
      </div>
    )
  }

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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
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
              From delivered orders only
            </p>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {Object.entries(stats.orderStatusCounts)
                .map(([status, count]) => `${status}: ${count}`)
                .join(", ")}
            </p>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {Object.entries(stats.categoryCounts)
                .map(([cat, count]) => `${cat}: ${count}`)
                .join(", ")}
            </p>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="p-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active: {stats.activeUsers}, Inactive: {stats.inactiveUsers}
            </p>
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
              {recentOrders.map((order: any) => {
                const lastStatus =
                  order.status?.[order.status.length - 1]?.status || "unknown"
                return (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-medium">
                        Order #{order.tracking_number}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {order.first_name} {order.last_name}
                      </p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className="text-sm sm:text-base font-medium">
                        Rs. {Number(order.total).toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                        {lastStatus}
                      </p>
                    </div>
                  </div>
                )
              })}
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

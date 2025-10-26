"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuth")
    if (adminAuth) {
      try {
        const auth = JSON.parse(adminAuth)
        // Check if session is valid (less than 24 hours old)
        const isValid = Date.now() - auth.timestamp < 24 * 60 * 60 * 1000
        if (isValid) {
          setIsAdminAuthenticated(true)
        } else {
          localStorage.removeItem("adminAuth")
          router.push("/admin/login")
        }
      } catch {
        localStorage.removeItem("adminAuth")
        router.push("/admin/login")
      }
    } else {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Don't show layout if not authenticated
  if (!isAdminAuthenticated) {
    return null
  }

  const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings }, // 🛠️ new line
]

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <Link
          href="/admin"
          className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Admin Panel
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105"
                  : "hover:bg-muted hover:scale-102"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-destructive/10 text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout Admin
        </Button>
        <Button variant="ghost" className="w-full justify-start hover:bg-muted" onClick={() => router.push("/")}>
          <LogOut className="mr-3 h-5 w-5" />
          Back to Store
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Fixed full height sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 bg-card/80 backdrop-blur-xl border-r shadow-xl overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b px-4 py-3 flex items-center justify-between">
          <Link
            href="/admin"
            className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Admin
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content - Add left margin to account for fixed sidebar */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:pt-8 pt-20 min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

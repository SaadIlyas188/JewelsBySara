"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      <AuthProvider>
        <CartProvider>
          {isAdminPage ? (
            <>{children}</>
          ) : (
            <>
              <Header />
              <main className="min-h-screen pt-20">{children}</main>
              <Footer />
            </>
          )}
          <Toaster />
        </CartProvider>
      </AuthProvider>
      <Analytics />
    </>
  )
}

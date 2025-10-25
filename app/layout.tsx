import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
// import { Toaster } from "@/components/ui/toaster"
// import { ToastProvider } from "@/contexts/toast-context"
import { Toaster } from "react-hot-toast"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "JewelsBySara - Premium Pakistani Bridal Accessories",
  description:
    "Discover exquisite handcrafted bridal clutches, nikkah pens, and nikkah glasses. Elevate your special day with our luxurious collection.",
  keywords: "bridal clutches, nikkah pens, nikkah glasses, Pakistani jewelry, wedding accessories",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">
       
        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster
  position="bottom-right"
  toastOptions={{
    duration: 5000, 
    style: {
      background: "#ffe6f1",
      color: "#3d1a2a",
      borderRadius: "12px",
      padding: "12px 16px",
      fontFamily: "Inter, sans-serif",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    success: {
      iconTheme: {
        primary: "#ff69b4",
        secondary: "#fff",
      },
    },
    error: {
      style: {
        background: "#ffe6f1",
        color: "#b00020",
      },
      iconTheme: {
        primary: "#b00020",
        secondary: "#fff",
      },
    },
  }}
/>
            {/* <Toaster /> */}
           
          </CartProvider>
        </AuthProvider>
      
        <Analytics />
      </body>
    </html>
  )
}

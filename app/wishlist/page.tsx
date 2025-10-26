"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@supabase/supabase-js"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast" // ✅ added

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Product {
  id: number
  name: string
  image: string
  price: number
  description: string
  images?: string[]
  slug?: string
}

export default function WishlistPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user?.email) return

    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("product_ids")
        .eq("user_email", user.email)
        .single()

      if (wishlistError) throw wishlistError

      const updatedIds = (wishlistData.product_ids || []).filter(
        (id: string) => id !== productId
      )

      const { error: updateError } = await supabase
        .from("wishlist")
        .update({ product_ids: updatedIds })
        .eq("user_email", user.email)

      if (updateError) throw updateError

      setProducts((prev) => prev.filter((p) => p.id !== Number(productId)))
      toast.success("Removed from wishlist ✅")
    } catch (err) {
      console.error("Failed to remove from wishlist:", err)
      toast.error("Failed to remove from wishlist ❌")
    }
  }

  const handleAddToCart = (productId: number) => {
    addToCart(productId)
    toast.success("Added to cart 🛒")
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.email) {
      const fetchWishlist = async () => {
        setLoading(true)
        try {
          const { data: wishlistData, error: wishlistError } = await supabase
            .from("wishlist")
            .select("product_ids")
            .eq("user_email", user.email)
            .single()

          if (wishlistError || !wishlistData?.product_ids?.length) {
            setProducts([])
            setLoading(false)
            toast("Your wishlist is empty ❤️")
            return
          }

          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("*")
            .in("id", wishlistData.product_ids)

          if (productsError) throw productsError
          setProducts(productsData || [])
        } catch (err) {
          console.error("Error fetching wishlist:", err)
          setProducts([])
          toast.error("Failed to load wishlist ❌")
        } finally {
          setLoading(false)
        }
      }

      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [user, isAuthenticated, authLoading])

  if (authLoading) {
    return <div className="container mx-auto py-20 text-center">Checking authentication...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Please log in to see your wishlist</h2>
        <Link href="/login">
          <Button className="mt-4">Sign In</Button>
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="container mx-auto py-20 text-center">Loading wishlist...</div>
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
        <Link href="/shop">
          <Button className="mt-4">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative border rounded-xl p-4 flex flex-col hover:shadow-lg transition-shadow w-full max-w-sm mx-auto"
          >
            <div className="relative">
              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              {/* Remove button */}
              <button
                className="absolute top-2 right-2 p-2 bg-pink-200 hover:bg-pink-300 rounded-full text-red-600 hover:text-red-800 transition shadow"
                onClick={() => handleRemoveFromWishlist(product.id.toString())}
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
            <p className="font-medium mb-4">Rs. {product.price.toFixed(2)}</p>
            <div className="mt-auto flex gap-2">
              <Link href={`/product/${product.slug}`}>
                <Button variant="outline" className="flex-1">
                  View Product
                </Button>
              </Link>
              <Button
                className="flex-1"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

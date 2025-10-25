// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { Star, SlidersHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { products } from "@/lib/mock-data"
// import { useCart } from "@/contexts/cart-context"
// import { useState } from "react"

// const categoryNames = {
//   "bridal-clutches": "Bridal Clutches",
//   "nikkah-pens": "Nikkah Pens",
//   "nikkah-glasses": "Nikkah Glasses",
// }

// export default function CategoryPage({ params }: { params: { category: string } }) {
//   const { addItem } = useCart()
//   const [sortBy, setSortBy] = useState("featured")

//   const categoryProducts = products.filter((p) => p.category === params.category)
//   const categoryName = categoryNames[params.category as keyof typeof categoryNames] || "Products"

//   const sortedProducts = [...categoryProducts].sort((a, b) => {
//     switch (sortBy) {
//       case "price-low":
//         return a.price - b.price
//       case "price-high":
//         return b.price - a.price
//       case "name":
//         return a.name.localeCompare(b.name)
//       default:
//         return b.featured ? 1 : -1
//     }
//   })

//   return (
//     <div className="container mx-auto px-4 py-12">
//       {/* Header */}
//       <div className="mb-12">
//         <div className="mb-4">
//           <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
//             <Link href="/" className="hover:text-primary transition-colors">
//               Home
//             </Link>
//             <span>/</span>
//             <span className="text-foreground">{categoryName}</span>
//           </nav>
//         </div>
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           <div>
//             <h1 className="font-serif text-4xl font-bold text-balance mb-2">{categoryName}</h1>
//             <p className="text-muted-foreground">
//               {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="featured">Featured</SelectItem>
//                 <SelectItem value="price-low">Price: Low to High</SelectItem>
//                 <SelectItem value="price-high">Price: High to Low</SelectItem>
//                 <SelectItem value="name">Name: A to Z</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button variant="outline" size="icon">
//               <SlidersHorizontal className="h-4 w-4" />
//               <span className="sr-only">Filters</span>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       {sortedProducts.length > 0 ? (
//         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {sortedProducts.map((product) => (
//             <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all">
//               <Link href={`/product/${product.slug}`}>
//                 <div className="relative aspect-square overflow-hidden bg-muted">
//                   {product.originalPrice && (
//                     <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">
//                       Sale
//                     </Badge>
//                   )}
//                   {!product.inStock && (
//                     <Badge className="absolute left-4 top-4 z-10 bg-muted text-muted-foreground">Out of Stock</Badge>
//                   )}
//                   <Image
//                     src={product.images[0] || "/placeholder.svg"}
//                     alt={product.name}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </div>
//               </Link>
//               <CardContent className="p-6 space-y-4">
//                 <div>
//                   <Link href={`/product/${product.slug}`}>
//                     <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//                       {product.name}
//                     </h3>
//                   </Link>
//                   <div className="flex items-center space-x-1 mb-2">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-4 w-4 fill-primary text-primary" />
//                     ))}
//                     <span className="text-sm text-muted-foreground ml-2">(5.0)</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <p className="text-xl font-bold text-primary">Rs. {product.price.toLocaleString()}</p>
//                     {product.originalPrice && (
//                       <p className="text-sm text-muted-foreground line-through">
//                         Rs. {product.originalPrice.toLocaleString()}
//                       </p>
//                     )}
//                   </div>
//                   <Button
//                     size="sm"
//                     onClick={() => addItem(product.id)}
//                     disabled={!product.inStock}
//                     className="hover:bg-primary/90"
//                   >
//                     {product.inStock ? "Add to Cart" : "Out of Stock"}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <p className="text-muted-foreground text-lg">No products found in this category.</p>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Star, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const categoryNames = {
  "bridal-clutches": "Bridal Clutches",
  "nikkah-pens": "Nikkah Pens",
  "nikkah-glasses": "Nikkah Glasses",
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = createClientComponentClient()
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")

  const categoryName =
    categoryNames[params.category as keyof typeof categoryNames] || "Products"

  // 🧩 Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", params.category)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching products:", error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [params.category, supabase])

  // 🔄 Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return b.featured ? 1 : -1
    }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">{categoryName}</span>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl font-bold text-balance mb-2">
              {categoryName}
            </h1>
            <p className="text-muted-foreground">
              {loading
                ? "Loading..."
                : `${products.length} ${
                    products.length === 1 ? "product" : "products"
                  }`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Loading products...</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => {
            // 🧮 Calculate product conditions
            const isOutOfStock = product.stock_quantity === 0
            const isNewArrival =
              product.created_at &&
              new Date().getTime() - new Date(product.created_at).getTime() <
                7 * 24 * 60 * 60 * 1000
            const isOnSale =
              product.original_price &&
              product.price < product.original_price

            // ⭐ Handle average rating from Supabase
            const averageRating =
              product.rating && product.rating > 0 ? product.rating : null

            return (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {/* Badge logic */}
                    {isOutOfStock && (
                      <Badge className="absolute left-4 top-4 z-10 bg-gray-400 text-white">
                        Out of Stock
                      </Badge>
                    )}
                    {!isOutOfStock && isOnSale && (
                      <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">
                        On Sale
                      </Badge>
                    )}
                    {!isOutOfStock && !isOnSale && isNewArrival && (
                      <Badge className="absolute left-4 top-4 z-10 bg-green-600 text-white">
                        New Arrival
                      </Badge>
                    )}

                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating Display */}
                    <div className="flex items-center space-x-1 mb-2">
                      {averageRating ? (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({averageRating.toFixed(1)})
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No reviews yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-primary">
                        Rs. {product.price?.toLocaleString()}
                      </p>
                      {isOnSale && (
                        <p className="text-sm text-muted-foreground line-through">
                          Rs. {product.original_price?.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => addItem(product.id)}
                      disabled={isOutOfStock}
                      className="hover:bg-primary/90"
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  )
}

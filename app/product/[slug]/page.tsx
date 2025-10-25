"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Star, Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context" // ✅ added import

export default function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClientComponentClient()
  const { addItem } = useCart()
  const { user, isAuthenticated } = useAuth() // ✅ added
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [canReview, setCanReview] = useState(false) // ✅ added
  const [reviewText, setReviewText] = useState("") // ✅ added
  const [showReviewBox, setShowReviewBox] = useState(false) // ✅ added
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewDescription, setReviewDescription] = useState("")
  const [selectedStars, setSelectedStars] = useState(0)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [userReview, setUserReview] = useState<any>(null)



  // ✅ Fetch product + check review eligibility
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", params.slug)
        .single()

      if (error || !product) {
        console.error("Error fetching product:", error)
        setLoading(false)
        return
      }

      setProduct(product)

      // Fetch related products (same category, excluding current)
      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
        .neq("id", product.id)
        .limit(4)

      setRelatedProducts(related || [])
      setLoading(false)

      // ✅ Check if user can review
      if (user) {
        const { data: orders } = await supabase
          .from("orders")
          .select("items, status")
          .eq("email", user.email)

        if (orders && orders.length > 0) {
          const purchasedDelivered = orders.some((order) => {
            const hasProduct = order.items.some(
              (item: any) => item.product_id === product.id || item.id === product.id
            )
            const latestStatus = order.status[order.status.length - 1]?.status
            return hasProduct && latestStatus === "delivered"
          })
          setCanReview(purchasedDelivered)
        }
      }
    }

    fetchProduct()
  }, [params.slug, user])

  useEffect(() => {
  if (product && user) {
    const existing = (product.reviews || []).find((r: any) => r.email === user.email)
    setUserReview(existing || null)
  }
}, [product, user])


  // ✅ Add review handler
const handleSubmitReview = async () => {
  if (!product || !reviewTitle.trim() || selectedStars === 0) {
    toast.error("Please provide a title and rating")

    return
  }

  const existingReviews = product.reviews || []
  const reviewIndex = existingReviews.findIndex((r: any) => r.email === user.email)
  let updatedReviews

  const newReview = {
    email: user.email,
    stars: selectedStars,
    title: reviewTitle.trim(),
    description: reviewDescription.trim(),
    created_at: new Date().toISOString(),
  }

  if (reviewIndex !== -1) {
    // Editing existing review
    updatedReviews = [...existingReviews]
    updatedReviews[reviewIndex] = newReview
  } else {
    // Adding new review
    updatedReviews = [...existingReviews, newReview]
  }

  // Calculate new average rating
  const totalStars = updatedReviews.reduce((sum, r) => sum + r.stars, 0)
  const avgRating = Number((totalStars / updatedReviews.length).toFixed(2))

  const { error } = await supabase
    .from("products")
    .update({ reviews: updatedReviews, rating: avgRating })
    .eq("id", product.id)

  if (error) {
    toast.error(`Failed to save review: ${error.message}`)
    return
  }

  toast.success(reviewIndex !== -1 ? "Review updated successfully!" : "Review added successfully!")

  setProduct({ ...product, reviews: updatedReviews, rating: avgRating })
  setReviewTitle("")
  setReviewDescription("")
  setSelectedStars(0)
  setEditingReview(null)
  setShowReviewBox(false)
}

const handleDeleteReview = async () => {
  const updatedReviews = (product.reviews || []).filter((r: any) => r.email !== user.email)

  // Recalculate average rating
  const avgRating =
    updatedReviews.length > 0
      ? Number((updatedReviews.reduce((sum, r) => sum + r.stars, 0) / updatedReviews.length).toFixed(2))
      : 0

  const { error } = await supabase
    .from("products")
    .update({ reviews: updatedReviews, rating: avgRating })
    .eq("id", product.id)

  if (error) {
    toast.error(`Failed to delete review: ${error.message}`)

    return
  }

  toast.success("Review deleted successfully!")

  setProduct({ ...product, reviews: updatedReviews, rating: avgRating })
  setUserReview(null)
}





  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  const images = Array.isArray(product.images) ? product.images : []
  const productReviews = Array.isArray(product.reviews) ? product.reviews : []
  // If the product has a rating field (set by Supabase after review updates)
  const averageRating = product.rating && product.rating > 0 ? product.rating : null


  const handleAddToCart = () => {
    addItem(product.id, quantity)
    toast.success(`${quantity} × ${product.name} added to your cart`)

  }
  // Check sale condition
const isOnSale = product.original_price && product.price < product.original_price;

// Check if product was added within last 7 days
const isNewArrival =
  product.created_at &&
  new Date().getTime() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors">
          {product.category
            ?.split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid gap-12 lg:grid-cols-2 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {isOnSale && (
  <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">
    Sale
  </Badge>
)}

{isNewArrival && (
  <Badge className="absolute right-4 top-4 z-10 bg-green-600 text-white">
    New Arrival
  </Badge>
)}

            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-4xl font-bold text-balance mb-4">{product.name}</h1>
           <div className="flex items-center space-x-4 mb-4">
  {averageRating ? (
    <>
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.round(averageRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {averageRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
      </span>
    </>
  ) : (
    <span className="text-sm text-muted-foreground">No reviews yet</span>
  )}
</div>

            <div className="flex items-baseline space-x-4 mb-6">
              <p className="text-4xl font-bold text-primary">Rs. {Number(product.price).toLocaleString()}</p>
              {product.original_price && (
                <p className="text-xl text-muted-foreground line-through">
                  Rs. {Number(product.original_price).toLocaleString()}
                </p>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {/* Stock */}
          <div className="flex items-center space-x-2">
            {product.in_stock ? (
              <>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  In Stock
                </Badge>
                <span className="text-sm text-muted-foreground">{product.stock_quantity} units available</span>
              </>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.in_stock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={!product.in_stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button size="lg" className="flex-1 h-12" onClick={handleAddToCart} disabled={!product.in_stock}>
                Add to Cart
              </Button>
              <Button
  size="lg"
  variant="outline"
  className="h-12 bg-transparent flex items-center justify-center"
  onClick={async () => {
    if (!user) {
      toast.error("Please log in to add to wishlist")

      return
    }

    try {
      // Check if wishlist exists for this user
      const { data: existingWishlist, error: fetchError } = await supabase
        .from("wishlist")
        .select("product_ids")
        .eq("user_email", user.email)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        // Supabase code PGRST116 = no rows found
        throw fetchError
      }

      if (!existingWishlist) {
        // Create a new wishlist row
        const { error: insertError } = await supabase
          .from("wishlist")
          .insert([{ user_email: user.email, product_ids: [product.id] }])

        if (insertError) throw insertError
      } else {
        // Append to existing array if not already added
        const newProductIds = Array.isArray(existingWishlist.product_ids)
          ? [...existingWishlist.product_ids]
          : []

        if (!newProductIds.includes(product.id)) {
          newProductIds.push(product.id)
          const { error: updateError } = await supabase
            .from("wishlist")
            .update({ product_ids: newProductIds })
            .eq("user_email", user.email)

          if (updateError) throw updateError
        } else {
          toast("Product already in wishlist")
          return
        }
      }

      toast.success("Added to wishlist!")

    } catch (err: any) {
      console.error(err)
      toast.error(`Failed to add to wishlist: ${err.message}`)

    }
  }}
>
  <Heart className="h-5 w-5 text-pink-500" />
  <span className="sr-only">Add to wishlist</span>
</Button>

              <Button
  size="lg"
  variant="outline"
  className="h-12 bg-transparent"
  onClick={() => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!")
      })
      .catch(() => {
        toast.error("Failed to copy URL")
      })
  }}
>
  <Share2 className="h-5 w-5" />
  <span className="sr-only">Share</span>
</Button>

            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free shipping on orders over Rs. 5000</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Quality guaranteed - Handcrafted with care</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>Easy returns within 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {product.specifications ? (
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-4 last:border-0 last:pb-0">
                      <dt className="font-medium w-1/3">{key}:</dt>
                      <dd className="text-muted-foreground w-2/3">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

       {/* Reviews Tab */}
<TabsContent value="reviews" className="mt-6">
  {/* ✅ Show Add or Edit Review Button */}
  {isAuthenticated && canReview && !showReviewBox && !editingReview && !userReview && (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => setShowReviewBox(true)}
        className="bg-pink-600 hover:bg-pink-700 text-white"
      >
        Add Review
      </Button>
    </div>
  )}

  {/* ✅ Show Edit/Delete Buttons if already reviewed */}
  {userReview && !showReviewBox && (
    <div className="flex justify-end mb-4 space-x-2">
      <Button
        variant="outline"
        onClick={() => {
          setEditingReview(userReview)
          setShowReviewBox(true)
          setReviewTitle(userReview.title)
          setReviewDescription(userReview.description)
          setSelectedStars(userReview.stars)
        }}
      >
        Edit Review
      </Button>
      <Button variant="destructive" onClick={handleDeleteReview}>
        Delete Review
      </Button>
    </div>
  )}

  {/* ✅ Review Form */}
  {showReviewBox && (
    <div className="mb-6 border rounded-lg p-4">
      <h4 className="font-semibold mb-4 text-lg">
        {editingReview ? "Edit Your Review" : "Write a Review"}
      </h4>

      {/* Star Rating */}
      <div className="flex items-center mb-3 space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setSelectedStars(star)}
            className={`h-6 w-6 cursor-pointer transition ${
              star <= selectedStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Title Input */}
      <input
        type="text"
        className="w-full border rounded-lg p-2 mb-3"
        placeholder="Title (required)"
        value={reviewTitle}
        onChange={(e) => setReviewTitle(e.target.value)}
      />

      {/* Description Textarea */}
      <textarea
        className="w-full border rounded-lg p-2 mb-3"
        rows={4}
        placeholder="Description (optional)"
        value={reviewDescription}
        onChange={(e) => setReviewDescription(e.target.value)}
      />

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setShowReviewBox(false)
            setEditingReview(null)
            setReviewTitle("")
            setReviewDescription("")
            setSelectedStars(0)
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmitReview}
          className="bg-pink-600 hover:bg-pink-700 text-white"
          disabled={!reviewTitle.trim() || selectedStars === 0}
        >
          {editingReview ? "Update Review" : "Submit"}
        </Button>
      </div>
    </div>
  )}

  {/* ✅ Review List */}
  <div className="space-y-6">
    {product.reviews && product.reviews.length > 0 ? (
      product.reviews.map((review: any, idx: number) => (
        <Card key={idx}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold">{review.email || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h4 className="font-semibold mb-1">{review.title}</h4>
            <p className="text-muted-foreground leading-relaxed">{review.description}</p>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    )}
  </div>
</TabsContent>


      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 ? (
        <div>
          <h2 className="font-serif text-3xl font-bold mb-8">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all"
              >
                <Link href={`/product/${relatedProduct.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={relatedProduct.images?.[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-4 space-y-3">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-primary">
                    Rs. {Number(relatedProduct.price).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No related products found.</div>
      )}
    </div>
  )
}





// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { Star, Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useCart } from "@/contexts/cart-context"
// import { toast } from "@/components/ui/use-toast"

// export default function ProductPage({ params }: { params: { slug: string } }) {
//   const supabase = createClientComponentClient()
//   const router = useRouter()
//   const { addItem } = useCart()

//   const [product, setProduct] = useState<any>(null)
//   const [relatedProducts, setRelatedProducts] = useState<any[]>([])
//   const [quantity, setQuantity] = useState(1)
//   const [selectedImage, setSelectedImage] = useState(0)
//   const [loading, setLoading] = useState(true)

//   // ✅ Fetch product and related data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true)
//       const { data: product, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("slug", params.slug)
//         .single()

//       if (error || !product) {
//         console.error(error)
//         setLoading(false)
//         return
//       }

//       setProduct(product)

//       // Fetch related products
//       const { data: related } = await supabase
//         .from("products")
//         .select("*")
//         .eq("category", product.category)
//         .neq("id", product.id)
//         .limit(4)

//       setRelatedProducts(related || [])
//       setLoading(false)
//     }

//     fetchProduct()
//   }, [params.slug, supabase])

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <p className="text-lg text-muted-foreground">Loading product details...</p>
//       </div>
//     )
//   }

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h1 className="text-2xl font-bold mb-4">Product not found</h1>
//         <Button asChild>
//           <Link href="/">Return to Home</Link>
//         </Button>
//       </div>
//     )
//   }

//   const handleAddToCart = () => {
//     addItem(product.id, quantity)
//     toast({
//       title: "Added to cart",
//       description: `${quantity} x ${product.name} added to your cart.`,
//     })
//   }

//   const productReviews = Array.isArray(product.reviews) ? product.reviews : []
//   const averageRating =
//     productReviews.length > 0
//       ? productReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / productReviews.length
//       : product.rating || 5

//   const images = Array.isArray(product.images) ? product.images : []

//   return (
//     <div className="container mx-auto px-4 py-12">
//       {/* Breadcrumb */}
//       <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
//         <Link href="/" className="hover:text-primary transition-colors">
//           Home
//         </Link>
//         <span>/</span>
//         <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors">
//           {product.category
//             .split("-")
//             .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" ")}
//         </Link>
//         <span>/</span>
//         <span className="text-foreground">{product.name}</span>
//       </nav>

//       {/* Product Details */}
//       <div className="grid gap-12 lg:grid-cols-2 mb-16">
//         {/* Images */}
//         <div className="space-y-4">
//           <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
//             {product.original_price && (
//               <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">Sale</Badge>
//             )}
//             <Image
//               src={images[selectedImage] || "/placeholder.svg"}
//               alt={product.name}
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>
//           <div className="grid grid-cols-4 gap-4">
//             {images.map((image: string, index: number) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedImage(index)}
//                 className={`relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
//                   selectedImage === index ? "border-primary" : "border-transparent"
//                 }`}
//               >
//                 <Image src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="font-serif text-4xl font-bold text-balance mb-4">{product.name}</h1>
//             <div className="flex items-center space-x-4 mb-4">
//               <div className="flex items-center space-x-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-5 w-5 ${i < Math.floor(averageRating) ? "fill-primary text-primary" : "text-muted"}`}
//                   />
//                 ))}
//               </div>
//               <span className="text-sm text-muted-foreground">
//                 {averageRating.toFixed(1)} ({productReviews.length} reviews)
//               </span>
//             </div>
//             <div className="flex items-baseline space-x-4 mb-6">
//               <p className="text-4xl font-bold text-primary">Rs. {Number(product.price).toLocaleString()}</p>
//               {product.original_price && (
//                 <p className="text-xl text-muted-foreground line-through">
//                   Rs. {Number(product.original_price).toLocaleString()}
//                 </p>
//               )}
//             </div>
//             <p className="text-muted-foreground leading-relaxed">{product.description}</p>
//           </div>

//           <Separator />

//           {/* Stock Status */}
//           <div className="flex items-center space-x-2">
//             {product.in_stock ? (
//               <>
//                 <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                   In Stock
//                 </Badge>
//                 <span className="text-sm text-muted-foreground">{product.stock_quantity} units available</span>
//               </>
//             ) : (
//               <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
//                 Out of Stock
//               </Badge>
//             )}
//           </div>

//           {/* Quantity & Add to Cart */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <span className="text-sm font-medium">Quantity:</span>
//               <div className="flex items-center border rounded-lg">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={!product.in_stock}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </Button>
//                 <span className="w-12 text-center">{quantity}</span>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
//                   disabled={!product.in_stock}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <Button size="lg" className="flex-1 h-12" onClick={handleAddToCart} disabled={!product.in_stock}>
//                 Add to Cart
//               </Button>
//               <Button size="lg" variant="outline" className="h-12 bg-transparent">
//                 <Heart className="h-5 w-5" />
//                 <span className="sr-only">Add to wishlist</span>
//               </Button>
//               <Button size="lg" variant="outline" className="h-12 bg-transparent">
//                 <Share2 className="h-5 w-5" />
//                 <span className="sr-only">Share</span>
//               </Button>
//             </div>
//           </div>

//           <Separator />

//           {/* Features */}
//           <div className="space-y-3">
//             <div className="flex items-center space-x-3 text-sm">
//               <Truck className="h-5 w-5 text-primary" />
//               <span>Free shipping on orders over Rs. 5000</span>
//             </div>
//             <div className="flex items-center space-x-3 text-sm">
//               <Shield className="h-5 w-5 text-primary" />
//               <span>Quality guaranteed - Handcrafted with care</span>
//             </div>
//             <div className="flex items-center space-x-3 text-sm">
//               <RotateCcw className="h-5 w-5 text-primary" />
//               <span>Easy returns within 7 days</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="description" className="mb-16">
//         <TabsList className="grid w-full max-w-md grid-cols-3">
//           <TabsTrigger value="description">Description</TabsTrigger>
//           <TabsTrigger value="specifications">Specifications</TabsTrigger>
//           <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
//         </TabsList>
//         <TabsContent value="description" className="mt-6">
//           <Card>
//             <CardContent className="p-6">
//               <p className="text-muted-foreground leading-relaxed">{product.description}</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="specifications" className="mt-6">
//           <Card>
//             <CardContent className="p-6">
//               {product.specifications ? (
//                 <dl className="space-y-4">
//                   {Object.entries(product.specifications).map(([key, value]) => (
//                     <div key={key} className="flex border-b pb-4 last:border-0 last:pb-0">
//                       <dt className="font-medium w-1/3">{key}:</dt>
//                       <dd className="text-muted-foreground w-2/3">{String(value)}</dd>
//                     </div>
//                   ))}
//                 </dl>
//               ) : (
//                 <p className="text-muted-foreground">No specifications available.</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="reviews" className="mt-6">
//           <div className="space-y-6">
//             {productReviews.length > 0 ? (
//               productReviews.map((review: any, idx: number) => (
//                 <Card key={idx}>
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <p className="font-semibold">{review.userName || "Anonymous"}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
//                         </p>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <Card>
//                 <CardContent className="p-6 text-center">
//                   <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div>
//           <h2 className="font-serif text-3xl font-bold mb-8">You May Also Like</h2>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {relatedProducts.map((relatedProduct) => (
//               <Card
//                 key={relatedProduct.id}
//                 className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all"
//               >
//                 <Link href={`/product/${relatedProduct.slug}`}>
//                   <div className="relative aspect-square overflow-hidden bg-muted">
//                     <Image
//                       src={relatedProduct.images?.[0] || "/placeholder.svg"}
//                       alt={relatedProduct.name}
//                       fill
//                       className="object-cover transition-transform duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                 </Link>
//                 <CardContent className="p-4 space-y-3">
//                   <Link href={`/product/${relatedProduct.slug}`}>
//                     <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
//                       {relatedProduct.name}
//                     </h3>
//                   </Link>
//                   <p className="text-lg font-bold text-primary">
//                     Rs. {Number(relatedProduct.price).toLocaleString()}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

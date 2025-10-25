"use client"

import { ArrowRight, Star, Sparkles, Heart, Shield, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { useCart } from "@/contexts/cart-context"
import { Hero } from "@/components/hero/hero"
import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export default function HomePage() {
  const { addItem } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
const [trendingProducts, setTrendingProducts] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const [featuredRes, trendingRes] = await Promise.all([
        supabase.from("products").select("*").eq("featured", true).limit(6),
        supabase.from("products").select("*").eq("trending", true).limit(6),
      ])
      if (featuredRes.error) throw featuredRes.error
      if (trendingRes.error) throw trendingRes.error
      setFeaturedProducts(featuredRes.data || [])
      setTrendingProducts(trendingRes.data || [])
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }
  fetchProducts()
}, [])

  

  return (
    <div className="flex flex-col">
      {/* New Cinematic Hero Component */}
      <Hero />

      <section className="bg-white py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-raspberry/10 group-hover:from-baby-pink group-hover:to-baby-pink transition-all duration-500 group-hover:scale-110 shadow-lg">
                <Truck className="h-9 w-9 text-primary group-hover:text-raspberry transition-colors duration-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Complimentary Shipping</h3>
                <p className="text-base text-muted-foreground leading-relaxed">On all orders above Rs. 5,000</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sage/20 to-sage/10 group-hover:from-baby-pink group-hover:to-baby-pink transition-all duration-500 group-hover:scale-110 shadow-lg">
                <Shield className="h-9 w-9 text-sage group-hover:text-raspberry transition-colors duration-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Artisan Quality</h3>
                <p className="text-base text-muted-foreground leading-relaxed">Handcrafted with meticulous attention</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-raspberry/10 to-primary/10 group-hover:from-baby-pink group-hover:to-baby-pink transition-all duration-500 group-hover:scale-110 shadow-lg">
                <Heart className="h-9 w-9 text-raspberry group-hover:text-primary transition-colors duration-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Crafted with Passion</h3>
                <p className="text-base text-muted-foreground leading-relaxed">Every piece is uniquely yours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <Badge className="mb-6 bg-baby-pink text-raspberry border-raspberry/20 text-base px-4 py-1.5">
              Curated Selection
            </Badge>
            <h2 className="font-serif text-5xl lg:text-6xl font-bold text-balance mb-6">Featured Collection</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto font-light leading-relaxed">
              Handpicked treasures that embody sophistication and grace for your most precious moments
            </p>
          </div>
          {loading ? (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-raspberry"></div>
  </div>
) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-baby-pink/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted/30">
                    {product.originalPrice && (
                      <Badge className="absolute left-4 top-4 z-10 bg-raspberry text-white shadow-lg">Sale</Badge>
                    )}
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <CardContent className="p-6 space-y-4 bg-white group-hover:bg-baby-pink/50 transition-colors duration-500">
                  <div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-serif text-xl font-semibold mb-3 line-clamp-2 group-hover:text-raspberry transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(5.0)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary font-serif">Rs. {product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button size="sm" onClick={() => addItem(product.id)} className="hover:bg-raspberry shadow-md">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
)}
          <div className="mt-16 text-center">
            <Button
              size="lg"
              variant="outline"
              className="shadow-md hover:shadow-xl transition-all hover:bg-baby-pink hover:border-raspberry bg-transparent"
              asChild
            >
              <Link href="/category/bridal-clutches">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <Badge className="mb-6 bg-baby-pink text-raspberry border-raspberry/20 text-base px-4 py-1.5">
              Collections
            </Badge>
            <h2 className="font-serif text-5xl lg:text-6xl font-bold text-balance mb-6">Shop by Category</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto font-light leading-relaxed">
              Explore our curated collections designed for every aspect of your wedding celebration
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Link href="/category/bridal-clutches" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-baby-pink/30">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src="/pearl-bridal-clutch-elegant.jpg"
                    alt="Bridal Clutches"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="font-serif text-3xl font-bold mb-2">Bridal Clutches</h3>
                    <p className="text-sm text-white/90 font-light">Elegant & Timeless</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/category/nikkah-pens" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-baby-pink/30">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src="/gold-nikkah-pen-elegant.jpg"
                    alt="Nikkah Pens"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="font-serif text-3xl font-bold mb-2">Nikkah Pens</h3>
                    <p className="text-sm text-white/90 font-light">Precious Keepsakes</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/category/nikkah-glasses" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-baby-pink/30">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src="/vintage-gold-rim-nikkah-glasses.jpg"
                    alt="Nikkah Glasses"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="font-serif text-3xl font-bold mb-2">Nikkah Glasses</h3>
                    <p className="text-sm text-white/90 font-light">Luxurious Tradition</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-5xl font-bold text-balance mb-4">Trending Now</h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl leading-relaxed">
                Most loved pieces by our customers
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex hover:bg-baby-pink">
              <Link href="/category/bridal-clutches">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-raspberry"></div>
  </div>
) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingProducts.slice(0, 4).map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all hover:bg-baby-pink/30 duration-500"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Badge className="absolute left-3 top-3 z-10 bg-raspberry/90 text-white shadow-lg">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <CardContent className="p-4 space-y-3 bg-white group-hover:bg-baby-pink/50 transition-colors duration-500">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-raspberry transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">Rs. {product.price.toLocaleString()}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => addItem(product.id)}
                      className="h-8 px-3 hover:bg-raspberry hover:text-white"
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
)}
        </div>
      </section>

      <section className="bg-gradient-to-br from-baby-pink/20 to-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="relative h-[450px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/crystal-rose-bridal-clutch.jpg" alt="Our Story" fill className="object-cover" />
            </div>
            <div className="space-y-6">
              <Badge className="bg-baby-pink text-raspberry border-raspberry/20 hover:bg-baby-pink/80 text-base px-4 py-1.5">
                Our Story
              </Badge>
              <h2 className="font-serif text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Crafting Memories, One Piece at a Time
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg font-light">
                <p>
                  At JewelsBySara, we believe that every wedding moment deserves to be celebrated with elegance and
                  grace. Our journey began with a passion for creating exquisite bridal accessories that tell a story.
                </p>
                <p>
                  Each piece in our collection is meticulously handcrafted by skilled artisans, combining traditional
                  techniques with contemporary design. From the intricate embroidery on our bridal clutches to the
                  delicate crystal work on our nikkah accessories, every detail is crafted with love and precision.
                </p>
                <p>
                  We take pride in being part of your special day, providing you with accessories that not only
                  complement your bridal ensemble but also become cherished keepsakes for years to come.
                </p>
              </div>
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all hover:bg-raspberry" asChild>
                <Link href="/about">
                  Read Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-br from-primary via-raspberry to-secondary overflow-hidden shadow-2xl">
            <CardContent className="p-16 lg:p-24 text-center text-white relative">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-5" />
              <div className="relative z-10">
                <h2 className="font-serif text-5xl lg:text-6xl font-bold text-balance mb-6">
                  Ready to Find Your Perfect Piece?
                </h2>
                <p className="text-xl text-white/95 text-pretty max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                  Explore our complete collection and discover accessories that will make your special day truly
                  unforgettable.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-10 text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-white text-raspberry hover:bg-baby-pink"
                  asChild
                >
                  <Link href="/category/bridal-clutches">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

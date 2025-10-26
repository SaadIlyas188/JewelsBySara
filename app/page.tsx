"use client"

import { ArrowRight, Star, Sparkles, Heart, Shield, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { motion } from "framer-motion"
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
      <Hero />

      {/* ✅ OUR PERKS SECTION */}
      <section className="bg-white py-16 sm:py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
            {[
              {
                icon: <Truck className="h-8 w-8 sm:h-9 sm:w-9 text-primary" />,
                title: "Complimentary Shipping",
                desc: "On all orders above Rs. 5,000",
              },
              {
                icon: <Shield className="h-8 w-8 sm:h-9 sm:w-9 text-sage" />,
                title: "Artisan Quality",
                desc: "Handcrafted with meticulous attention",
              },
              {
                icon: <Heart className="h-8 w-8 sm:h-9 sm:w-9 text-raspberry" />,
                title: "Crafted with Passion",
                desc: "Every piece is uniquely yours",
              },
            ].map((perk, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-3 sm:space-y-4 group"
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-raspberry/10 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-2xl font-semibold mb-1 sm:mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* ✅ FEATURED COLLECTION */}
{/* ✅ FEATURED COLLECTION */}
<section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-white to-muted/30 overflow-hidden">
  <div className="container mx-auto px-3 sm:px-4">
    <div className="mb-10 sm:mb-20 text-center">
      <Badge className="mb-3 sm:mb-6 bg-baby-pink text-raspberry border-raspberry/20 text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-1.5">
        Curated Selection
      </Badge>
      <h2 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6">
        Featured Collection
      </h2>
      <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
        Handpicked treasures that embody sophistication and grace for your most precious moments
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-raspberry"></div>
      </div>
    ) : (
      // ✅ Animated horizontal scrolling wrapper
      <div className="relative overflow-hidden">
        <div
          className="flex gap-4 sm:gap-6 animate-scroll-x"
          style={{
            width: "max-content", // ensures continuous horizontal layout
          }}
        >
          {featuredProducts.concat(featuredProducts).map((product, i) => (
            <Card
              key={product.id + '-' + i}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:bg-baby-pink/30 flex-shrink-0 w-[33.33vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw]"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                  <Image
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
              <CardContent className="p-2 sm:p-4 md:p-6 space-y-1 sm:space-y-3">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-serif text-xs sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2 group-hover:text-raspberry transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center space-x-0.5 sm:space-x-1 mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 sm:h-4 sm:w-4 fill-gold text-gold"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  <p className="text-xs sm:text-xl font-bold text-primary leading-tight whitespace-nowrap">
                    Rs. {product.price.toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => addItem(product.id)}
                    className="text-[9px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 hover:bg-raspberry whitespace-nowrap"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )}

    <div className="mt-10 sm:mt-16 text-center">
      <Button
        size="lg"
        variant="outline"
        className="text-xs sm:text-base hover:bg-baby-pink hover:border-raspberry bg-transparent"
        asChild
      >
        <Link href="/category/bridal-clutches">
          View All Products
          <ArrowRight className="ml-2 h-3 sm:h-4 w-3 sm:w-4" />
        </Link>
      </Button>
    </div>
  </div>
</section>

<style jsx global>{`
  @keyframes scroll-x {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-scroll-x {
    animation: scroll-x 40s linear infinite;
  }
`}</style>




      {/* ✅ SHOP BY CATEGORY */}
      <section className="bg-white py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-20 text-center">
            <Badge className="mb-4 sm:mb-6 bg-baby-pink text-raspberry border-raspberry/20 text-sm sm:text-base px-3 sm:px-4 py-1.5">
              Collections
            </Badge>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Explore our curated collections designed for every aspect of your wedding celebration
            </p>
          </div>

          <div className="grid gap-6 grid-cols-3 sm:grid-cols-3 md:grid-cols-4">
            {[
              {
                href: "/category/bridal-clutches",
                src: "/pearl-bridal-clutch-elegant.jpg",
                title: "Bridal Clutches",
                desc: "Elegant & Timeless",
              },
              {
                href: "/category/nikkah-pens",
                src: "/gold-nikkah-pen-elegant.jpg",
                title: "Nikkah Pens",
                desc: "Precious Keepsakes",
              },
              {
                href: "/category/nikkah-glasses",
                src: "/vintage-gold-rim-nikkah-glasses.jpg",
                title: "Nikkah Glasses",
                desc: "Luxurious Tradition",
              },
            ].map((cat) => (
              <Link href={cat.href} key={cat.title} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-baby-pink/30">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={cat.src}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-4 sm:bottom-8 sm:left-8 text-white">
                      <h3 className="font-serif text-lg sm:text-3xl font-bold mb-1 sm:mb-2">
                        {cat.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 font-light">{cat.desc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>



{/* ✅ TRENDING PRODUCTS */}
<section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-white overflow-hidden">
  <div className="container mx-auto px-4">
    <div className="mb-10 sm:mb-16 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
      <div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-2 sm:mb-4">
          Trending Now
        </h2>
        <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
          Most loved pieces by our customers
        </p>
      </div>
      <Button variant="ghost" asChild className="hidden sm:flex hover:bg-baby-pink">
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
      <div className="relative w-full overflow-hidden">
        {/* ✅ Motion Wrapper for Continuous Scroll */}
        <motion.div
          className="flex gap-4 sm:gap-6 w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 25, // slower for smoother motion
            repeat: Infinity,
          }}
        >
          {/* ✅ Duplicate for seamless loop */}
          {[...trendingProducts.slice(0, 5), ...trendingProducts.slice(0, 5)].map((product, i) => (
            <Card
              key={`${product.id}-${i}`}
              className="group min-w-[180px] sm:min-w-[220px] md:min-w-[250px] overflow-hidden border-0 shadow-md hover:shadow-xl transition-all hover:bg-baby-pink/30 duration-500 flex-shrink-0"
            >
              <Link href={`/product/${product.slug}`}>
                {/* ✅ FIXED IMAGE SIZE */}
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-muted flex items-center justify-center">
                  <Badge className="absolute left-3 top-3 z-10 bg-raspberry/90 text-white shadow-lg">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Trending
                  </Badge>
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-white group-hover:bg-baby-pink/50 transition-colors duration-500">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-xs sm:text-base truncate group-hover:text-raspberry transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <p className="text-sm sm:text-lg font-bold text-primary">
                    Rs. {product.price.toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addItem(product.id)}
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm hover:bg-raspberry hover:text-white"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    )}
  </div>
</section>

      {/* OUR STORY SECTION */}
<section className="bg-gradient-to-br from-baby-pink/20 to-white py-16 sm:py-20 lg:py-32">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
      
      {/* Image */}
      <div className="relative h-[280px] sm:h-[350px] md:h-[420px] lg:h-[550px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        <Image 
          src="/crystal-rose-bridal-clutch.jpg" 
          alt="Our Story" 
          fill 
          className="object-cover"
        />
      </div>

      {/* Text Content */}
      <div className="space-y-6 text-center lg:text-left">
        <Badge className="bg-baby-pink text-raspberry border-raspberry/20 hover:bg-baby-pink/80 text-sm sm:text-base px-3 sm:px-4 py-1.5">
          Our Story
        </Badge>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
          Crafting Memories, One Piece at a Time
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg font-light">
          <p>
            At JewelsBySara, we believe every wedding moment deserves to be celebrated with elegance and grace. Our journey began with a passion for creating exquisite bridal accessories that tell a story.
          </p>
          <p>
            Each piece in our collection is meticulously handcrafted by skilled artisans, combining traditional techniques with contemporary design. Every detail is crafted with love and precision.
          </p>
          <p>
            We take pride in being part of your special day, providing accessories that not only complement your bridal ensemble but also become cherished keepsakes.
          </p>
        </div>
        <Button 
          size="lg" 
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all hover:bg-raspberry text-base sm:text-lg" 
          asChild
        >
          <Link href="/about">
            Read Our Story
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </div>
</section>

{/* CTA SECTION */}
<section className="py-16 sm:py-20 lg:py-32 bg-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <Card className="border-0 bg-gradient-to-br from-primary via-raspberry to-secondary overflow-hidden shadow-2xl rounded-3xl">
      <CardContent className="relative p-10 sm:p-14 md:p-20 text-center text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-5" />
        <div className="relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-5 sm:mb-6">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-8 sm:mb-10 font-light leading-relaxed">
            Explore our complete collection and discover accessories that will make your special day truly unforgettable.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 sm:h-14 px-8 sm:px-10 text-base shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-white text-raspberry hover:bg-baby-pink font-medium"
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

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, Sparkles, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-gold/20 text-foreground border-gold/30">About Us</Badge>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Where Tradition Meets
              <span className="block text-primary mt-2">Timeless Elegance</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              JewelsBySara is more than a brand—it's a celebration of love, tradition, and the artistry that makes your
              special moments unforgettable.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/luxury-gold-embroidered-bridal-clutch.jpg"
                alt="Our craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-bold text-balance">Our Story</h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg font-light">
                <p>
                  Founded with a passion for preserving Pakistani bridal traditions while embracing contemporary
                  elegance, JewelsBySara has become synonymous with luxury bridal accessories.
                </p>
                <p>
                  Our founder, Sara, envisioned a brand that would honor the sacred moments of a wedding ceremony
                  through meticulously crafted pieces. Each bridal clutch, nikkah pen, and nikkah glass is designed to
                  be more than an accessory—it's a keepsake that carries the memories of your most cherished day.
                </p>
                <p>
                  Today, we work with master artisans across Pakistan who bring decades of expertise to every piece.
                  Their skilled hands transform premium materials into works of art that brides treasure for
                  generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-lg text-muted-foreground font-light">The principles that guide everything we create</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Crafted with Love</h3>
                <p className="text-muted-foreground font-light">
                  Every piece is made with passion and dedication to perfection
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/20 mx-auto">
                  <Users className="h-8 w-8 text-sage" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Artisan Partnership</h3>
                <p className="text-muted-foreground font-light">
                  Supporting local craftspeople and preserving traditional techniques
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 mx-auto">
                  <Award className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground font-light">
                  Only the finest materials meet our exacting standards
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-raspberry/10 mx-auto">
                  <Sparkles className="h-8 w-8 text-raspberry" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Timeless Design</h3>
                <p className="text-muted-foreground font-light">
                  Creating pieces that remain beautiful for years to come
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="font-serif text-4xl font-bold text-balance">The Art of Craftsmanship</h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg font-light">
                <p>
                  Each JewelsBySara piece begins with a vision and is brought to life through hours of meticulous
                  handwork. Our artisans use time-honored techniques passed down through generations.
                </p>
                <p>
                  From hand-embroidered silk to carefully set crystals and pearls, every detail receives individual
                  attention. We believe that true luxury lies in the imperfections that make each piece uniquely yours.
                </p>
                <p>
                  Our commitment to quality means we never compromise. Each item undergoes rigorous quality checks
                  before it reaches you, ensuring it meets the highest standards of excellence.
                </p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image src="/pearl-bridal-clutch-elegant.jpg" alt="Artisan craftsmanship" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-br from-primary via-raspberry to-secondary overflow-hidden shadow-2xl">
            <CardContent className="p-16 lg:p-24 text-center text-white">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-balance mb-6">Become Part of Our Story</h2>
              <p className="text-xl text-white/95 text-pretty max-w-2xl mx-auto mb-10 font-light">
                Discover the perfect piece to complement your special day and create memories that last forever.
              </p>
              <Button size="lg" variant="secondary" className="h-14 px-10 text-base shadow-xl" asChild>
                <Link href="/category/bridal-clutches">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

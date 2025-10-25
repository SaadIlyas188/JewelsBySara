"use client"

import Link from "next/link"
import { GL } from "./gl"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  const [hovering, setHovering] = useState(false)

  return (
    <div className="relative flex flex-col min-h-[90vh] justify-center items-center overflow-hidden">
      {/* Animated particle background */}
      <GL hovering={hovering} />

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 py-20 max-w-5xl mx-auto">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground/80">Handcrafted Luxury</span>
        </div>

        {/* Main heading with staggered animation */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <span className="block bg-gradient-to-r from-primary via-raspberry to-secondary bg-clip-text text-transparent">
            Exquisite Bridal
          </span>
          <span className="block mt-2 text-foreground/90">Jewelry & Accessories</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Elevate your special moments with our curated collection of
          <span className="text-primary font-medium"> handcrafted clutches</span>,
          <span className="text-raspberry font-medium"> elegant nikkah pens</span>, and
          <span className="text-secondary font-medium"> stunning glasses</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link href="/category/bridal-clutches">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-raspberry hover:from-raspberry hover:to-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-transparent"
            >
              Our Story
            </Button>
          </Link>
        </div>

        {/* Floating stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-raspberry bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-sm text-foreground/60 mt-1">Happy Brides</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-raspberry to-secondary bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm text-foreground/60 mt-1">Handcrafted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-sm text-foreground/60 mt-1">Support</div>
          </div>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />
    </div>
  )
}

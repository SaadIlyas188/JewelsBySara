"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function Footer() {
  const [storeData, setStoreData] = useState<any>(null)

  useEffect(() => {
    const fetchStoreSettings = async () => {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .single()

      if (error) {
        console.error("Error fetching store settings:", error)
      } else {
        setStoreData(data)
      }
    }

    fetchStoreSettings()
  }, [])

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-primary">
              {storeData?.store_name || "JewelsBySara"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {storeData?.description ||
                "Exquisite handcrafted bridal accessories for your special day. Quality and elegance in every piece."}
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/bridal-clutches"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bridal Clutches
                </Link>
              </li>
              <li>
                <Link
                  href="/category/nikkah-pens"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Nikkah Pens
                </Link>
              </li>
              <li>
                <Link
                  href="/category/nikkah-glasses"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Nikkah Glasses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  {storeData?.address || "Lahore, Pakistan"}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${storeData?.phone || "+923070019293"}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {storeData?.phone || "+92 307 0019293"}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${storeData?.email || "info@jewelsbysara.com"}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {storeData?.email || "info@jewelsbysara.com"}
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <Input type="email" placeholder="Your email" className="h-9 text-sm" />
                <Button size="sm" className="h-9">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {storeData?.store_name || "JewelsBySara"}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

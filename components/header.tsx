"use client"

import { ShoppingCart, Search, Menu, User, LogOut, Package, Heart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"


export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const { user, logout, isAuthenticated, loading } = useAuth()


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/98 backdrop-blur-2xl shadow-lg border-b border-raspberry/10"
          : "bg-white/95 backdrop-blur-xl"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between gap-8 transition-all duration-500 ${scrolled ? "h-16" : "h-20"}`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span
              className={`font-serif font-bold bg-gradient-to-r from-primary via-raspberry to-secondary bg-clip-text text-transparent transition-all duration-500 ${
                scrolled ? "text-xl" : "text-2xl"
              } group-hover:scale-105`}
            >
              JewelsBySara
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-raspberry/30 rounded-full"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium hover:text-raspberry data-[state=open]:text-raspberry">
                    Shop
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/category/bridal-clutches"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Bridal Clutches</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Elegant handcrafted clutches for your special day
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/category/nikkah-pens"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Nikkah Pens</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Beautiful pens for your nikkah ceremony
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/category/nikkah-glasses"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Nikkah Glasses</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Decorative glasses for your celebration
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium hover:text-raspberry data-[state=open]:text-raspberry">
                    Help
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/track-order"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry"
                          >
                            <div className="text-sm font-medium leading-none">Track Order</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/shipping"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry"
                          >
                            <div className="text-sm font-medium leading-none">Shipping Info</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/returns"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry"
                          >
                            <div className="text-sm font-medium leading-none">Returns & Exchange</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/faqs"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-baby-pink/50 hover:text-raspberry"
                          >
                            <div className="text-sm font-medium leading-none">FAQs</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/about"
              className="h-10 px-4 inline-flex items-center text-sm font-medium text-foreground/80 hover:text-raspberry transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="h-10 px-4 inline-flex items-center text-sm font-medium text-foreground/80 hover:text-raspberry transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-baby-pink/50 transition-all duration-300 rounded-full h-10 w-10"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-raspberry text-xs text-white font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
{loading ? (
  // While auth is checking, show a small skeleton or nothing
  <div className="w-[84px] h-[36px] rounded-full bg-muted animate-pulse" />
) : isAuthenticated ? (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-baby-pink/50 transition-all duration-300 rounded-full h-10 w-10"
      >
        <User className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <div className="px-2 py-1.5">
        <p className="text-sm font-medium">{user?.name || "User"}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="hover:bg-baby-pink/50 cursor-pointer">
        <Link href="/orders">
          <Package className="mr-2 h-4 w-4" />
          My Orders
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="hover:bg-baby-pink/50 cursor-pointer">
  <Link href="/wishlist">
    <Heart className="mr-2 h-4 w-4" />
    My Wishlist
  </Link>
</DropdownMenuItem>

      
      <DropdownMenuItem asChild className="hover:bg-baby-pink/50 cursor-pointer">
        <Link href="/profile">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  <div className="flex items-center gap-2">
    <Link href="/login">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-4 hover:bg-baby-pink/50 rounded-full text-sm font-medium"
      >
        Sign in
      </Button>
    </Link>
    <Link href="/signup">
      <Button
        size="sm"
        className="h-9 px-4 bg-foreground text-background hover:bg-foreground/90 rounded-full text-sm font-medium"
      >
        Sign up
      </Button>
    </Link>
  </div>
)}


            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-baby-pink/50 rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link
                    href="/"
                    className="font-serif text-2xl font-bold bg-gradient-to-r from-primary via-raspberry to-secondary bg-clip-text text-transparent"
                  >
                    JewelsBySara
                  </Link>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="pl-10" />
                  </div>

                  <nav className="flex flex-col space-y-1">
                    <div className="font-semibold text-sm text-muted-foreground px-3 py-2">Shop</div>
                    <Link
                      href="/category/bridal-clutches"
                      className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md"
                    >
                      Bridal Clutches
                    </Link>
                    <Link href="/category/nikkah-pens" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      Nikkah Pens
                    </Link>
                    <Link
                      href="/category/nikkah-glasses"
                      className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md"
                    >
                      Nikkah Glasses
                    </Link>

                    <div className="font-semibold text-sm text-muted-foreground px-3 py-2 mt-4">Help</div>
                    <Link href="/track-order" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      Track Order
                    </Link>
                    <Link href="/shipping" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      Shipping Info
                    </Link>
                    <Link href="/returns" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      Returns & Exchange
                    </Link>
                    <Link href="/faqs" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      FAQs
                    </Link>

                    <div className="h-px bg-border my-2" />

                    <Link href="/about" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      About
                    </Link>
                    <Link href="/contact" className="px-3 py-2 text-sm hover:bg-baby-pink/50 rounded-md">
                      Contact
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

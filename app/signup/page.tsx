"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"
import { Sparkles } from "lucide-react"
import { createClient } from "@supabase/supabase-js"



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export default function SignupPage() {
  
  const router = useRouter()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    address: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const { password, confirmPassword, postalCode } = formData

    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please make sure your passwords match.")

      return false
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.")
      return false
    }

    if (!/(?=.*\d)/.test(password)) {
      toast.error("Password must contain at least one number.")
      return false
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return false
    }

    if (!/^\d+$/.test(postalCode)) {
      toast.error("Postal code must contain only numbers.")
      return false
    }

    return true
  }
const handleSubmit = async (e: React.FormEvent) => {
  
  e.preventDefault()
  setIsSubmitting(true)

  if (!validateForm()) {
    setIsSubmitting(false)
    return
  }

  try {
    const { data, error } = await supabase
      .from("profiles") // changed table name
      .insert([
        {
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          address: formData.address,
          postal_code: parseInt(formData.postalCode, 10), // integer
          password: formData.password,
          created_at: new Date().toISOString(), 
        },
      ])

    if (error) throw error

    toast.success("✨ Account created successfully! Welcome to JewelsBySara.")


    router.push("/")
  } catch (err: any) {
    // handle duplicate username/email
    let message = "An error occurred while creating your account."
    if (err.message.includes("duplicate")) {
      message = "Username or email already exists."
    }
    toast.error(`Signup failed: ${message}`)

  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50/30 to-pink-50/20 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Card className="overflow-hidden border-rose-100/50 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-2 text-center bg-gradient-to-r from-rose-50/50 to-pink-50/50 pb-8 pt-10">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="font-serif text-4xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-base">
              Join JewelsBySara and discover exquisite jewelry pieces
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column - Personal Information */}
                <div className="space-y-6">
                  <div className="pb-2 border-b border-rose-100">
                    <h3 className="text-lg font-semibold text-rose-900 font-serif">Personal Information</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={formData.username}
                      onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                      required
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        required
                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        required
                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters, 1 uppercase, 1 number"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={8}
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>

                {/* Right Column - Shipping Address */}
                <div className="space-y-6">
                  <div className="pb-2 border-b border-rose-100">
                    <h3 className="text-lg font-semibold text-rose-900 font-serif">Shipping Address</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="House no., Street name"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      required
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                        required
                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium">
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="12345"
                        value={formData.postalCode}
                        onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                        required
                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="Pakistan"
                      value={formData.country}
                      onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                      required
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  {/* Password Requirements Info Box */}
                  <div className="mt-8 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                    <h4 className="text-sm font-semibold text-rose-900 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-rose-700 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains at least one uppercase letter</li>
                      <li>• Contains at least one number</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating your account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Account
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link
                  href="/login"
                  className="text-rose-600 hover:text-rose-700 font-semibold hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-rose-600 transition-colors">
                  Continue as guest →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

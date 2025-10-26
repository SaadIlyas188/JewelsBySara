"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Package, Search, Truck, CheckCircle2, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function TrackOrderPage() {
  const supabase = createClientComponentClient()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setOrder(null)

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("email", email)
      .eq("tracking_number", trackingNumber)
      .single()

    setLoading(false)

    if (error || !data) {
      setError("No order found for this email and tracking number.")
      return
    }

    const sortedStatus = (data.status || []).sort(
      (a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()
    )

    setOrder({ ...data, status: sortedStatus })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white pt-28 sm:pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3 sm:space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Track Your Order
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Enter your email and tracking number to view your shipment progress.
          </p>
        </div>

        {/* Tracking Form */}
        <Card className="border-2 mb-10 sm:mb-12">
          <CardHeader className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-xl sm:text-2xl">Order Tracking</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your email and tracking number to locate your package.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Order Number</Label>
                <Input
                  id="trackingNumber"
                  placeholder="e.g., PKJBS-9FGT21A7"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  className="border-2 text-base py-2 sm:py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 text-base py-2 sm:py-3"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-raspberry hover:bg-raspberry/90 text-white text-base sm:text-lg py-3 sm:py-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Track Order
                  </>
                )}
              </Button>

              {error && <p className="text-red-600 text-sm sm:text-base mt-2 text-center sm:text-left">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Order Summary Card */}
            <Card className="border-2 bg-baby-pink/20">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Tracking #{order.tracking_number}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Truck className="h-4 w-4" />
                        <span className="font-semibold text-raspberry">
                          {order.status?.[order.status.length - 1]?.status || "Pending"}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex justify-center sm:justify-end">
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-raspberry" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-raspberry" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-muted-foreground">
                        {order.city}, {order.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-raspberry font-semibold">
                      {new Date(order.status?.[order.status.length - 1]?.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Tracking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.status.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-4 sm:items-start sm:gap-6"
                    >
                      <div className="flex flex-col items-center sm:items-center sm:mr-2">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                            index < order.status.length - 1
                              ? "bg-raspberry text-white"
                              : "bg-muted text-muted-foreground border-2 border-muted"
                          }`}
                        >
                          {index < order.status.length - 1 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        {index < order.status.length - 1 && (
                          <div className="w-0.5 h-12 bg-muted border-dashed border-l-2 border-raspberry/40" />
                        )}
                      </div>

                      <div className="flex-1 pb-6 sm:pb-8">
                        <h3
                          className={`font-semibold text-base sm:text-lg ${
                            index < order.status.length - 1
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.status}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

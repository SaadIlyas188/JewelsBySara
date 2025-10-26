import { Truck, Package, Clock, MapPin, Shield, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white pt-28 sm:pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3 sm:space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Shipping Information
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Fast, reliable delivery to your doorstep. Learn about our shipping options and policies.
          </p>
        </div>

        {/* Shipping Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center sm:items-start gap-3">
                <div className="p-2 rounded-full bg-baby-pink flex-shrink-0">
                  <Truck className="h-6 w-6 text-raspberry" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl">Free Shipping</CardTitle>
                  <CardDescription>On orders over Rs. 5,000</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Enjoy free standard shipping on all orders above Rs. 5,000 within Pakistan.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center sm:items-start gap-3">
                <div className="p-2 rounded-full bg-baby-pink flex-shrink-0">
                  <Clock className="h-6 w-6 text-raspberry" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl">Fast Delivery</CardTitle>
                  <CardDescription>3–5 business days</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Standard delivery takes 3–5 business days. Express options available at checkout.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Rates */}
        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Shipping Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Standard Shipping", time: "3–5 business days", price: "Rs. 250", note: "Free over Rs. 5,000" },
              { name: "Express Shipping", time: "1–2 business days", price: "Rs. 500" },
              { name: "Same Day Delivery", time: "Karachi only", price: "Rs. 800" },
            ].map((rate, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 bg-baby-pink/20 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{rate.name}</h3>
                  <p className="text-sm text-muted-foreground">{rate.time}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-raspberry">{rate.price}</p>
                  {rate.note && <p className="text-xs text-muted-foreground">{rate.note}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Areas */}
        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Delivery Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <MapPin className="h-6 w-6 text-raspberry flex-shrink-0 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-2">Major Cities</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  We deliver to all major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi,
                  Faisalabad, Multan, and more. Standard delivery: 3–5 business days.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-4">
              <MapPin className="h-6 w-6 text-raspberry flex-shrink-0 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-2">Other Areas</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  We also ship to smaller cities and towns across Pakistan. Delivery may take 5–7 business days depending
                  on location.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Processing */}
        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Order Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: Package,
                title: "Processing Time",
                desc: "Orders are processed within 1–2 business days. You'll receive a confirmation email with tracking information once your order ships.",
              },
              {
                icon: Shield,
                title: "Secure Packaging",
                desc: "All items are carefully packaged to ensure they arrive in perfect condition. Fragile items receive extra protection.",
              },
              {
                icon: DollarSign,
                title: "Cash on Delivery",
                desc: "We accept cash on delivery for all orders. Payment is collected when your package is delivered.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <item.icon className="h-5 w-5 text-raspberry flex-shrink-0 mx-auto sm:mx-0" />
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-2 bg-baby-pink/20">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Questions About Shipping?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base text-center sm:text-left">
              If you have any questions about shipping or need to track your order, our customer service team is here to
              help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <a
                href="/track-order"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-raspberry text-white rounded-lg hover:bg-raspberry/90 transition-all font-medium"
              >
                Track Your Order
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border-2 border-raspberry text-raspberry rounded-lg hover:bg-baby-pink transition-all font-medium"
              >
                Contact Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

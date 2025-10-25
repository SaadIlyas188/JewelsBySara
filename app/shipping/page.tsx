import { Truck, Package, Clock, MapPin, Shield, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Shipping Information</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable delivery to your doorstep. Learn about our shipping options and policies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-baby-pink">
                  <Truck className="h-6 w-6 text-raspberry" />
                </div>
                <div>
                  <CardTitle>Free Shipping</CardTitle>
                  <CardDescription>On orders over Rs. 5,000</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Enjoy free standard shipping on all orders above Rs. 5,000 within Pakistan.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-baby-pink">
                  <Clock className="h-6 w-6 text-raspberry" />
                </div>
                <div>
                  <CardTitle>Fast Delivery</CardTitle>
                  <CardDescription>3-5 business days</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Standard delivery takes 3-5 business days. Express options available at checkout.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-baby-pink/20 rounded-lg">
              <div>
                <h3 className="font-semibold">Standard Shipping</h3>
                <p className="text-sm text-muted-foreground">3-5 business days</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-raspberry">Rs. 250</p>
                <p className="text-xs text-muted-foreground">Free over Rs. 5,000</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-baby-pink/20 rounded-lg">
              <div>
                <h3 className="font-semibold">Express Shipping</h3>
                <p className="text-sm text-muted-foreground">1-2 business days</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-raspberry">Rs. 500</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-baby-pink/20 rounded-lg">
              <div>
                <h3 className="font-semibold">Same Day Delivery</h3>
                <p className="text-sm text-muted-foreground">Karachi only</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-raspberry">Rs. 800</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Delivery Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-raspberry flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Major Cities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We deliver to all major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi,
                  Faisalabad, Multan, and more. Standard delivery: 3-5 business days.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-raspberry flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Other Areas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We also ship to smaller cities and towns across Pakistan. Delivery may take 5-7 business days
                  depending on location.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Order Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Processing Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking
                  information once your order ships.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Secure Packaging</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All items are carefully packaged to ensure they arrive in perfect condition. Fragile items receive
                  extra protection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Cash on Delivery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We accept cash on delivery for all orders. Payment is collected when your package is delivered.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-baby-pink/20">
          <CardHeader>
            <CardTitle>Questions About Shipping?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about shipping or need to track your order, our customer service team is here to
              help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/track-order"
                className="inline-flex items-center justify-center px-6 py-3 bg-raspberry text-white rounded-lg hover:bg-raspberry/90 transition-colors font-medium"
              >
                Track Your Order
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-raspberry text-raspberry rounded-lg hover:bg-baby-pink transition-colors font-medium"
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

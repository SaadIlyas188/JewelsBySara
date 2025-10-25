import { RefreshCw, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Returns & Exchanges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          <Card className="border-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-baby-pink">
                  <Clock className="h-6 w-6 text-raspberry" />
                </div>
                <div>
                  <CardTitle>Return Window</CardTitle>
                  <CardDescription>30-day return policy</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You have 30 days from the date of delivery to return your item. Items must be unused, in their original
                packaging, and in the same condition as received.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-baby-pink">
                  <RefreshCw className="h-6 w-6 text-raspberry" />
                </div>
                <div>
                  <CardTitle>Exchange Policy</CardTitle>
                  <CardDescription>Free exchanges within 30 days</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We offer free exchanges for different sizes, colors, or styles. Simply contact us and we'll arrange the
                exchange for you at no additional cost.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">How to Return an Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-raspberry text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Email us at info@jewelsbysara.com or call +92 300 1234567 with your order number and reason for
                  return.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-raspberry text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pack Your Item</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Securely pack the item in its original packaging. Include all accessories, tags, and documentation.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-raspberry text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ship It Back</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We'll provide you with a return shipping label. Drop off the package at your nearest courier location.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-raspberry text-white flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Receive Your Refund</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Items That Cannot Be Returned</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Personalized or custom-made items</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Items marked as final sale</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Items damaged due to misuse or wear</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Items without original packaging or tags</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 bg-baby-pink/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-raspberry" />
              <CardTitle>Need Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our customer service team is here to assist you with any questions about returns or exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:info@jewelsbysara.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-raspberry text-white rounded-lg hover:bg-raspberry/90 transition-colors font-medium"
              >
                Email Us
              </a>
              <a
                href="tel:+923001234567"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-raspberry text-raspberry rounded-lg hover:bg-baby-pink transition-colors font-medium"
              >
                Call Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

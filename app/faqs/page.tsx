import { Package, Truck, CreditCard, RefreshCw, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, and policies.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-raspberry" />
                <CardTitle>Orders & Products</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I place an order?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Browse our collection, add items to your cart, and proceed to checkout. You can checkout as a guest
                    or create an account for faster future purchases. Fill in your shipping details and confirm your
                    order.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I modify my order after placing it?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Please contact us immediately at info@jewelsbysara.com or call +92 300 1234567. If your order hasn't
                    been processed yet, we'll do our best to accommodate changes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Are your products handmade?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes! All our bridal clutches, nikkah pens, and nikkah glasses are carefully handcrafted with
                    attention to detail. Each piece is unique and made with premium materials.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Do you offer custom designs?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, we offer customization services for bulk orders and special requests. Contact us to discuss
                    your requirements and we'll create something special for your big day.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-raspberry" />
                <CardTitle>Shipping & Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ship-1">
                  <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Standard shipping takes 3-5 business days to major cities. Express shipping (1-2 days) and same day
                    delivery in Karachi are also available. Processing time is 1-2 business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ship-2">
                  <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Currently, we only ship within Pakistan. We're working on expanding our shipping to international
                    destinations soon.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ship-3">
                  <AccordionTrigger>How can I track my order?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Once your order ships, you'll receive a tracking number via email. You can also track your order on
                    our Track Order page by entering your order number and email address.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ship-4">
                  <AccordionTrigger>What if my package is delayed?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    If your package is delayed beyond the estimated delivery date, please contact us immediately. We'll
                    work with our courier partners to locate your package and resolve the issue.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-raspberry" />
                <CardTitle>Payment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pay-1">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We currently accept Cash on Delivery (COD) for all orders. Payment is collected when your package is
                    delivered to your doorstep.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pay-2">
                  <AccordionTrigger>Is Cash on Delivery available everywhere?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, COD is available for all delivery locations across Pakistan. There are no additional charges
                    for COD orders.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pay-3">
                  <AccordionTrigger>Are my payment details secure?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Since we use Cash on Delivery, you don't need to share any payment card details online. Your
                    personal information is kept secure and never shared with third parties.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-raspberry" />
                <CardTitle>Returns & Exchanges</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="return-1">
                  <AccordionTrigger>What is your return policy?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We offer a 30-day return policy. Items must be unused, in original packaging, and in the same
                    condition as received. Contact us to initiate a return.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="return-2">
                  <AccordionTrigger>How do I return an item?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Contact us with your order number and reason for return. We'll provide a return shipping label. Pack
                    the item securely and ship it back. Refunds are processed within 5-7 business days after we receive
                    your return.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="return-3">
                  <AccordionTrigger>Do you offer exchanges?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes! We offer free exchanges for different sizes, colors, or styles within 30 days. Contact us to
                    arrange an exchange.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="return-4">
                  <AccordionTrigger>Can I return personalized items?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Unfortunately, personalized or custom-made items cannot be returned unless they arrive damaged or
                    defective.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-2 bg-baby-pink/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-raspberry" />
                <CardTitle>Still Have Questions?</CardTitle>
              </div>
              <CardDescription>We're here to help!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Can't find the answer you're looking for? Our customer service team is ready to assist you.
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
    </div>
  )
}

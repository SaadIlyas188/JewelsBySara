"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Package, Truck, CreditCard, RefreshCw, Mail } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function FAQsPage() {
  const supabase = createClientComponentClient()
  const [contact, setContact] = useState({ email: "", phone: "" })

  useEffect(() => {
    const fetchStoreInfo = async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("email, phone")
        .limit(1)
        .single()
      if (error) console.error("Error fetching store info:", error)
      if (data) setContact({ email: data.email || "", phone: data.phone || "" })
    }
    fetchStoreInfo()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 space-y-3 md:space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, and policies.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {/* Orders & Products */}
          <FAQCard
            icon={<Package className="h-6 w-6 text-raspberry" />}
            title="Orders & Products"
            items={[
              {
                q: "How do I place an order?",
                a: "Browse our collection, add items to your cart, and proceed to checkout. You can checkout as a guest or create an account for faster future purchases.",
              },
              {
                q: "Can I modify my order after placing it?",
                a: `Please contact us immediately at ${contact.email || "support@example.com"} or call ${
                  contact.phone || "+92 300 0000000"
                }. If your order hasn't been processed yet, we'll do our best to accommodate changes.`,
              },
              {
                q: "Are your products handmade?",
                a: "Yes! All our bridal clutches, nikkah pens, and nikkah glasses are handcrafted with great attention to detail. Each piece is unique.",
              },
              {
                q: "Do you offer custom designs?",
                a: "Yes, we offer customization for bulk or special orders. Contact us to discuss your ideas.",
              },
            ]}
          />

          {/* Shipping & Delivery */}
          <FAQCard
            icon={<Truck className="h-6 w-6 text-raspberry" />}
            title="Shipping & Delivery"
            items={[
              {
                q: "How long does shipping take?",
                a: "Standard shipping takes 3–5 business days to major cities. Express shipping (1–2 days) and same-day delivery in Lahore are also available. Processing time is 1–2 business days.",
              },
              {
                q: "Do you ship internationally?",
                a: "Currently, we only ship within Pakistan. International shipping is coming soon!",
              },
              {
                q: "How can I track my order?",
                a: "Once your order ships, you’ll receive a tracking number via email. You can also track your order on our Track Order page.",
              },
              {
                q: "What if my package is delayed?",
                a: "If your package is delayed, please contact us right away. We'll coordinate with our courier to resolve it.",
              },
            ]}
          />

          {/* Payment */}
          <FAQCard
            icon={<CreditCard className="h-6 w-6 text-raspberry" />}
            title="Payment"
            items={[
              {
                q: "What payment methods do you accept?",
                a: "We currently accept Cash on Delivery (COD) for all orders. Payment is collected upon delivery.",
              },
              {
                q: "Is Cash on Delivery available everywhere?",
                a: "Yes, COD is available throughout Pakistan at no extra charge.",
              },
              {
                q: "Are my payment details secure?",
                a: "Since we use COD, you never share payment details online. Your personal information remains private and secure.",
              },
            ]}
          />

          {/* Returns & Exchanges */}
          <FAQCard
            icon={<RefreshCw className="h-6 w-6 text-raspberry" />}
            title="Returns & Exchanges"
            items={[
              {
                q: "What is your return policy?",
                a: "We offer a 30-day return policy. Items must be unused, in original packaging, and in the same condition as received.",
              },
              {
                q: "How do I return an item?",
                a: "Contact us with your order number and reason for return. We'll send you a return label and guide you through the process.",
              },
              {
                q: "Do you offer exchanges?",
                a: "Yes! Free exchanges for different sizes, colors, or styles within 30 days.",
              },
              {
                q: "Can I return personalized items?",
                a: "Unfortunately, personalized or custom-made items can’t be returned unless defective.",
              },
            ]}
          />

          {/* Contact / Still Have Questions */}
          <Card className="border-2 bg-baby-pink/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-raspberry" />
                <CardTitle className="text-lg sm:text-xl">Still Have Questions?</CardTitle>
              </div>
              <CardDescription>We're here to help!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5">
                Can't find the answer you're looking for? Our customer service team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`mailto:${contact.email || "support@example.com"}`}
                  className="inline-flex items-center justify-center px-5 py-3 w-full sm:w-auto bg-raspberry text-white rounded-lg hover:bg-raspberry/90 transition-colors font-medium text-sm sm:text-base"
                >
                  Email Us
                </a>
                <a
                  href={`tel:${contact.phone?.replace(/\s/g, "") || "+923000000000"}`}
                  className="inline-flex items-center justify-center px-5 py-3 w-full sm:w-auto border-2 border-raspberry text-raspberry rounded-lg hover:bg-baby-pink transition-colors font-medium text-sm sm:text-base"
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

/* 🧩 Reusable FAQ Card Component */
function FAQCard({ icon, title, items }) {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-sm sm:text-base font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

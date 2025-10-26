"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { RefreshCw, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ReturnsPage() {
  const supabase = createClientComponentClient()
  const [contact, setContact] = useState({ email: "", phone: "" })

  useEffect(() => {
    const fetchStoreInfo = async () => {
      const { data, error } = await supabase.from("store_settings").select("email, phone").limit(1).single()
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
            Returns & Exchanges
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        {/* Return & Exchange Policies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 md:mb-12">
          {[
            {
              icon: <Clock className="h-6 w-6 text-raspberry" />,
              title: "Return Window",
              desc: "30-day return policy",
              text: "You have 30 days from the date of delivery to return your item. Items must be unused and in their original packaging.",
            },
            {
              icon: <RefreshCw className="h-6 w-6 text-raspberry" />,
              title: "Exchange Policy",
              desc: "Free exchanges within 30 days",
              text: "We offer free exchanges for size, color, or style changes. Contact us and we'll handle it for you.",
            },
          ].map((item, idx) => (
            <Card key={idx} className="border-2 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-baby-pink">{item.icon}</div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Return Steps */}
        <Card className="border-2 mb-10 md:mb-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">How to Return an Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                step: 1,
                title: "Contact Us",
                desc: `Email us at ${contact.email || "support@example.com"} or call ${contact.phone || "+92 300 0000000"} with your order number and reason for return.`,
              },
              {
                step: 2,
                title: "Pack Your Item",
                desc: "Securely pack the item in its original packaging. Include all accessories, tags, and documents.",
              },
              {
                step: 3,
                title: "Ship It Back",
                desc: "We'll provide a return shipping label. Drop off your package at your nearest courier location.",
              },
              {
                step: 4,
                title: "Receive Your Refund",
                desc: "Once we receive and inspect your return, we'll process your refund within 5–7 business days.",
              },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-raspberry text-white flex items-center justify-center font-semibold">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                {i < 3 && <Separator className="my-4 sm:my-6" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Non-returnable Items */}
        <Card className="border-2 mb-10 md:mb-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Items That Cannot Be Returned</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm sm:text-base">
              {[
                "Personalized or custom-made items",
                "Items marked as final sale",
                "Items damaged due to misuse or wear",
                "Items without original packaging or tags",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-raspberry flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-2 bg-baby-pink/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-raspberry" />
              <CardTitle className="text-lg sm:text-xl">Need Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5">
              Our customer service team is here to assist with any questions about returns or exchanges.
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
  )
}

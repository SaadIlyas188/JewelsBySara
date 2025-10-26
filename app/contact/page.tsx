"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ContactPage() {
  const supabase = createClientComponentClient()
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  // Fetch contact details from Supabase
  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("email, phone, address")
        .limit(1)
        .single()

      if (error) console.error("Error fetching contact info:", error)
      if (data) setContactInfo(data)
    }
    fetchContactInfo()
  }, [supabase])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    })
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const whatsappNumber = contactInfo.phone
    ? contactInfo.phone.replace(/\D/g, "")
    : "923001234567"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-gold/20 text-foreground border-gold/30">Get in Touch</Badge>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-balance">
              We'd Love to
              <span className="block text-primary mt-2">Hear From You</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              Have questions about our products or need assistance with your order? We're here to help make your
              experience exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 lg:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <h2 className="font-serif text-3xl font-bold mb-8 text-center lg:text-left">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {["name", "email", "phone", "subject"].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium mb-2 capitalize">
                        {field === "email"
                          ? "Email Address *"
                          : field === "phone"
                          ? "Phone Number"
                          : field === "subject"
                          ? "Subject *"
                          : "Full Name *"}
                      </label>
                      <Input
                        id={field}
                        type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        value={(formData as any)[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        required={["name", "email", "subject"].includes(field)}
                        className="h-12"
                        placeholder={
                          field === "email"
                            ? "your@email.com"
                            : field === "phone"
                            ? "+92 300 1234567"
                            : field === "subject"
                            ? "How can we help?"
                            : "Enter your name"
                        }
                      />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 shadow-lg">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-serif text-2xl font-bold mb-6 text-center lg:text-left">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          {contactInfo.email || "Loading..."}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20">
                        <Phone className="h-6 w-6 text-sage" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Phone</p>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          {contactInfo.phone || "Loading..."}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                        <MapPin className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Address</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {contactInfo.address || "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-serif text-2xl font-bold mb-6 text-center lg:text-left">Follow Us</h3>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors group w-full"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-raspberry/10 group-hover:bg-raspberry/20">
                        <Instagram className="h-5 w-5 text-raspberry" />
                      </div>
                      <span className="font-medium">@jewelsbysara</span>
                    </a>

                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors group w-full"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                        <Facebook className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">JewelsBySara</span>
                    </a>

                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors group w-full"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 group-hover:bg-sage/30">
                        <MessageCircle className="h-5 w-5 text-sage" />
                      </div>
                      <span className="font-medium">WhatsApp Us</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold mb-3">Business Hours</h3>
                  <div className="space-y-2 text-muted-foreground text-sm sm:text-base">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

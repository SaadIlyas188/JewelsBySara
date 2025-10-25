"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    })
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-gold/20 text-foreground border-gold/30">Get in Touch</Badge>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-balance leading-tight">
              We'd Love to
              <span className="block text-primary mt-2">Hear From You</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              Have questions about our products or need assistance with your order? Our team is here to help make your
              experience exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <h2 className="font-serif text-3xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="h-12"
                      placeholder="How can we help?"
                    />
                  </div>
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

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-serif text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <a
                          href="mailto:info@jewelsbysara.com"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          info@jewelsbysara.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 flex-shrink-0">
                        <Phone className="h-6 w-6 text-sage" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Phone</p>
                        <a
                          href="tel:+923001234567"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          +92 300 1234567
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Address</p>
                        <p className="text-muted-foreground">
                          123 Fashion District
                          <br />
                          Karachi, Pakistan
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-serif text-2xl font-bold mb-6">Follow Us</h3>
                  <div className="space-y-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-raspberry/10 group-hover:bg-raspberry/20 transition-colors">
                        <Instagram className="h-5 w-5 text-raspberry" />
                      </div>
                      <span className="font-medium">@jewelsbysara</span>
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Facebook className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">JewelsBySara</span>
                    </a>
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 group-hover:bg-sage/30 transition-colors">
                        <MessageCircle className="h-5 w-5 text-sage" />
                      </div>
                      <span className="font-medium">WhatsApp Us</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <h3 className="font-serif text-xl font-bold mb-3">Business Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
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

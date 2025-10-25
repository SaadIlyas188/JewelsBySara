"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "JewelsBySara",
    storeEmail: "info@jewelsbysara.com",
    storePhone: "+92 300 1234567",
    storeAddress: "Karachi, Pakistan",
    shippingFee: "500",
    freeShippingThreshold: "5000",
    storeDescription:
      "Exquisite handcrafted bridal accessories for your special day. Quality and elegance in every piece.",
  })

  const handleSave = () => {
    localStorage.setItem("jewelsbysara-settings", JSON.stringify(settings))
    toast.success("Settings saved! Your store settings have been updated successfully.")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Update your store details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Phone</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => setSettings((prev) => ({ ...prev, storePhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Input
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeAddress: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeDescription: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure shipping fees and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Standard Shipping Fee (Rs.)</Label>
              <Input
                id="shippingFee"
                type="number"
                value={settings.shippingFee}
                onChange={(e) => setSettings((prev) => ({ ...prev, shippingFee: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (Rs.)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings((prev) => ({ ...prev, freeShippingThreshold: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground">
                Orders above this amount will receive free shipping
              </p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Save } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

export default function AdminSettingsPage() {
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [settingsId, setSettingsId] = useState<number | null>(null)
  const [settings, setSettings] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeDescription: "",
    shippingFee: "",
    freeShippingThreshold: "",
  })

  // ✅ Fetch settings from DB on page load
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("store_settings").select("*").limit(1).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching settings:", error)
        toast.error("Failed to fetch store settings.")
      } else if (data) {
        setSettings({
          storeName: data.store_name || "",
          storeEmail: data.email || "",
          storePhone: data.phone || "",
          storeAddress: data.address || "",
          storeDescription: data.description || "",
          shippingFee: data.standard_shipping_fee?.toString() || "",
          freeShippingThreshold: data.free_shipping_threshold?.toString() || "",
        })
        setSettingsId(data.id)
      }
      setLoading(false)
    }

    fetchSettings()
  }, [supabase])

  // ✅ Save (Insert or Update) settings in DB
  const handleSave = async () => {
    setLoading(true)
    const payload = {
      store_name: settings.storeName,
      email: settings.storeEmail,
      phone: settings.storePhone,
      address: settings.storeAddress,
      description: settings.storeDescription,
      standard_shipping_fee: parseFloat(settings.shippingFee) || 0,
      free_shipping_threshold: parseFloat(settings.freeShippingThreshold) || 0,
      updated_at: new Date().toISOString(),
    }

    try {
      let response
      if (settingsId) {
        // Update existing settings
        response = await supabase.from("store_settings").update(payload).eq("id", settingsId)
      } else {
        // Insert new settings
        response = await supabase.from("store_settings").insert(payload).select().single()
        if (response.data) setSettingsId(response.data.id)
      }

      if (response.error) throw response.error

      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-8 overflow-x-hidden">
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Store Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Store Information</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update your store details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="e.g. Jewels by Sara"
                value={settings.storeName}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email</Label>
              <Input
                id="storeEmail"
                type="email"
                placeholder="you@example.com"
                value={settings.storeEmail}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storePhone">Phone</Label>
              <Input
                id="storePhone"
                placeholder="+92 300 0000000"
                value={settings.storePhone}
                onChange={(e) => setSettings((prev) => ({ ...prev, storePhone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Input
                id="storeAddress"
                placeholder="Street, City, Country"
                value={settings.storeAddress}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeAddress: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea
                id="storeDescription"
                placeholder="Write a short store description..."
                value={settings.storeDescription}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, storeDescription: e.target.value }))
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Shipping Settings</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Configure shipping fees and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Standard Shipping Fee (Rs.)</Label>
              <Input
                id="shippingFee"
                type="number"
                placeholder="e.g. 200"
                value={settings.shippingFee}
                onChange={(e) => setSettings((prev) => ({ ...prev, shippingFee: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (Rs.)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                placeholder="e.g. 3000"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, freeShippingThreshold: e.target.value }))
                }
              />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Orders above this amount will receive free shipping
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full sm:w-auto sm:self-end"
          disabled={loading}
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}

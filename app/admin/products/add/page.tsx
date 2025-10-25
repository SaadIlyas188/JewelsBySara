"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Upload, X, Save, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Product } from "@/lib/types"
import { toast } from "react-hot-toast"
import { supabase } from "../page"

export default function AddProductPage() {
  const router = useRouter()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "bridal-clutches" as Product["category"],
    stockQuantity: "",
    specifications: "",
    featured: false,
    trending: false,
  })

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setImageFiles((prev) => [...prev, ...fileArray])

    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const convertToWebP = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0)
          const webpDataUrl = canvas.toDataURL("image/webp", 0.8)
          resolve(webpDataUrl)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const webpImages = await Promise.all(imageFiles.map((file) => convertToWebP(file)))

      const productData = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        price: Number(formData.price),
        original_price: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        images: webpImages,
        in_stock: Number(formData.stockQuantity) > 0,
        stock_quantity: Number(formData.stockQuantity),
        featured: formData.featured,
        trending: formData.trending,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : null,
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("products").insert(productData)

      if (error) {
        console.error(error)
        toast.error("Failed to add product")

      } else {
        toast.success("Product added successfully!")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to process product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-8 px-4 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/products")}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Add New Product
            </h1>
            <p className="text-muted-foreground mt-1">Create a beautiful new product for your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <Card className="overflow-hidden border-2 hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-8">
              <Label className="text-lg font-semibold mb-4 block">Product Images</Label>

              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                  isDragging
                    ? "border-accent bg-accent/10 scale-105"
                    : "border-pink-200 bg-gradient-to-br from-pink-50/50 to-rose-50/50"
                } hover:border-accent hover:bg-accent/5`}
                style={{
                  backgroundImage: isDragging
                    ? "none"
                    : "radial-gradient(circle, rgba(251, 207, 232, 0.3) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-full">
                      <Upload className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Drop your images here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <Button type="button" variant="outline" className="relative bg-transparent" asChild>
                    <label className="cursor-pointer">
                      Choose Files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">Images will be converted to WebP format</p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-xl overflow-hidden border-2 border-pink-100 hover:border-accent transition-all duration-300 hover:scale-105"
                    >
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive/90 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="overflow-hidden border-2 hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Product Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Elegant Bridal Clutch"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as Product["category"] })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bridal-clutches">Bridal Clutches</SelectItem>
                        <SelectItem value="nikkah-pens">Nikkah Pens</SelectItem>
                        <SelectItem value="nikkah-glasses">Nikkah Glasses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base">
                      Price (Rs.) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="5000"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="text-base">
                      Original Price (Rs.)
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="7000"
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your beautiful product..."
                      rows={6}
                      className="resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-base">
                      Stock Quantity *
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      placeholder="50"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specs" className="text-base">
                      Specifications (JSON)
                    </Label>
                    <Textarea
                      id="specs"
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                      placeholder='{"Material": "Silk", "Dimensions": "8x5 inches"}'
                      rows={3}
                      className="resize-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-8 mt-8 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured" className="text-base cursor-pointer">
                    Featured Product
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="trending"
                    checked={formData.trending}
                    onCheckedChange={(checked) => setFormData({ ...formData, trending: checked })}
                  />
                  <Label htmlFor="trending" className="text-base cursor-pointer">
                    Trending Product
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push("/admin/products")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

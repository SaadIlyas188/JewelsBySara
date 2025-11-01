// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Plus, Edit, Trash2, Search, Upload, X, Save, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import type { Product } from "@/lib/types"
// import { toast } from "@/components/ui/use-toast"
// import { products as mockProducts } from "@/lib/mock-data"
// import { createClient } from "@supabase/supabase-js"

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null)
//   const [imageFiles, setImageFiles] = useState<File[]>([])
//   const [imagePreviews, setImagePreviews] = useState<string[]>([])

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     originalPrice: "",
//     category: "bridal-clutches" as Product["category"],
//     stockQuantity: "",
//     specifications: "",
//     featured: false,
//     trending: false,
//   })

//   useEffect(() => {
//     loadProducts()
//   }, [])

//   const loadProducts = async () => {
//     const { data, error } = await supabase
//       .from("products")
//       .select("*")
//       .order("created_at", { ascending: false })

//     if (error) {
//       console.error(error)
//       toast({ title: "Failed to load products", variant: "destructive" })
//       return
//     }

//     setProducts(data as Product[])
//   }

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])
//     setImageFiles((prev) => [...prev, ...files])

//     files.forEach((file) => {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreviews((prev) => [...prev, reader.result as string])
//       }
//       reader.readAsDataURL(file)
//     })
//   }

//   const removeImage = (index: number) => {
//     setImageFiles((prev) => prev.filter((_, i) => i !== index))
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index))
//   }

//   const convertToWebP = async (file: File): Promise<string> => {
//     return new Promise((resolve) => {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         const img = document.createElement("img")
//         img.onload = () => {
//           const canvas = document.createElement("canvas")
//           canvas.width = img.width
//           canvas.height = img.height
//           const ctx = canvas.getContext("2d")
//           ctx?.drawImage(img, 0, 0)
//           const webpDataUrl = canvas.toDataURL("image/webp", 0.8)
//           resolve(webpDataUrl)
//         }
//         img.src = e.target?.result as string
//       }
//       reader.readAsDataURL(file)
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const webpImages = await Promise.all(imageFiles.map((file) => convertToWebP(file)))

//     const productData = {
//       id: editingProduct?.id || `prod-${Date.now()}`,
//       name: formData.name,
//       slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
//       description: formData.description,
//       price: Number(formData.price),
//       original_price: formData.originalPrice ? Number(formData.originalPrice) : null,
//       category: formData.category,
//       images: editingProduct ? [...(editingProduct.images || []), ...webpImages] : webpImages,
//       in_stock: Number(formData.stockQuantity) > 0,
//       stock_quantity: Number(formData.stockQuantity),
//       featured: editingProduct?.featured || false,
//       trending: editingProduct?.trending || false,
//       specifications: formData.specifications ? JSON.parse(formData.specifications) : null,
//       created_at: editingProduct?.createdAt || new Date().toISOString(),
//     }

//     let error

//     if (editingProduct) {
//       ;({ error } = await supabase.from("products").update(productData).eq("id", editingProduct.id))
//     } else {
//       ;({ error } = await supabase.from("products").insert(productData))
//     }

//     if (error) {
//       console.error(error)
//       toast({ title: "Failed to save product", variant: "destructive" })
//     } else {
//       toast({ title: editingProduct ? "Product updated" : "Product added" })
//       loadProducts()
//       resetForm()
//       setIsAddDialogOpen(false)
//     }
//   }

//   const handleEdit = (product: Product) => {
//     setEditingProduct(product)
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: product.price.toString(),
//       originalPrice: product.originalPrice?.toString() || "",
//       category: product.category,
//       stockQuantity: product.stockQuantity.toString(),
//       specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : "",
//       featured: product.featured || false,
//       trending: product.trending || false,
//     })
//     setImagePreviews(product.images)
//     setIsAddDialogOpen(true)
//   }

//   const handleDelete = async (productId: string) => {
//     if (!confirm("Are you sure you want to delete this product?")) return

//     const { error } = await supabase.from("products").delete().eq("id", productId)

//     if (error) {
//       console.error(error)
//       toast({ title: "Failed to delete product", variant: "destructive" })
//     } else {
//       toast({ title: "Product deleted" })
//       loadProducts()
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       originalPrice: "",
//       category: "bridal-clutches",
//       stockQuantity: "",
//       specifications: "",
//       featured: false,
//       trending: false,
//     })
//     setImageFiles([])
//     setImagePreviews([])
//     setEditingProduct(null)
//   }

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const categories = [
//     { value: "all", label: "All Categories" },
//     { value: "bridal-clutches", label: "Bridal Clutches" },
//     { value: "nikkah-pens", label: "Nikkah Pens" },
//     { value: "nikkah-glasses", label: "Nikkah Glasses" },
//   ]

//   const productsByCategory = categories.slice(1).map((cat) => ({
//     ...cat,
//     count: products.filter((p) => p.category === cat.value).length,
//   }))

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="font-serif text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             Products
//           </h1>
//           <p className="text-muted-foreground">Manage your product inventory</p>
//         </div>

//         {/* Add Product Button (manual control to avoid flicker) */}
//         <Button
//           onClick={() => {
//             resetForm()
//             setEditingProduct(null)
//             setIsAddDialogOpen(true)
//           }}
//           className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Product
//         </Button>

//         {/* Controlled Dialog */}
//         <Dialog
//           open={isAddDialogOpen}
//           onOpenChange={(open) => {
//             setIsAddDialogOpen(open)
//             if (!open) resetForm()
//           }}
//         >
//           {isAddDialogOpen && (
//             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="font-serif text-2xl">
//                   {editingProduct ? "Edit Product" : "Add New Product"}
//                 </DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Images */}
//                 <div className="space-y-4">
//                   <Label>Product Images</Label>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {imagePreviews.map((preview, index) => (
//                       <div
//                         key={index}
//                         className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed"
//                       >
//                         <Image
//                           src={preview || "/placeholder.svg"}
//                           alt={`Preview ${index + 1}`}
//                           fill
//                           className="object-cover"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                       </div>
//                     ))}
//                     <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
//                       <Upload className="h-8 w-8 text-muted-foreground mb-2" />
//                       <span className="text-sm text-muted-foreground">Upload</span>
//                       <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
//                     </label>
//                   </div>
//                 </div>

//                 {/* Product Info */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Product Name *</Label>
//                     <Input
//                       id="name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="category">Category *</Label>
//                     <Select
//                       value={formData.category}
//                       onValueChange={(value) => setFormData({ ...formData, category: value as Product["category"] })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="bridal-clutches">Bridal Clutches</SelectItem>
//                         <SelectItem value="nikkah-pens">Nikkah Pens</SelectItem>
//                         <SelectItem value="nikkah-glasses">Nikkah Glasses</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description *</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="price">Price (Rs.) *</Label>
//                     <Input
//                       id="price"
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
//                     <Input
//                       id="originalPrice"
//                       type="number"
//                       value={formData.originalPrice}
//                       onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="stock">Stock Quantity *</Label>
//                     <Input
//                       id="stock"
//                       type="number"
//                       value={formData.stockQuantity}
//                       onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.featured}
//                       onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
//                     />
//                     Featured
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.trending}
//                       onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
//                     />
//                     Trending
//                   </label>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="specs">Specifications (JSON format)</Label>
//                   <Textarea
//                     id="specs"
//                     value={formData.specifications}
//                     onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
//                     placeholder='{"Material": "Silk", "Dimensions": "8x5 inches"}'
//                     rows={3}
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setIsAddDialogOpen(false)
//                       resetForm()
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
//                     <Save className="mr-2 h-4 w-4" />
//                     {editingProduct ? "Update" : "Add"} Product
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           )}
//         </Dialog>
//       </div>

//       {/* Category Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {productsByCategory.map((cat) => (
//           <Card key={cat.value} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
//             <CardHeader>
//               <CardTitle className="text-lg">{cat.label}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 {cat.count}
//               </p>
//               <p className="text-sm text-muted-foreground">Products</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger className="w-full md:w-[200px]">
//                 <Filter className="mr-2 h-4 w-4" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((cat) => (
//                   <SelectItem key={cat.value} value={cat.value}>
//                     {cat.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Product Tabs */}
//       <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
//         <TabsList className="grid w-full grid-cols-4">
//           {categories.map((cat) => (
//             <TabsTrigger key={cat.value} value={cat.value}>
//               {cat.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {categories.map((cat) => (
//           <TabsContent key={cat.value} value={cat.value} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredProducts.map((product) => (
//                 <Card
//                   key={product.id}
//                   className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
//                 >
//                   <div className="relative h-48 overflow-hidden">
//                     <Image
//                       src={product.images[0] || "/placeholder.svg"}
//                       alt={product.name}
//                       fill
//                       className="object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                     {!product.inStock && (
//                       <Badge className="absolute top-2 right-2 bg-destructive">Out of Stock</Badge>
//                     )}
//                   </div>
//                   <CardContent className="p-4 space-y-3">
//                     <div>
//                       <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
//                       <p className="text-sm text-muted-foreground capitalize">
//                         {product.category.replace("-", " ")}
//                       </p>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xl font-bold">Rs. {product.price.toLocaleString()}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Stock: {product.stockQuantity}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="icon"
//                           className="text-destructive bg-transparent"
//                           onClick={() => handleDelete(product.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//             {filteredProducts.length === 0 && (
//               <Card>
//                 <CardContent className="py-12 text-center text-muted-foreground">
//                   No products found in this category
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/types"
import { toast } from "react-hot-toast"
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const router = useRouter()

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

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    setLoading(false)
    if (error) {
      console.error(error)
      toast.error("Failed to load products")
      return
    }

    setProducts(data as Product[])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
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

    const webpImages = await Promise.all(imageFiles.map((file) => convertToWebP(file)))

    const productData = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      price: Number(formData.price),
      original_price: formData.originalPrice ? Number(formData.originalPrice) : null,
      category: formData.category,
      images: editingProduct ? [...(editingProduct.images || []), ...webpImages] : webpImages,
      in_stock: Number(formData.stockQuantity) > 0,
      stock_quantity: Number(formData.stockQuantity),
      featured: editingProduct?.featured || false,
      trending: editingProduct?.trending || false,
      specifications: formData.specifications ? JSON.parse(formData.specifications) : null,
      created_at: editingProduct?.createdAt || new Date().toISOString(),
    }

    let error

    if (editingProduct) {
      ;({ error } = await supabase.from("products").update(productData).eq("id", editingProduct.id))
    } else {
      ;({ error } = await supabase.from("products").insert(productData))
    }

    if (error) {
      console.error(error)
      toast.error("Failed to save product")
    } else {
      toast.success(editingProduct ? "Product updated" : "Product added")
      loadProducts()
      resetForm()
      // setIsAddDialogOpen(false) // Removed this line as Dialog is no longer used
    }
  }

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) {
      console.error(error)
      toast.error("Failed to delete product")
    } else {
      toast.success("Product deleted")
      loadProducts()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "bridal-clutches",
      stockQuantity: "",
      specifications: "",
      featured: false,
      trending: false,
    })
    setImageFiles([])
    setImagePreviews([])
    setEditingProduct(null)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "bridal-clutches", label: "Bridal Clutches" },
    { value: "nikkah-accessories", label: "Nikkah Accessories" },
    { value: "jewelry", label: "Jewelry" },
  ]

  const productsByCategory = categories.slice(1).map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.value).length,
  }))

return (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Products
        </h1>
        <p className="text-muted-foreground">Manage your product inventory</p>
      </div>

      <Button
        onClick={() => router.push("/admin/products/add")}
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>

    {/* Category Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {productsByCategory.map((cat) => (
        <Card key={cat.value} className="hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm sm:text-lg text-center">{cat.label}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {cat.count}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Products</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Filters */}
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    {/* Product Tabs */}
<Tabs
  value={selectedCategory}
  onValueChange={setSelectedCategory}
  className="relative z-10"
>
  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
    {categories.map((cat) => (
      <TabsTrigger key={cat.value} value={cat.value}>
        {cat.label}
      </TabsTrigger>
    ))}
  </TabsList>

  {categories.map((cat) => (
    <TabsContent
      key={cat.value}
      value={cat.value}
      className="relative mt-8 space-y-4"
    >
      {loading ? (
        <div className="col-span-full flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No products found in this category
          </CardContent>
        </Card>
      ) : (
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5 
            gap-3 
            sm:gap-4 
            md:gap-6
          "
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl text-sm sm:text-base"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.stock_quantity === 0 && (
                  <Badge className="absolute top-2 right-2 bg-destructive text-xs sm:text-sm">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                    {product.category.replace('-', ' ')}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div>
                    <p className="text-base sm:text-lg font-bold">
                      Rs. {product.price.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Stock: {product.stock_quantity}
                    </p>
                  </div>

                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 sm:w-8 sm:h-8"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  ))}
</Tabs>


  </div>
)
}

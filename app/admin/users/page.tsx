"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Search, Mail, Phone, MapPin, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from "react-hot-toast" // ✅ replaced ShadCN toast with React Hot Toast

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Profile {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  city?: string
  country?: string
  address?: string
  postal_code?: string
  password?: string
  active: boolean
  orders?: string[]
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // 🚀 Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
      console.log("Fetched users:", data)
      if (error) throw error
      setUsers(data || [])
      
    } catch (err: any) {
      toast.error(err.message || "Failed to load users from Supabase ❌")
    } finally {
      setLoading(false)
    }
  }

  // 🗑️ Delete user (optional)
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", userId)
      if (error) throw error
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success("User deleted successfully 🗑️")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong ❌")
    }
  }

  // 🔄 Toggle activity status
  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ active: !currentStatus })
        .eq("id", userId)

      if (error) throw error

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, active: !currentStatus } : u))
      )

      toast.success(`User ${!currentStatus ? "activated ✅" : "deactivated ⚪️"}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status ❌")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
  <>
    <Toaster position="top-right" reverseOrder={false} />

    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Users
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage customer accounts and profiles
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6 text-center sm:text-left">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {users.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-full sm:max-w-md mx-auto sm:mx-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-xl transition-all duration-300 group overflow-hidden break-words"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                        {user.first_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {user.first_name} {user.last_name}
                      </h3>
                      <Badge
                        variant={user.active ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="space-y-2 text-sm break-all">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-xs truncate">
                        {user.city}, {user.country}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-2 border-t text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <span>{user.active ? "Active" : "Inactive"}</span>
                    <Switch
                      checked={user.active}
                      onCheckedChange={() =>
                        handleToggleActive(user.id, user.active)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No users found
          </CardContent>
        </Card>
      )}
    </div>
  </>
)

}

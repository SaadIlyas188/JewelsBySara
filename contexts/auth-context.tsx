// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import type { User } from "@/lib/types"
// import { createClient } from "@supabase/supabase-js"

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )


// interface AuthContextType {
//   user: User | null
//   login: (email: string, password: string) => Promise<boolean>
//   signup: (userData: {
//     email: string
//     password: string
//     username: string
//     firstName: string
//     lastName: string
//     phone: string
//     city: string
//     country: string
//     address: string
//     postalCode: string
//   }) => Promise<boolean>
//   logout: () => void
//   isAuthenticated: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     const savedUser = localStorage.getItem("jewelsbysara-user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//   }, [])

//   useEffect(() => {
//     if (mounted) {
//       if (user) {
//         localStorage.setItem("jewelsbysara-user", JSON.stringify(user))
//       } else {
//         localStorage.removeItem("jewelsbysara-user")
//       }
//     }
//   }, [user, mounted])

//   const login = async (email: string, password: string): Promise<boolean> => {
//   try {
//     // Try fetching user from Supabase profiles table
//     const { data: userFromDb, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("email", email)
//       .limit(1)
//       .single()

//     if (error && error.code !== "PGRST116") {
//       // Some unexpected error
//       console.error(error)
//     }

//     let user: User

//     if (userFromDb) {
//       // If user exists in DB, use that
//       user = {
//         id: userFromDb.id,
//         email: userFromDb.email,
//         name: `${userFromDb.first_name} ${userFromDb.last_name}`,
//         username: userFromDb.username || "",
//         firstName: userFromDb.first_name,
//         lastName: userFromDb.last_name,
//         createdAt: new Date().toISOString(),
//         phone: userFromDb.phone || "",
//         shippingAddress: userFromDb.shipping_address || {
//           street: "",
//           city: "",
//           country: "",
//           postalCode: "",
//         },
//       }
//     } else {
//       // If no user found, create a mock user anyway
//       user = {
//         id: `user-${Date.now()}`,
//         email,
//         name: "Guest User",
//         username: "guest",
//         firstName: "Guest",
//         lastName: "User",
//         createdAt: new Date().toISOString(),
//         phone: "",
//         shippingAddress: {
//           street: "",
//           city: "",
//           country: "",
//           postalCode: "",
//         },
//       }
//     }

//     // Update AuthContext and localStorage
//     setUser(user)
//     return true
//   } catch (err) {
//     console.error(err)
//     // Still log in even on error
//     setUser({
//       id: `user-${Date.now()}`,
//       email,
//       name: "Guest User",
//       username: "guest",
//       firstName: "Guest",
//       lastName: "User",
//       createdAt: new Date().toISOString(),
//       phone: "",
//       shippingAddress: { street: "", city: "", country: "", postalCode: "" },
//     })
//     return true
//   }
// }


//   const signup = async (userData: {
//     email: string
//     password: string
//     username: string
//     firstName: string
//     lastName: string
//     phone: string
//     city: string
//     country: string
//     address: string
//     postalCode: string
//   }): Promise<boolean> => {
//     const users = JSON.parse(localStorage.getItem("jewelsbysara-users") || "[]")

//     if (users.find((u: User) => u.email === userData.email)) {
//       return false
//     }

//     const newUser: User & { password: string } = {
//       id: `user-${Date.now()}`,
//       email: userData.email,
//       name: `${userData.firstName} ${userData.lastName}`,
//       password: userData.password,
//       createdAt: new Date().toISOString(),
//       username: userData.username,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       phone: userData.phone,
//       shippingAddress: {
//         street: userData.address,
//         city: userData.city,
//         country: userData.country,
//         postalCode: userData.postalCode,
//       },
//     }

//     users.push(newUser)
//     localStorage.setItem("jewelsbysara-users", JSON.stringify(users))

//     const { password: _, ...userWithoutPassword } = newUser
//     setUser(userWithoutPassword)
//     return true
//   }

//   const logout = () => {
//     setUser(null)
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         signup,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: {
    email: string
    password: string
    username: string
    firstName: string
    lastName: string
    phone: string
    city: string
    country: string
    address: string
    postalCode: string
  }) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean // 👈 new
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // 👈 added

  useEffect(() => {
    const savedUser = localStorage.getItem("jewelsbysara-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false) // 👈 done loading after reading localStorage
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem("jewelsbysara-user", JSON.stringify(user))
    else localStorage.removeItem("jewelsbysara-user")
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single()

      if (error || !data) return false

      const loggedInUser: User = {
        id: data.id.toString(),
        email: data.email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        username: data.username,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        phone: data.phone ?? "",
        createdAt: data.created_at ?? new Date().toISOString(),
        shippingAddress: {
          street: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          postalCode: data.postal_code?.toString() ?? "",
        },
      }

      setUser(loggedInUser)
      return true
    } catch {
      return false
    }
  }

  const signup = async (userData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            city: userData.city,
            country: userData.country,
            address: userData.address,
            postal_code: parseInt(userData.postalCode, 10) || null,
          },
        ])
        .select("*")
        .single()

      if (error) return false

      const newUser: User = {
        id: data.id.toString(),
        email: data.email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        username: data.username,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        phone: data.phone ?? "",
        createdAt: data.created_at ?? new Date().toISOString(),
        shippingAddress: {
          street: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          postalCode: data.postal_code?.toString() ?? "",
        },
      }

      setUser(newUser)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("jewelsbysara-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { User } from "@/lib/database-types"

// Default user for when data can't be loaded
const DEFAULT_USER: User = {
  id: "default-user",
  username: "Demo User",
  email: null,
  created_at: new Date().toISOString(),
}

// Store the current user ID
let currentUserId: string | null = "default-user"

// Get all users
export async function getAllUsers() {
  try {
    const supabase = createServerComponentClient()

    try {
      const { data, error } = await supabase.from("users").select("*").order("username", { ascending: true })

      if (error) {
        console.error("Error fetching users:", error)
        return [DEFAULT_USER] // Return default user array
      }

      return (data as User[]) || [DEFAULT_USER]
    } catch (error) {
      console.error("Error in supabase query:", error)
      return [DEFAULT_USER] // Return default user array
    }
  } catch (error) {
    console.error("Error creating supabase client:", error)
    return [DEFAULT_USER] // Return default user array
  }
}

// Create a new user
export async function createUser(username: string, email?: string) {
  try {
    const supabase = createServerComponentClient()

    try {
      const { data, error } = await supabase
        .from("users")
        .insert({
          username,
          email: email || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        // Return a default user
        const defaultUser = {
          id: `default-${Date.now()}`,
          username,
          email: email || null,
          created_at: new Date().toISOString(),
        }
        currentUserId = defaultUser.id
        return defaultUser as User
      }

      // Set as current user
      currentUserId = data.id

      return data as User
    } catch (error) {
      console.error("Error in supabase query:", error)
      // Return a default user
      const defaultUser = {
        id: `default-${Date.now()}`,
        username,
        email: email || null,
        created_at: new Date().toISOString(),
      }
      currentUserId = defaultUser.id
      return defaultUser as User
    }
  } catch (error) {
    console.error("Error creating supabase client:", error)
    // Return a default user
    const defaultUser = {
      id: `default-${Date.now()}`,
      username,
      email: email || null,
      created_at: new Date().toISOString(),
    }
    currentUserId = defaultUser.id
    return defaultUser as User
  }
}

// Delete a user and all associated data
export async function deleteUser(userId: string) {
  // If it's our default user, just return success
  if (userId === "default-user" || userId.startsWith("default-")) {
    return { success: true }
  }

  try {
    const supabase = createServerComponentClient()

    try {
      // Delete the user
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: error.message }
      }

      // If this was the current user, reset to default
      if (currentUserId === userId) {
        currentUserId = "default-user"
      }

      return { success: true }
    } catch (error) {
      console.error("Error in supabase query:", error)
      return { success: false, error: "Database operation failed" }
    }
  } catch (error) {
    console.error("Error creating supabase client:", error)
    return { success: false, error: "Failed to connect to database" }
  }
}

// Set the current user
export async function setCurrentUser(userId: string) {
  currentUserId = userId
  return { success: true }
}

// Get the current user ID
export async function getCurrentUserId() {
  if (!currentUserId) {
    currentUserId = "default-user"
  }
  return currentUserId
}

// Get the current user
export async function getCurrentUser() {
  try {
    const userId = await getCurrentUserId()

    // If it's our default user, return the default user object
    if (userId === "default-user" || userId.startsWith("default-")) {
      return DEFAULT_USER
    }

    try {
      const supabase = createServerComponentClient()

      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

        if (error) {
          console.error("Error fetching current user:", error)
          return DEFAULT_USER
        }

        return data as User
      } catch (error) {
        console.error("Error in supabase query:", error)
        return DEFAULT_USER
      }
    } catch (error) {
      console.error("Error creating supabase client:", error)
      return DEFAULT_USER
    }
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return DEFAULT_USER
  }
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  try {
    const userId = await getCurrentUserId()

    // If it's our default user, just return success
    if (userId === "default-user" || userId.startsWith("default-")) {
      return { success: true }
    }

    try {
      const supabase = createServerComponentClient()

      const username = formData.get("username") as string
      const email = formData.get("email") as string
      const ageStr = formData.get("age") as string
      const age = ageStr ? Number.parseInt(ageStr) : undefined
      const gender = formData.get("gender") as string

      // Process health conditions as an array
      const healthConditions = formData.getAll("healthConditions") as string[]

      // Process psychiatric conditions as an array
      const psychiatricConditions = formData.getAll("psychiatricConditions") as string[]

      try {
        const { error } = await supabase
          .from("users")
          .update({
            username,
            email,
            age,
            gender,
            health_conditions: healthConditions,
            psychiatric_conditions: psychiatricConditions,
          })
          .eq("id", userId)

        if (error) {
          console.error("Error updating user profile:", error)
          return { success: false, error: error.message }
        }

        return { success: true }
      } catch (error) {
        console.error("Error in supabase query:", error)
        return { success: false, error: "Database operation failed" }
      }
    } catch (error) {
      console.error("Error creating supabase client:", error)
      return { success: false, error: "Failed to connect to database" }
    }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return { success: false, error: "Failed to get current user" }
  }
}

// Get user profile
export async function getUserProfile() {
  return getCurrentUser()
}

// Temporary user ID for demo purposes
export async function getTemporaryUserId() {
  return getCurrentUserId()
}

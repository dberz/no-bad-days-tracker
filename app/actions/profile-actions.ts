"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"
import { clearSession } from "./auth-actions"

// Get user profile
export async function getUserProfile() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("public.user_profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return { ...data, username: user.username, email: user.email }
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const supabase = createServerComponentClient()

  // Extract form data
  const age = formData.get("age") ? Number.parseInt(formData.get("age") as string) : null
  const gender = (formData.get("gender") as string) || null
  const healthConditions = formData.getAll("healthConditions") as string[]
  const psychiatricConditions = formData.getAll("psychiatricConditions") as string[]

  // Calculate risk multiplier
  let riskMultiplier = 1.0

  // Age risk
  if (age !== null) {
    if ((age >= 18 && age <= 25) || age > 65) {
      riskMultiplier *= 1.3
    }
  }

  // Health conditions
  if (
    healthConditions.includes("cardiovascular") ||
    healthConditions.includes("liver") ||
    healthConditions.includes("kidney")
  ) {
    riskMultiplier *= 1.5
  }

  // Psychiatric conditions
  if (
    psychiatricConditions.includes("anxiety") ||
    psychiatricConditions.includes("depression") ||
    psychiatricConditions.includes("bipolar")
  ) {
    riskMultiplier *= 1.7
  }

  // Update profile
  const { error } = await supabase
    .from("public.user_profiles")
    .update({
      age,
      gender,
      health_conditions: healthConditions,
      psychiatric_conditions: psychiatricConditions,
      risk_multiplier: riskMultiplier,
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }

  revalidatePath("/profile")
  return { success: true }
}

// Update user account
export async function updateUserAccount(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const supabase = createServerComponentClient()

  const username = formData.get("username") as string
  const email = (formData.get("email") as string) || null

  // Check if username is being changed and if it already exists
  if (username !== user.username) {
    const { data: existingUser } = await supabase.from("auth.users").select("id").eq("username", username).maybeSingle()

    if (existingUser) {
      return { success: false, error: "Username already exists" }
    }
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const { data: existingEmail } = await supabase.from("auth.users").select("id").eq("email", email).maybeSingle()

    if (existingEmail) {
      return { success: false, error: "Email already exists" }
    }
  }

  // Update user account
  const { error } = await supabase
    .from("auth.users")
    .update({
      username,
      email,
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error updating user account:", error)
    return { success: false, error: "Failed to update account" }
  }

  revalidatePath("/profile")
  return { success: true }
}

// Change password
export async function changePassword(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const supabase = createServerComponentClient()

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  // Verify current password
  const { data, error: authError } = await supabase.rpc("authenticate_user", {
    p_username: user.username,
    p_password: currentPassword,
  })

  if (authError || !data || data.length === 0) {
    return { success: false, error: "Current password is incorrect" }
  }

  // Update password
  const { error } = await supabase
    .from("auth.users")
    .update({
      password_hash: newPassword, // This will be hashed by the database trigger
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error changing password:", error)
    return { success: false, error: "Failed to change password" }
  }

  return { success: true }
}

// Delete account
export async function deleteAccount(password: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const supabase = createServerComponentClient()

  // Verify password
  const { data, error: authError } = await supabase.rpc("authenticate_user", {
    p_username: user.username,
    p_password: password,
  })

  if (authError || !data || data.length === 0) {
    return { success: false, error: "Password is incorrect" }
  }

  // Delete user (cascade will delete profile)
  const { error } = await supabase.from("auth.users").delete().eq("id", user.id)

  if (error) {
    console.error("Error deleting account:", error)
    return { success: false, error: "Failed to delete account" }
  }

  // Clear session
  await clearSession()

  revalidatePath("/")
  return { success: true }
}

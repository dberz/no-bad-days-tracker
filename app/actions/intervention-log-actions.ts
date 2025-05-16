"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { InterventionLog } from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

// Get all intervention logs for the current user
export async function getInterventionLogs() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("intervention_logs")
    .select("*")
    .eq("user_id", user.user_id)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching intervention logs:", error)
    throw new Error("Failed to fetch intervention logs")
  }

  return data as InterventionLog[]
}

// Get a specific intervention log by ID
export async function getInterventionLogById(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("intervention_logs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user_id)
    .single()

  if (error) {
    console.error("Error fetching intervention log:", error)
    throw new Error("Failed to fetch intervention log")
  }

  return data as InterventionLog
}

// Add a new intervention log
export async function addInterventionLog(formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const interventionType = formData.get("intervention_type") as string
  const subtype = formData.get("subtype") as string
  const durationStr = formData.get("duration") as string
  const duration = durationStr ? Number.parseInt(durationStr) : undefined
  const intensity = formData.get("intensity") as string
  const quantityStr = formData.get("quantity") as string
  const quantity = quantityStr ? Number.parseFloat(quantityStr) : undefined
  const qualityRatingStr = formData.get("quality_rating") as string
  const qualityRating = qualityRatingStr ? Number.parseInt(qualityRatingStr) : undefined
  const context = formData.get("context") as string
  const location = formData.get("location") as string
  const intentionOutcome = formData.get("intention_outcome") as string
  const notes = formData.get("notes") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string

  // Combine date and time
  const dateTime = new Date(`${date}T${time}`).toISOString()

  // Calculate harm reduction points (simplified for now)
  const harmReduction = 1 // This would be calculated based on intervention type, duration, etc.

  const { data, error } = await supabase
    .from("intervention_logs")
    .insert({
      user_id: user.user_id,
      intervention_type: interventionType,
      subtype,
      duration,
      intensity,
      quantity,
      quality_rating: qualityRating,
      context,
      location,
      intention_outcome: intentionOutcome,
      notes,
      date: dateTime,
      harm_reduction: harmReduction,
    })
    .select()

  if (error) {
    console.error("Error adding intervention log:", error)
    throw new Error("Failed to add intervention log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

// Update an existing intervention log
export async function updateInterventionLog(id: string, formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const interventionType = formData.get("intervention_type") as string
  const subtype = formData.get("subtype") as string
  const durationStr = formData.get("duration") as string
  const duration = durationStr ? Number.parseInt(durationStr) : undefined
  const intensity = formData.get("intensity") as string
  const quantityStr = formData.get("quantity") as string
  const quantity = quantityStr ? Number.parseFloat(quantityStr) : undefined
  const qualityRatingStr = formData.get("quality_rating") as string
  const qualityRating = qualityRatingStr ? Number.parseInt(qualityRatingStr) : undefined
  const context = formData.get("context") as string
  const location = formData.get("location") as string
  const intentionOutcome = formData.get("intention_outcome") as string
  const notes = formData.get("notes") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string

  // Combine date and time
  const dateTime = new Date(`${date}T${time}`).toISOString()

  // Calculate harm reduction points (simplified for now)
  const harmReduction = 1 // This would be calculated based on intervention type, duration, etc.

  const { data, error } = await supabase
    .from("intervention_logs")
    .update({
      intervention_type: interventionType,
      subtype,
      duration,
      intensity,
      quantity,
      quality_rating: qualityRating,
      context,
      location,
      intention_outcome: intentionOutcome,
      notes,
      date: dateTime,
      harm_reduction: harmReduction,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating intervention log:", error)
    throw new Error("Failed to update intervention log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

// Delete an intervention log
export async function deleteInterventionLog(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("intervention_logs").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting intervention log:", error)
    throw new Error("Failed to delete intervention log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true }
}

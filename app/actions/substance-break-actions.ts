"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { SubstanceBreak } from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

export async function getSubstanceBreaks() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("substance_breaks")
    .select("*")
    .eq("user_id", user.user_id)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching substance breaks:", error)
    throw new Error("Failed to fetch substance breaks")
  }

  return data as SubstanceBreak[]
}

export async function getActiveSubstanceBreaks() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("substance_breaks")
    .select("*")
    .eq("user_id", user.user_id)
    .eq("status", "active")
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching active substance breaks:", error)
    throw new Error("Failed to fetch active substance breaks")
  }

  return data as SubstanceBreak[]
}

export async function getSubstanceBreakById(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("substance_breaks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user_id)
    .single()

  if (error) {
    console.error("Error fetching substance break:", error)
    throw new Error("Failed to fetch substance break")
  }

  return data as SubstanceBreak
}

export async function addSubstanceBreak(formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const substanceType = formData.get("substanceType") as string
  const startDate = formData.get("startDate") as string
  const goalDuration = formData.get("goalDuration") as string
  const notes = formData.get("notes") as string

  // Calculate harm reduction points (simplified for now)
  // 4 points per day of abstinence, will be updated when the break ends
  const harmReduction = 4

  const { data, error } = await supabase
    .from("substance_breaks")
    .insert({
      user_id: user.user_id,
      substance_type: substanceType,
      start_date: startDate,
      goal_duration: goalDuration,
      status: "active",
      notes,
      harm_reduction: harmReduction,
    })
    .select()

  if (error) {
    console.error("Error adding substance break:", error)
    throw new Error("Failed to add substance break")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

export async function updateSubstanceBreak(id: string, formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const substanceType = formData.get("substanceType") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const goalDuration = formData.get("goalDuration") as string
  const status = formData.get("status") as string
  const notes = formData.get("notes") as string

  // Calculate harm reduction points (simplified for now)
  let harmReduction = 4

  if (endDate && status === "completed") {
    // Calculate days between start and end
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // 4 points per day, capped at 28 days (4 weeks)
    harmReduction = Math.min(days, 28) * 4
  }

  const { data, error } = await supabase
    .from("substance_breaks")
    .update({
      substance_type: substanceType,
      start_date: startDate,
      end_date: endDate || null,
      goal_duration: goalDuration,
      status,
      notes,
      harm_reduction: harmReduction,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating substance break:", error)
    throw new Error("Failed to update substance break")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

export async function endSubstanceBreak(id: string, status: "completed" | "ended-early") {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const today = new Date().toISOString().split("T")[0]

  // Get the break to calculate harm reduction
  const { data: breakData } = await supabase
    .from("substance_breaks")
    .select("start_date")
    .eq("id", id)
    .eq("user_id", user.user_id)
    .single()

  let harmReduction = 4

  if (breakData) {
    // Calculate days between start and today
    const start = new Date(breakData.start_date)
    const end = new Date(today)
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // 4 points per day, capped at 28 days (4 weeks)
    harmReduction = Math.min(days, 28) * 4
  }

  const { error } = await supabase
    .from("substance_breaks")
    .update({
      end_date: today,
      status,
      harm_reduction: harmReduction,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)

  if (error) {
    console.error("Error ending substance break:", error)
    throw new Error("Failed to end substance break")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true }
}

export async function deleteSubstanceBreak(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("substance_breaks").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting substance break:", error)
    throw new Error("Failed to delete substance break")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true }
}

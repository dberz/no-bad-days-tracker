"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { ExerciseLog } from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

export async function getExerciseLogs() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("user_id", user.user_id)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching exercise logs:", error)
    throw new Error("Failed to fetch exercise logs")
  }

  return data as ExerciseLog[]
}

export async function getExerciseLogById(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user_id)
    .single()

  if (error) {
    console.error("Error fetching exercise log:", error)
    throw new Error("Failed to fetch exercise log")
  }

  return data as ExerciseLog
}

export async function addExerciseLog(formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const date = formData.get("date") as string
  const activityType = formData.get("activityType") as string
  const duration = Number.parseInt(formData.get("duration") as string)
  const intensity = formData.get("intensity") as string
  const notes = formData.get("notes") as string

  // Calculate harm reduction points (simplified for now)
  const harmReduction = duration >= 30 ? 2 : duration >= 15 ? 1 : 0

  const { data, error } = await supabase
    .from("exercise_logs")
    .insert({
      user_id: user.user_id,
      date,
      activity_type: activityType,
      duration,
      intensity,
      notes,
      harm_reduction: harmReduction,
    })
    .select()

  if (error) {
    console.error("Error adding exercise log:", error)
    throw new Error("Failed to add exercise log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

export async function updateExerciseLog(id: string, formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const date = formData.get("date") as string
  const activityType = formData.get("activityType") as string
  const duration = Number.parseInt(formData.get("duration") as string)
  const intensity = formData.get("intensity") as string
  const notes = formData.get("notes") as string

  // Calculate harm reduction points (simplified for now)
  const harmReduction = duration >= 30 ? 2 : duration >= 15 ? 1 : 0

  const { data, error } = await supabase
    .from("exercise_logs")
    .update({
      date,
      activity_type: activityType,
      duration,
      intensity,
      notes,
      harm_reduction: harmReduction,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating exercise log:", error)
    throw new Error("Failed to update exercise log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

export async function deleteExerciseLog(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("exercise_logs").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting exercise log:", error)
    throw new Error("Failed to delete exercise log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true }
}

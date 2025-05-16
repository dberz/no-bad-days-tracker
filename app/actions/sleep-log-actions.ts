"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { SleepLog } from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

export async function getSleepLogs() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", user.user_id)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching sleep logs:", error)
    throw new Error("Failed to fetch sleep logs")
  }

  return data as SleepLog[]
}

export async function getSleepLogById(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user_id)
    .single()

  if (error) {
    console.error("Error fetching sleep log:", error)
    throw new Error("Failed to fetch sleep log")
  }

  return data as SleepLog
}

export async function addSleepLog(formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const date = formData.get("date") as string
  const bedtime = formData.get("bedtime") as string
  const wakeTime = formData.get("wakeTime") as string
  const quality = formData.get("quality") as string
  const supplements = formData.get("supplements") as string
  const notes = formData.get("notes") as string

  // Calculate duration in minutes
  const bedtimeDate = new Date(`2000-01-01T${bedtime}:00`)
  const wakeTimeDate = new Date(`2000-01-01T${wakeTime}:00`)

  // Handle case where wake time is on the next day
  if (wakeTimeDate < bedtimeDate) {
    wakeTimeDate.setDate(wakeTimeDate.getDate() + 1)
  }

  const durationMinutes = Math.round((wakeTimeDate.getTime() - bedtimeDate.getTime()) / (1000 * 60))

  // Process supplements as an array
  const supplementsArray = supplements ? [supplements] : []

  // Calculate harm reduction points (simplified for now)
  const harmReduction = quality === "excellent" || quality === "good" ? 3 : quality === "fair" ? 1.5 : 0

  const { data, error } = await supabase
    .from("sleep_logs")
    .insert({
      user_id: user.user_id,
      date,
      bedtime,
      wake_time: wakeTime,
      duration: durationMinutes,
      quality,
      supplements: supplementsArray,
      notes,
      harm_reduction: harmReduction,
    })
    .select()

  if (error) {
    console.error("Error adding sleep log:", error)
    throw new Error("Failed to add sleep log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

export async function updateSleepLog(id: string, formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const date = formData.get("date") as string
  const bedtime = formData.get("bedtime") as string
  const wakeTime = formData.get("wakeTime") as string
  const quality = formData.get("quality") as string
  const supplements = formData.get("supplements") as string
  const notes = formData.get("notes") as string

  // Calculate duration in minutes
  const bedtimeDate = new Date(`2000-01-01T${bedtime}:00`)
  const wakeTimeDate = new Date(`2000-01-01T${wakeTime}:00`)

  // Handle case where wake time is on the next day
  if (wakeTimeDate < bedtimeDate) {
    wakeTimeDate.setDate(wakeTimeDate.getDate() + 1)
  }

  const durationMinutes = Math.round((wakeTimeDate.getTime() - bedtimeDate.getTime()) / (1000 * 60))

  // Process supplements as an array
  const supplementsArray = supplements ? [supplements] : []

  // Calculate harm reduction points (simplified for now)
  const harmReduction = quality === "excellent" || quality === "good" ? 3 : quality === "fair" ? 1.5 : 0

  const { data, error } = await supabase
    .from("sleep_logs")
    .update({
      date,
      bedtime,
      wake_time: wakeTime,
      duration: durationMinutes,
      quality,
      supplements: supplementsArray,
      notes,
      harm_reduction: harmReduction,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating sleep log:", error)
    throw new Error("Failed to update sleep log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true, data }
}

export async function deleteSleepLog(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("sleep_logs").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting sleep log:", error)
    throw new Error("Failed to delete sleep log")
  }

  revalidatePath("/")
  revalidatePath("/wellness")

  return { success: true }
}

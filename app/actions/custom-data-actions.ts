"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { CustomSubstance, CustomSupplement } from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"

// Custom Substances

export async function getCustomSubstances() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("custom_substances")
    .select("*")
    .eq("user_id", user.user_id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching custom substances:", error)
    throw new Error("Failed to fetch custom substances")
  }

  return data as CustomSubstance[]
}

export async function addCustomSubstance(name: string, harmPointsPerUnit = 1, unitName = "dose", halfLifeDays = 3) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Check if substance already exists
  const { data: existingSubstance } = await supabase
    .from("custom_substances")
    .select("id")
    .eq("user_id", user.user_id)
    .eq("name", name)
    .maybeSingle()

  if (existingSubstance) {
    return { id: existingSubstance.id }
  }

  const { data, error } = await supabase
    .from("custom_substances")
    .insert({
      user_id: user.user_id,
      name,
      harm_points_per_unit: harmPointsPerUnit,
      unit_name: unitName,
      half_life_days: halfLifeDays,
    })
    .select()

  if (error) {
    console.error("Error adding custom substance:", error)
    throw new Error("Failed to add custom substance")
  }

  revalidatePath("/log")

  return data[0]
}

export async function updateCustomSubstance(
  id: string,
  name: string,
  harmPointsPerUnit: number,
  unitName: string,
  halfLifeDays: number,
) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("custom_substances")
    .update({
      name,
      harm_points_per_unit: harmPointsPerUnit,
      unit_name: unitName,
      half_life_days: halfLifeDays,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating custom substance:", error)
    throw new Error("Failed to update custom substance")
  }

  revalidatePath("/log")

  return data[0]
}

export async function deleteCustomSubstance(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("custom_substances").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting custom substance:", error)
    throw new Error("Failed to delete custom substance")
  }

  revalidatePath("/log")

  return { success: true }
}

// Custom Supplements

export async function getCustomSupplements() {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("custom_supplements")
    .select("*")
    .eq("user_id", user.user_id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching custom supplements:", error)
    throw new Error("Failed to fetch custom supplements")
  }

  return data as CustomSupplement[]
}

export async function addCustomSupplement(name: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Check if supplement already exists
  const { data: existingSupplement } = await supabase
    .from("custom_supplements")
    .select("id")
    .eq("user_id", user.user_id)
    .eq("name", name)
    .maybeSingle()

  if (existingSupplement) {
    return { id: existingSupplement.id }
  }

  const { data, error } = await supabase
    .from("custom_supplements")
    .insert({
      user_id: user.user_id,
      name,
    })
    .select()

  if (error) {
    console.error("Error adding custom supplement:", error)
    throw new Error("Failed to add custom supplement")
  }

  revalidatePath("/log")

  return data[0]
}

export async function updateCustomSupplement(id: string, name: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("custom_supplements")
    .update({
      name,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating custom supplement:", error)
    throw new Error("Failed to update custom supplement")
  }

  revalidatePath("/log")

  return data[0]
}

export async function deleteCustomSupplement(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("custom_supplements").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting custom supplement:", error)
    throw new Error("Failed to delete custom supplement")
  }

  revalidatePath("/log")

  return { success: true }
}

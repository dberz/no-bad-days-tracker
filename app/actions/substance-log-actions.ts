"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type {
  SubstanceLog,
  CustomSubstance,
  CustomSupplement,
  HarmIndex,
  InterventionLog,
  User,
} from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import {
  calculateSubstanceHarmPoints,
  calculateUserRiskMultiplier,
  calculateHarmDecay,
  getSubstanceHalfLife,
  calculateInterventionReduction,
} from "@/lib/harm-scale"
import { differenceInDays } from "date-fns"

// Update the getTemporaryUserId function to use the getCurrentUserId function
import { getCurrentUserId } from "./user-actions"
import { getCurrentUser } from "./auth-actions"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Replace the getTemporaryUserId function with this:
const getTemporaryUserId = async () => {
  return getCurrentUserId()
}

// Get user profile for risk calculation
export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as User
}

// SUBSTANCE LOGS

// Update the getSubstanceLogs function to handle unauthenticated users gracefully
export async function getSubstanceLogs() {
  const supabase = createServerComponentClient()

  try {
    const user = await getCurrentUser()

    // If no user is authenticated, return empty array instead of throwing an error
    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from("substance_logs")
      .select("*")
      .eq("user_id", user.user_id)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching substance logs:", error)
      return [] // Return empty array instead of throwing
    }

    return data as SubstanceLog[]
  } catch (error) {
    console.error("Error in getSubstanceLogs:", error)
    return [] // Return empty array for any errors
  }
}

// Get a specific substance log by ID
export async function getSubstanceLogById(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("substance_logs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user_id)
    .single()

  if (error) {
    console.error("Error fetching substance log:", error)
    throw new Error("Failed to fetch substance log")
  }

  return data as SubstanceLog
}

// Update the addSubstanceLog function to be more robust and provide better debugging

// Find the addSubstanceLog function and replace it with this improved version:
export async function addSubstanceLog(formData: FormData) {
  try {
    const user = await getCurrentUser()

    // If no user is authenticated, store locally and return success
    if (!user) {
      console.log("No authenticated user, would store locally in a real app")
      return { success: true, data: [], local: true }
    }

    // Log all form data for debugging
    console.log("All form data keys:")
    for (const key of formData.keys()) {
      console.log(`${key}: ${formData.get(key)}`)
    }

    // Extract form data with fallbacks for each field
    const substanceType = (formData.get("substanceType") as string) || "unknown"
    const substanceSubtype = (formData.get("substanceSubtype") as string) || null
    const amount = (formData.get("amount") as string) || "1"
    const context = (formData.get("context") as string) || "other"
    const supplementsString = (formData.get("supplements") as string) || ""
    const supplements = supplementsString ? supplementsString.split(",").map((s) => s.trim()) : []
    const notes = (formData.get("notes") as string) || ""
    const feelingDuring = (formData.get("feeling_during") as string) || null
    const feelingAfter = (formData.get("feeling_after") as string) || null
    const notesDuring = (formData.get("notes_during") as string) || null
    const notesAfter = (formData.get("notes_after") as string) || null

    // Get date and time from form
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0]
    const time = (formData.get("time") as string) || new Date().toTimeString().split(" ")[0].substring(0, 5)
    console.log("Server received date:", date, "time:", time)

    // Combine date and time to create a proper ISO string
    let logDateTime
    if (date && time) {
      try {
        // Ensure proper format: YYYY-MM-DDThh:mm
        logDateTime = new Date(`${date}T${time}`).toISOString()
        console.log("Successfully parsed date time:", logDateTime)
      } catch (error) {
        console.error("Error parsing date:", error)
        logDateTime = new Date().toISOString()
      }
    } else {
      console.log("Using current date/time as fallback")
      logDateTime = new Date().toISOString()
    }

    // Calculate harm points based on substance type and context
    const harmPoints = calculateSubstanceHarmPoints(
      substanceType,
      substanceSubtype,
      Number.parseFloat(amount) || 1, // Default to 1 if amount is not a valid number
      context || "other",
      1.0, // Default risk multiplier
      false, // Default for multiple substances
    )

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    // Create the log object
    const logData = {
      user_id: user.id,
      substance_type: substanceType,
      substance_subtype: substanceSubtype || null,
      amount,
      date: logDateTime,
      context: context || null,
      harm_points: harmPoints,
      supplements: supplements.length > 0 ? supplements : null,
      notes: notes || null,
      feeling_during: feelingDuring ? Number.parseInt(feelingDuring) : null,
      feeling_after: feelingAfter ? Number.parseInt(feelingAfter) : null,
      notes_during: notesDuring || null,
      notes_after: notesAfter || null,
    }

    console.log("Inserting log data:", logData)

    const { data, error } = await supabase.from("substance_logs").insert([logData]).select()

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: error.message }
    }

    // Recalculate harm index after adding a new log
    try {
      await calculateAndStoreHarmIndex(user.id)
    } catch (indexError) {
      console.error("Error calculating harm index:", indexError)
      // Continue even if harm index calculation fails
    }

    // Revalidate paths to refresh the data
    revalidatePath("/")
    revalidatePath("/log")
    revalidatePath("/insights")

    return { success: true, data }
  } catch (error: any) {
    console.error("Error adding substance log:", error)
    return { success: false, error: error.message || "Unknown error occurred" }
  }
}

// Update an existing substance log
export async function updateSubstanceLog(id: string, formData: FormData) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const substanceType = formData.get("substance_type") as string
  const substanceSubtype = formData.get("substance_subtype") as string
  const amount = formData.get("amount") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const context = formData.get("context") as string
  const supplements = formData.get("supplements") as string
  const notes = formData.get("notes") as string
  const feelingDuring = Number.parseInt(formData.get("feeling_during") as string) || null
  const feelingAfter = Number.parseInt(formData.get("feeling_after") as string) || null
  const notesDuring = formData.get("notes_during") as string
  const notesAfter = formData.get("notes_after") as string

  // Combine date and time
  const dateTime = new Date(`${date}T${time}`).toISOString()

  // Process supplements as an array
  const supplementsArray = supplements ? [supplements] : []

  // Get user profile for risk calculation
  const userProfile = await getUserProfile(user.user_id)

  // Check if multiple substances were used on the same day
  const today = new Date(dateTime).toISOString().split("T")[0]
  const { data: todayLogs } = await supabase
    .from("substance_logs")
    .select("substance_type")
    .eq("user_id", user.user_id)
    .neq("id", id) // Exclude the current log
    .gte("date", `${today}T00:00:00`)
    .lte("date", `${today}T23:59:59`)

  const multipleSubstances =
    todayLogs && todayLogs.length > 0 && !todayLogs.every((log) => log.substance_type === substanceType)

  // Calculate harm points
  const userRiskMultiplier = userProfile
    ? calculateUserRiskMultiplier(
        userProfile.age,
        userProfile.gender,
        userProfile.health_conditions,
        userProfile.psychiatric_conditions,
        substanceType,
      )
    : 1.0

  const harmPoints = calculateSubstanceHarmPoints(
    substanceType,
    substanceSubtype,
    Number.parseFloat(amount) || 1, // Use the actual amount value
    context,
    userRiskMultiplier,
    multipleSubstances,
  )

  const { data, error } = await supabase
    .from("substance_logs")
    .update({
      substance_type: substanceType === "other" ? substanceSubtype : substanceType,
      substance_subtype: substanceType === "other" ? null : substanceSubtype || null,
      amount,
      date: dateTime,
      context,
      supplements: supplementsArray,
      notes,
      feeling_during: feelingDuring,
      feeling_after: feelingAfter,
      notes_during: notesDuring,
      notes_after: notesAfter,
      harm_points: harmPoints,
    })
    .eq("id", id)
    .eq("user_id", user.user_id)
    .select()

  if (error) {
    console.error("Error updating substance log:", error)
    throw new Error("Failed to update substance log")
  }

  // Recalculate harm index after updating a log
  await calculateAndStoreHarmIndex(user.user_id)

  revalidatePath("/")
  revalidatePath("/log")
  revalidatePath("/insights")

  return { success: true, data }
}

// Delete a substance log
export async function deleteSubstanceLog(id: string) {
  const supabase = createServerComponentClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("substance_logs").delete().eq("id", id).eq("user_id", user.user_id)

  if (error) {
    console.error("Error deleting substance log:", error)
    throw new Error("Failed to delete substance log")
  }

  // Recalculate harm index after deleting a log
  await calculateAndStoreHarmIndex(user.user_id)

  revalidatePath("/")
  revalidatePath("/log")
  revalidatePath("/insights")

  return { success: true }
}

export async function getRecentSubstanceLogs(limit = 5) {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    const { data, error } = await supabase
      .from("substance_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    console.error("Error getting recent substance logs:", error)
    return []
  }
}

export async function getAllSubstanceLogs() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    const { data, error } = await supabase
      .from("substance_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    console.error("Error getting all substance logs:", error)
    return []
  }
}

// INTERVENTION LOGS

export async function getInterventionLogs() {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  const { data, error } = await supabase
    .from("intervention_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching intervention logs:", error)
    throw new Error("Failed to fetch intervention logs")
  }

  return data as InterventionLog[]
}

export async function addInterventionLog(formData: FormData) {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  try {
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

    // Calculate harm reduction points
    const harmReduction = calculateInterventionReduction(interventionType, duration, quantity)

    const { data, error } = await supabase
      .from("intervention_logs")
      .insert({
        user_id: userId,
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
        harm_reduction: harmReduction, // Make sure this is included
      })
      .select()

    if (error) {
      console.error("Error adding intervention log:", error)
      throw new Error(`Failed to add intervention log: ${error.message}`)
    }

    // Recalculate harm index after adding a new intervention
    await calculateAndStoreHarmIndex(userId)

    revalidatePath("/")
    revalidatePath("/wellness")
    revalidatePath("/insights")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in addInterventionLog:", error)
    throw error
  }
}

// CUSTOM SUBSTANCES

export async function getCustomSubstances() {
  try {
    const supabase = createServerComponentClient()
    const userId = await getTemporaryUserId()

    // Add a small delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))

    const { data, error } = await supabase
      .from("custom_substances")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching custom substances:", error)
      // Return empty array instead of throwing
      return []
    }

    return data as CustomSubstance[]
  } catch (error) {
    console.error("Unexpected error in getCustomSubstances:", error)
    // Return empty array on error
    return []
  }
}

export async function addCustomSubstance(name: string) {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  // Check if substance already exists
  const { data: existingSubstance } = await supabase
    .from("custom_substances")
    .select("id")
    .eq("user_id", userId)
    .eq("name", name)
    .maybeSingle()

  if (existingSubstance) {
    return { id: existingSubstance.id }
  }

  const { data, error } = await supabase
    .from("custom_substances")
    .insert({
      user_id: userId,
      name,
      harm_points_per_unit: 1, // Default value
      unit_name: "dose", // Default value
      half_life_days: 3, // Default value
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error adding custom substance:", error)
    throw new Error("Failed to add custom substance")
  }

  return data
}

export async function deleteCustomSubstance(id: string) {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  const { error } = await supabase.from("custom_substances").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting custom substance:", error)
    throw new Error("Failed to delete custom substance")
  }

  revalidatePath("/log")

  return { success: true }
}

// CUSTOM SUPPLEMENTS

export async function getCustomSupplements() {
  try {
    const supabase = createServerComponentClient()
    const userId = await getTemporaryUserId()

    // Add a small delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))

    const { data, error } = await supabase
      .from("custom_supplements")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching custom supplements:", error)
      // Return empty array instead of throwing
      return []
    }

    return data as CustomSupplement[]
  } catch (error) {
    console.error("Unexpected error in getCustomSupplements:", error)
    // Return empty array on error
    return []
  }
}

export async function addCustomSupplement(name: string) {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  // Check if supplement already exists
  const { data: existingSupplement } = await supabase
    .from("custom_supplements")
    .select("id")
    .eq("user_id", userId)
    .eq("name", name)
    .maybeSingle()

  if (existingSupplement) {
    return { id: existingSupplement.id }
  }

  const { data, error } = await supabase
    .from("custom_supplements")
    .insert({
      user_id: userId,
      name,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error adding custom supplement:", error)
    throw new Error("Failed to add custom supplement")
  }

  return data
}

export async function deleteCustomSupplement(id: string) {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  const { error } = await supabase.from("custom_supplements").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting custom supplement:", error)
    throw new Error("Failed to delete custom supplement")
  }

  revalidatePath("/log")

  return { success: true }
}

// USER PROFILE

export async function updateUserProfile(formData: FormData) {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const ageStr = formData.get("age") as string
  const age = ageStr ? Number.parseInt(ageStr) : undefined
  const gender = formData.get("gender") as string

  // Process health conditions as an array
  const healthConditions = formData.getAll("healthConditions") as string[]

  // Process psychiatric conditions as an array
  const psychiatricConditions = formData.getAll("psychiatricConditions") as string[]

  // Calculate risk multiplier based on profile data
  let riskMultiplier = 1.0

  // Age risk
  if (age !== undefined) {
    if ((age >= 18 && age <= 25) || age > 65) {
      riskMultiplier *= 1.3 // Age risk multiplier
    }
  }

  // Health conditions
  if (
    healthConditions.includes("cardiovascular") ||
    healthConditions.includes("liver") ||
    healthConditions.includes("kidney")
  ) {
    riskMultiplier *= 1.5 // Health condition risk multiplier
  }

  // Psychiatric conditions
  if (
    psychiatricConditions.includes("anxiety") ||
    psychiatricConditions.includes("depression") ||
    psychiatricConditions.includes("bipolar")
  ) {
    riskMultiplier *= 1.7 // Psychiatric condition risk multiplier
  }

  const { error } = await supabase
    .from("users")
    .update({
      username,
      email,
      age,
      gender,
      health_conditions: healthConditions,
      psychiatric_conditions: psychiatricConditions,
      risk_multiplier: riskMultiplier,
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }

  // Recalculate harm index after updating user profile
  await calculateAndStoreHarmIndex(userId)

  revalidatePath("/")
  revalidatePath("/profile")

  return { success: true }
}

// Calculate and store harm index
async function calculateAndStoreHarmIndex(userId: string) {
  const supabase = createServerComponentClient()
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  try {
    // Get substance logs
    const { data: substanceLogs } = await supabase
      .from("substance_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    // Get intervention logs
    const { data: interventionLogs } = await supabase
      .from("intervention_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    // Get sleep logs (as interventions)
    const { data: sleepLogs } = await supabase.from("sleep_logs").select("*").eq("user_id", userId)

    // Get exercise logs (as interventions)
    const { data: exerciseLogs } = await supabase.from("exercise_logs").select("*").eq("user_id", userId)

    // Get substance breaks (as interventions)
    const { data: substanceBreaks } = await supabase
      .from("substance_breaks")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")

    // Calculate total substance harm
    let substanceHarm = 0
    if (substanceLogs && substanceLogs.length > 0) {
      // Sum up harm points from all substance logs
      substanceLogs.forEach((log) => {
        // Apply decay based on time since use
        const logDate = new Date(log.date)
        const daysSinceUse = differenceInDays(today, logDate)

        // Calculate harm points if not present in the log
        // Get substance type and subtype
        const substanceType = log.substance_type
        const substanceSubtype = log.substance_subtype
        const quantity = Number.parseFloat(log.amount) || 1 // Use the actual amount value
        const context = log.context || "other"

        // Calculate harm points
        const harmPoints = calculateSubstanceHarmPoints(
          substanceType,
          substanceSubtype,
          quantity,
          context,
          1.0, // Default risk multiplier
          false, // Default for multiple substances
        )

        const halfLife = getSubstanceHalfLife(log.substance_type)
        const decayedHarm = calculateHarmDecay(harmPoints, halfLife, daysSinceUse)

        substanceHarm += decayedHarm
      })
    }

    // Calculate intervention reduction
    let interventionReduction = 0
    if (interventionLogs && interventionLogs.length > 0) {
      // Sum up reduction from recent interventions (last 7 days)
      const recentInterventions = interventionLogs.filter((log) => {
        const logDate = new Date(log.date)
        const daysSince = differenceInDays(today, logDate)
        return daysSince <= 7 // Only count interventions from the last week
      })

      recentInterventions.forEach((log) => {
        interventionReduction += log.harm_reduction || 0
      })
    }

    // Add sleep logs as interventions
    if (sleepLogs && sleepLogs.length > 0) {
      const recentSleepLogs = sleepLogs.filter((log) => {
        const logDate = new Date(log.date)
        const daysSince = differenceInDays(today, logDate)
        return daysSince <= 7
      })

      recentSleepLogs.forEach((log) => {
        // Good sleep quality reduces harm
        if (log.quality === "excellent" || log.quality === "good") {
          interventionReduction += 3 // Sleep intervention reduction
        } else if (log.quality === "fair") {
          interventionReduction += 1.5 // Partial benefit
        }
      })
    }

    // Add exercise logs as interventions
    if (exerciseLogs && exerciseLogs.length > 0) {
      const recentExerciseLogs = exerciseLogs.filter((log) => {
        const logDate = new Date(log.date)
        const daysSince = differenceInDays(today, logDate)
        return daysSince <= 7
      })

      recentExerciseLogs.forEach((log) => {
        if (log.duration >= 30) {
          interventionReduction += 2 // Exercise intervention reduction
        } else if (log.duration >= 15) {
          interventionReduction += 1 // Partial benefit
        }
      })
    }

    // Add substance breaks as interventions
    if (substanceBreaks && substanceBreaks.length > 0) {
      substanceBreaks.forEach((brk) => {
        const startDate = new Date(brk.start_date)
        const daysOfBreak = differenceInDays(today, startDate)
        if (daysOfBreak > 0) {
          // 4 points per day of abstinence, capped at 28 days (4 weeks)
          interventionReduction += Math.min(daysOfBreak, 28) * 4
        }
      })
    }

    // Calculate decay reduction (natural recovery over time)
    const decayReduction = 0 // Already factored into substance harm calculation

    // Calculate final harm index score (0-100, higher means more harm)
    // Start with substance harm, subtract interventions, ensure within 0-100 range
    const harmScore = Math.max(0, Math.min(100, substanceHarm - interventionReduction))

    // Store the calculated harm index
    // Check if we already have an entry for today
    const { data: existingIndex } = await supabase
      .from("harm_index")
      .select("id")
      .eq("user_id", userId)
      .eq("date", todayStr)
      .single()

    if (existingIndex) {
      // Update existing entry
      await supabase
        .from("harm_index")
        .update({
          score: harmScore,
          substance_harm: substanceHarm,
          intervention_reduction: interventionReduction,
          decay_reduction: decayReduction,
          factors: {
            substance_logs: substanceLogs?.length || 0,
            intervention_logs: interventionLogs?.length || 0,
            sleep_logs: sleepLogs?.length || 0,
            exercise_logs: exerciseLogs?.length || 0,
            substance_breaks: substanceBreaks?.length || 0,
          },
        })
        .eq("id", existingIndex.id)
    } else {
      // Create new entry
      await supabase.from("harm_index").insert({
        user_id: userId,
        date: todayStr,
        score: harmScore,
        substance_harm: substanceHarm,
        intervention_reduction: interventionReduction,
        decay_reduction: decayReduction,
        factors: {
          substance_logs: substanceLogs?.length || 0,
          intervention_logs: interventionLogs?.length || 0,
          sleep_logs: sleepLogs?.length || 0,
          exercise_logs: exerciseLogs?.length || 0,
          substance_breaks: substanceBreaks?.length || 0,
        },
      })
    }

    return harmScore
  } catch (error) {
    console.error("Error calculating harm index:", error)
    throw new Error("Failed to calculate harm index")
  }
}

export async function getHarmIndexHistory() {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  const { data, error } = await supabase
    .from("harm_index")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching harm index history:", error)
    throw new Error("Failed to fetch harm index history")
  }

  return data as HarmIndex[]
}

export async function getCurrentHarmIndex() {
  const supabase = createServerComponentClient()
  const userId = await getTemporaryUserId()

  // Get the most recent harm index
  const { data, error } = await supabase
    .from("harm_index")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No records found, calculate a new one
      const score = await calculateAndStoreHarmIndex(userId)
      return {
        score,
        substance_harm: score,
        intervention_reduction: 0,
        decay_reduction: 0,
      }
    }

    console.error("Error fetching current harm index:", error)
    throw new Error("Failed to fetch current harm index")
  }

  return data as HarmIndex
}

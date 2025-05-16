"use server"

import { createServerComponentClient } from "@/lib/supabase"
import type { HarmIndex } from "@/lib/database-types"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"
import { differenceInDays } from "date-fns"

// Update the getHarmIndexHistory function to handle unauthenticated users
export async function getHarmIndexHistory() {
  const supabase = createServerComponentClient()

  try {
    const user = await getCurrentUser()

    // If no user is authenticated, return empty array
    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from("harm_index")
      .select("*")
      .eq("user_id", user.user_id)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching harm index history:", error)
      return [] // Return empty array instead of throwing
    }

    return data as HarmIndex[]
  } catch (error) {
    console.error("Error in getHarmIndexHistory:", error)
    return [] // Return empty array for any errors
  }
}

// Update the getCurrentHarmIndex function to handle unauthenticated users
export async function getCurrentHarmIndex() {
  const supabase = createServerComponentClient()

  try {
    const user = await getCurrentUser()

    // If no user is authenticated, return default values
    if (!user) {
      return {
        score: 0,
        substance_harm: 0,
        intervention_reduction: 0,
        decay_reduction: 0,
      }
    }

    // Get the most recent harm index
    const { data, error } = await supabase
      .from("harm_index")
      .select("*")
      .eq("user_id", user.user_id)
      .order("date", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No records found, calculate a new one
        try {
          const score = await calculateAndStoreHarmIndex(user.user_id)
          return {
            score,
            substance_harm: score,
            intervention_reduction: 0,
            decay_reduction: 0,
          }
        } catch (calcError) {
          console.error("Error calculating harm index:", calcError)
          return {
            score: 0,
            substance_harm: 0,
            intervention_reduction: 0,
            decay_reduction: 0,
          }
        }
      }

      console.error("Error fetching current harm index:", error)
      return {
        score: 0,
        substance_harm: 0,
        intervention_reduction: 0,
        decay_reduction: 0,
      }
    }

    return data as HarmIndex
  } catch (error) {
    console.error("Error in getCurrentHarmIndex:", error)
    return {
      score: 0,
      substance_harm: 0,
      intervention_reduction: 0,
      decay_reduction: 0,
    }
  }
}

// Calculate and store harm index
export async function calculateAndStoreHarmIndex(userId: string) {
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

    // Calculate total substance harm (simplified for now)
    let substanceHarm = 0
    if (substanceLogs && substanceLogs.length > 0) {
      // Sum up harm points from all substance logs
      substanceLogs.forEach((log) => {
        // Apply decay based on time since use
        const logDate = new Date(log.date)
        const daysSinceUse = differenceInDays(today, logDate)

        // Simple decay formula: harm decreases by 10% per day
        const decayFactor = Math.pow(0.9, daysSinceUse)
        substanceHarm += (log.harm_points || 1) * decayFactor
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
        interventionReduction += log.harm_reduction || 0
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
        interventionReduction += log.harm_reduction || 0
      })
    }

    // Add substance breaks as interventions
    if (substanceBreaks && substanceBreaks.length > 0) {
      substanceBreaks.forEach((brk) => {
        interventionReduction += brk.harm_reduction || 0
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

    revalidatePath("/")
    revalidatePath("/insights")

    return harmScore
  } catch (error) {
    console.error("Error calculating harm index:", error)
    throw new Error("Failed to calculate harm index")
  }
}

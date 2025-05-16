import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"

export type LogEntry = {
  id: string // uuid
  type: "substance" | "intervention"
  name: string
  value?: number // optional dosage / intensity
  createdAt: string // ISO timestamp
  // Additional fields for backward compatibility
  context?: string
  notes?: string
  harm_points?: number
}

interface LogsState {
  logs: LogEntry[]
  add(entry: Omit<LogEntry, "id" | "createdAt">): void
  hydrate(): void // load from storage on app start
}

// Helper function to migrate legacy data
const migrateLegacyData = () => {
  const logs: LogEntry[] = []

  // Migrate substance logs
  try {
    const substanceLogsRaw = localStorage.getItem("standalone_substance_logs")
    if (substanceLogsRaw) {
      const substanceLogs = JSON.parse(substanceLogsRaw)
      substanceLogs.forEach((log: any) => {
        logs.push({
          id: log.id || uuidv4(),
          type: "substance",
          name: log.substance_type,
          value: Number.parseFloat(log.amount) || 1,
          createdAt: log.date || new Date().toISOString(),
          context: log.context,
          notes: log.notes,
          harm_points: log.harm_points,
        })
      })
    }
  } catch (error) {
    console.error("Error migrating substance logs:", error)
  }

  // Migrate intervention logs (if they exist)
  try {
    const interventionLogsRaw = localStorage.getItem("standalone_intervention_logs")
    if (interventionLogsRaw) {
      const interventionLogs = JSON.parse(interventionLogsRaw)
      interventionLogs.forEach((log: any) => {
        logs.push({
          id: log.id || uuidv4(),
          type: "intervention",
          name: log.intervention_type,
          value: log.duration || 1,
          createdAt: log.date || new Date().toISOString(),
          notes: log.notes,
        })
      })
    }
  } catch (error) {
    console.error("Error migrating intervention logs:", error)
  }

  return logs
}

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  add: (partial) => {
    set((state) => {
      const entry = {
        ...partial,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      }
      const updated = [...state.logs, entry]

      // Save to localStorage
      localStorage.setItem("nbd-logs", JSON.stringify(updated))

      // For backward compatibility, also update the legacy storage
      if (entry.type === "substance") {
        try {
          const existingLogs = JSON.parse(localStorage.getItem("standalone_substance_logs") || "[]")
          const newLog = {
            id: entry.id,
            substance_type: entry.name,
            substance_subtype: "",
            amount: entry.value?.toString() || "1",
            date: entry.createdAt,
            context: entry.context || "social",
            supplements: [],
            notes: entry.notes || "",
            harm_points: entry.harm_points || 3,
          }
          localStorage.setItem("standalone_substance_logs", JSON.stringify([...existingLogs, newLog]))

          // Dispatch events for legacy components
          window.dispatchEvent(new CustomEvent("substance-log-added", { detail: newLog }))
          window.dispatchEvent(new Event("substance-logs-updated"))
        } catch (error) {
          console.error("Error updating legacy substance logs:", error)
        }
      } else if (entry.type === "intervention") {
        try {
          const existingLogs = JSON.parse(localStorage.getItem("standalone_intervention_logs") || "[]")
          const newLog = {
            id: entry.id,
            intervention_type: entry.name,
            duration: entry.value || 1,
            date: entry.createdAt,
            notes: entry.notes || "",
          }
          localStorage.setItem("standalone_intervention_logs", JSON.stringify([...existingLogs, newLog]))

          // Dispatch events for legacy components
          window.dispatchEvent(new CustomEvent("intervention-log-added", { detail: newLog }))
          window.dispatchEvent(new Event("intervention-logs-updated"))
        } catch (error) {
          console.error("Error updating legacy intervention logs:", error)
        }
      }

      return { logs: updated }
    })

    // Future Supabase integration
    // syncToSupabase(logs)
  },
  hydrate: () => {
    try {
      // First try to load from the new format
      const raw = localStorage.getItem("nbd-logs")
      if (raw) {
        set({ logs: JSON.parse(raw) })
      } else {
        // If not found, migrate from legacy data
        const migratedLogs = migrateLegacyData()
        set({ logs: migratedLogs })

        // Save the migrated data in the new format
        if (migratedLogs.length > 0) {
          localStorage.setItem("nbd-logs", JSON.stringify(migratedLogs))
        }
      }
    } catch (error) {
      console.error("Error hydrating logs store:", error)
      set({ logs: [] })
    }
  },
}))

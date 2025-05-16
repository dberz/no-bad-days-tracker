"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { CalendarRange } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { subMonths, isSameDay, isAfter } from "date-fns"
import { Progress } from "@/components/ui/progress"

interface HarmIndexCardProps {
  className?: string
}

export function HarmIndexCard({ className }: HarmIndexCardProps) {
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [previousScore, setPreviousScore] = useState<number | null>(null)
  const [percentChange, setPercentChange] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState("3m")
  const [harmIndexData, setHarmIndexData] = useState<any[]>([])
  const [substanceLogs, setSubstanceLogs] = useState<any[]>([])
  const [substanceHarm, setSubstanceHarm] = useState(0)
  const [interventionReduction, setInterventionReduction] = useState(0)
  const [decayReduction, setDecayReduction] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [localLogs, setLocalLogs] = useState<any[]>([])
  const [activeUserId, setActiveUserId] = useState<string>("")
  const [harmScore, setHarmScore] = useState(0)

  // Load harm index data from localStorage
  useEffect(() => {
    const loadHarmIndex = () => {
      try {
        // Calculate harm score from substance logs
        const storedLogs = localStorage.getItem("standalone_substance_logs")
        if (storedLogs) {
          const logs = JSON.parse(storedLogs)
          const totalHarm = logs.reduce((sum: number, log: any) => sum + (log.harm_points || 0), 0)

          // Cap at 100 for the progress bar
          const cappedScore = Math.min(totalHarm, 100)

          setHarmScore(cappedScore)
          setSubstanceHarm(totalHarm)

          // For now, intervention reduction is 0 since we're not tracking interventions in localStorage
          setInterventionReduction(0)
        }
      } catch (error) {
        console.error("Error loading harm index:", error)
      }
    }

    // Load data initially
    loadHarmIndex()

    // Set up event listener for updates
    const handleLogsUpdated = () => {
      loadHarmIndex()
    }

    window.addEventListener("substance-logs-updated", handleLogsUpdated)
    window.addEventListener("substance-log-added", handleLogsUpdated)

    return () => {
      window.removeEventListener("substance-logs-updated", handleLogsUpdated)
      window.removeEventListener("substance-log-added", handleLogsUpdated)
    }
  }, [])

  // Get risk level based on harm score
  const getRiskLevel = (score: number) => {
    if (score < 20) return { level: "Low", color: "bg-green-500" }
    if (score < 40) return { level: "Moderate", color: "bg-yellow-500" }
    if (score < 60) return { level: "Elevated", color: "bg-orange-500" }
    if (score < 80) return { level: "High", color: "bg-red-500" }
    return { level: "Severe", color: "bg-red-700" }
  }

  const risk = getRiskLevel(harmScore)

  useEffect(() => {
    // Get the active user ID from localStorage
    const userId = localStorage.getItem("active_test_user") || ""
    setActiveUserId(userId)

    // Listen for user changes
    const handleUserChange = (event: CustomEvent) => {
      setActiveUserId(event.detail.userId)
    }

    window.addEventListener("test-user-changed", handleUserChange as EventListener)

    return () => {
      window.removeEventListener("test-user-changed", handleUserChange as EventListener)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Get local logs from localStorage for the active user
        let localStorageLogs: any[] = []
        try {
          const storageKey = activeUserId ? `standalone_substance_logs_${activeUserId}` : "standalone_substance_logs"

          const logsString = localStorage.getItem(storageKey)
          if (logsString) {
            localStorageLogs = JSON.parse(logsString)
            console.log(`Found logs for user ${activeUserId}:`, localStorageLogs.length)
          }
        } catch (e) {
          console.error("Error parsing localStorage logs:", e)
        }

        // Only set localLogs if they've changed to prevent unnecessary re-renders
        if (JSON.stringify(localLogs) !== JSON.stringify(localStorageLogs)) {
          setLocalLogs(localStorageLogs)
        }

        // Filter logs based on selected time range
        const now = new Date()
        let startDate: Date

        switch (timeRange) {
          case "1m":
            startDate = subMonths(now, 1)
            break
          case "3m":
            startDate = subMonths(now, 3)
            break
          case "6m":
            startDate = subMonths(now, 6)
            break
          case "1y":
            startDate = subMonths(now, 12)
            break
          default:
            startDate = subMonths(now, 3)
        }

        // Filter logs by date range
        const filteredLogs = localStorageLogs.filter((log) => {
          const logDate = new Date(log.date)
          return isAfter(logDate, startDate) || isSameDay(logDate, startDate)
        })

        // Calculate a simple harm score based on filtered logs
        if (filteredLogs.length > 0) {
          // Simple calculation: each log contributes to harm
          const totalHarm = filteredLogs.reduce((total, log) => {
            // Base harm points by substance type
            let baseHarm = 0
            switch (log.substance_type.toLowerCase()) {
              case "alcohol":
                baseHarm = 3 // Higher harm for alcohol
                break
              case "cannabis":
                baseHarm = log.substance_subtype === "edible" ? 1 : 1.5 // Different for edibles
                break
              case "mdma":
                baseHarm = 4 // Higher harm
                break
              case "psychedelics":
                baseHarm = 2 // Medium harm
                break
              default:
                baseHarm = 2 // Default harm value
            }

            // Multiply by quantity
            const quantity = Number.parseFloat(log.amount) || 1
            baseHarm *= quantity

            // Apply decay based on time since use
            const logDate = new Date(log.date)
            const daysSince = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

            // Simple decay formula: harm decreases by 10% per day
            const decayFactor = Math.pow(0.9, daysSince)

            return total + baseHarm * decayFactor
          }, 0)

          setScore(Math.min(Math.round(totalHarm), 100))
          setSubstanceHarm(totalHarm)

          // Create a simple harm index history from local logs
          const fakeHistory = [
            {
              id: "local-1",
              date: now.toISOString().split("T")[0],
              score: totalHarm,
              substance_harm: totalHarm,
              intervention_reduction: 0,
              decay_reduction: 0,
            },
          ]

          setHarmIndexData(fakeHistory)
          setSubstanceLogs(filteredLogs)

          // Set a fake previous score to show trend
          setPreviousScore(totalHarm * 1.1) // Assume 10% improvement
          setPercentChange(-10)
        } else {
          // No logs in the selected time range
          setScore(0)
          setSubstanceHarm(0)
          setHarmIndexData([])
          setSubstanceLogs([])
          setPreviousScore(null)
          setPercentChange(null)
        }
      } catch (error) {
        console.error("Error fetching harm index data:", error)
        setError("Failed to load harm index data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Add event listener for custom event rather than polling
    const handleLogAdded = () => {
      fetchData()
    }

    window.addEventListener("substance-log-added", handleLogAdded)
    window.addEventListener("storage", handleLogAdded)

    return () => {
      window.removeEventListener("substance-log-added", handleLogAdded)
      window.removeEventListener("storage", handleLogAdded)
    }
  }, [timeRange, activeUserId, localLogs])

  return (
    <Card className={cn("rounded-2xl overflow-hidden shadow-md w-full", className)}>
      <CardHeader className="bg-gradient-to-r from-amber-200/50 to-amber-100/30 py-3 px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-800">All-Time Usage Summary</CardTitle>
            <CardDescription className="text-gray-700">Total impact of your substance use</CardDescription>
          </div>
          <div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px] rounded-full flex items-center gap-2 bg-white/80 border-none shadow-sm">
                <CalendarRange className="h-4 w-4 text-gray-600" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">{harmScore.toFixed(1)}</span>
          </div>

          <Progress value={harmScore} className="h-2" />

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span>Substance Harm</span>
              <span className="font-medium text-orange-500">+{substanceHarm.toFixed(1)}</span>
            </div>
            {interventionReduction > 0 && (
              <div className="flex justify-between text-sm">
                <span>Intervention Reduction</span>
                <span className="font-medium text-green-500">-{interventionReduction.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

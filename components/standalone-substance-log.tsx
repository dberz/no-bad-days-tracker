"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubstanceLogDialog } from "./substance-log-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getSubstanceIcon } from "./substance-icons"
import { format } from "date-fns"

// Define the substance log type
interface StandaloneSubstanceLog {
  id: string
  substance_type: string
  substance_subtype: string | null
  amount: string
  date: string
  context: string
  supplements: string[] | null
  notes: string | null
  feeling_during: number | null
  feeling_after: number | null
  notes_during: string | null
  notes_after: string | null
  harm_points: number
}

export function StandaloneSubstanceLog() {
  const [logs, setLogs] = useState<StandaloneSubstanceLog[]>([])
  const [totalHarmPoints, setTotalHarmPoints] = useState(0)

  // Load logs from localStorage
  useEffect(() => {
    const loadLogs = () => {
      try {
        const storedLogs = localStorage.getItem("standalone_substance_logs")
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs) as StandaloneSubstanceLog[]
          setLogs(parsedLogs)

          // Calculate total harm points
          const total = parsedLogs.reduce((sum, log) => sum + (log.harm_points || 0), 0)
          setTotalHarmPoints(total)
        }
      } catch (error) {
        console.error("Error loading substance logs:", error)
      }
    }

    // Load logs initially
    loadLogs()

    // Set up event listener for updates
    const handleLogsUpdated = () => {
      loadLogs()
    }

    window.addEventListener("substance-logs-updated", handleLogsUpdated)
    window.addEventListener("substance-log-added", handleLogsUpdated)

    return () => {
      window.removeEventListener("substance-logs-updated", handleLogsUpdated)
      window.removeEventListener("substance-log-added", handleLogsUpdated)
    }
  }, [])

  // Format date for display
  const formatLogDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "MMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Substance Logs</CardTitle>
            <CardDescription>Track your substance use</CardDescription>
          </div>
          <SubstanceLogDialog
            trigger={
              <Button size="sm" className="rounded-full bg-logButton text-black hover:bg-logButton/80">
                <PlusCircle className="h-4 w-4 mr-1" />
                Log Usage
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No substance logs yet</p>
            <SubstanceLogDialog
              trigger={
                <Button className="bg-logButton text-black hover:bg-logButton/80">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Your First Log
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">Total Harm Points</span>
              <span className="font-bold text-orange-500">{totalHarmPoints.toFixed(1)}</span>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {getSubstanceIcon(log.substance_type, "h-4 w-4")}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {log.substance_type.charAt(0).toUpperCase() + log.substance_type.slice(1)}
                        {log.substance_subtype ? ` - ${log.substance_subtype}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatLogDate(log.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {log.amount} {log.substance_type === "cannabis" && log.substance_subtype === "edible" ? "mg" : ""}
                    </p>
                    <p className="text-xs text-orange-500">+{log.harm_points.toFixed(1)} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

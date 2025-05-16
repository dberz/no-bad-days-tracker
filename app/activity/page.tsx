"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatLogDate } from "@/lib/utils"
import { getSubstanceIcon } from "@/components/substance-icons"
import { SubstanceLogButton } from "@/components/substance-log-button"
import { PlusCircle, Heart } from "lucide-react"
import { useLogsStore, type LogEntry } from "@/lib/store/useLogsStore"
import { useEffect } from "react"

export default function ActivityPage() {
  // Ensure store is hydrated
  useEffect(() => {
    useLogsStore.getState().hydrate()
  }, [])

  // Get all logs from the store
  const logs = useLogsStore((state) => state.logs)

  // Group logs by month and year
  const groupedLogs = groupLogsByMonthYear(logs)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Activity History</h2>
          <SubstanceLogButton className="rounded-full bg-logButton text-black hover:bg-logButton/80">
            <PlusCircle className="h-4 w-4 mr-1" />
            Log New Activity
          </SubstanceLogButton>
        </div>
        <p className="text-muted-foreground">View and manage your complete substance and intervention history.</p>

        <Card>
          <CardHeader>
            <CardTitle>All Activity</CardTitle>
            <CardDescription>Your complete activity log history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-2">
                  <p className="text-muted-foreground">No activity logs yet</p>
                  <p className="text-sm text-muted-foreground">Use the + button to add your first entry</p>
                </div>
              ) : (
                <>
                  {groupedLogs.map(([monthYear, monthLogs]) => (
                    <div key={monthYear} className="space-y-4">
                      <h3 className="sticky top-0 bg-background py-2 text-lg font-semibold border-b z-10">
                        {monthYear}
                      </h3>
                      <div className="space-y-4">
                        {monthLogs.map((log) => (
                          <ActivityLogItem key={log.id} log={log} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper component to render a single log item
function ActivityLogItem({ log }: { log: LogEntry }) {
  return (
    <div className="flex items-center space-x-4 rounded-xl border p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        {log.type === "substance" ? (
          getSubstanceIcon(log.name, "h-5 w-5")
        ) : (
          <Heart className="h-5 w-5 text-green-500" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          {log.type === "substance"
            ? `${log.name}${log.details?.substance_subtype ? ` - ${log.details.substance_subtype}` : ""}`
            : `${log.name} Intervention`}
        </p>
        <p className="text-sm text-muted-foreground">
          {log.type === "substance"
            ? `${log.value || 1} ${log.details?.unit || "units"}`
            : `Duration: ${log.value || ""} ${log.details?.unit || ""}`}
        </p>
        {log.details?.context && <p className="text-xs text-muted-foreground">Context: {log.details.context}</p>}
      </div>
      <div className="text-right">
        <div className="text-sm text-muted-foreground">{formatLogDate(log.createdAt)}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {log.type === "substance"
            ? `Harm: ${log.details?.harm_points?.toFixed(1) || "0.0"}`
            : `Reduction: ${log.details?.harm_reduction?.toFixed(1) || "0.0"}`}
        </div>
      </div>
    </div>
  )
}

// Helper function to group logs by month and year
function groupLogsByMonthYear(logs: LogEntry[]): [string, LogEntry[]][] {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const groups = logs.reduce(
    (groups, log) => {
      const date = new Date(log.createdAt)
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`

      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(log)
      return groups
    },
    {} as Record<string, LogEntry[]>,
  )

  // Sort logs within each month (newest first)
  Object.keys(groups).forEach((monthYear) => {
    groups[monthYear].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  // Sort month-year groups (newest first)
  return Object.entries(groups).sort((a, b) => {
    const [monthA, yearA] = a[0].split(" ").reverse()
    const [monthB, yearB] = b[0].split(" ").reverse()

    if (yearA !== yearB) {
      return Number.parseInt(yearB) - Number.parseInt(yearA)
    }

    const monthIndexA = months.indexOf(monthA)
    const monthIndexB = months.indexOf(monthB)
    return monthIndexB - monthIndexA
  })
}

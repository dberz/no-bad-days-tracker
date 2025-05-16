"use client"

import { useEffect, useState } from "react"
import { formatLogDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useLogsStore, type LogEntry } from "@/lib/store/useLogsStore"
import { SubstanceIcon } from "@/components/substance-icons" // Updated import
import { memo } from "react"

export function RecentActivityCard({ className, userId }) {
  const logs = useLogsStore((state) => state.logs)
  const [hasLogs, setHasLogs] = useState(logs.length > 0)

  // Update hasLogs whenever logs change
  useEffect(() => {
    setHasLogs(logs.length > 0)
  }, [logs])

  // Get the most recent logs (both substances and interventions)
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <CardDescription>Your recent substance and intervention logs</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasLogs ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <p className="text-muted-foreground">No activity logs yet</p>
            <p className="text-sm text-muted-foreground">Use the + button to add your first entry</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full rounded-xl" asChild>
          <Link href="/activity">View All Activity</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Memoized helper component to render a single log item
const ActivityLogItem = memo(({ log }: { log: LogEntry }) => {
  // Get the icon name from the log details or use a default based on the type
  const iconName = log.details?.icon || (log.type === "substance" ? log.name : "Heart")

  return (
    <div className="flex items-center space-x-4 rounded-xl border p-4 transition-all hover:shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <SubstanceIcon name={iconName} className="h-5 w-5" />
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
})
ActivityLogItem.displayName = "ActivityLogItem"

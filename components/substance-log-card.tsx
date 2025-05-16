"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatLogDate } from "@/lib/utils"
import { LogUsageButton } from "./log-usage-button"

interface SubstanceLogCardProps {
  className?: string
}

export function SubstanceLogCard({ className }: SubstanceLogCardProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load logs from localStorage on component mount and whenever the component renders
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const localLogsString = localStorage.getItem("substanceLogs")
        if (localLogsString) {
          const localLogs = JSON.parse(localLogsString)
          setLogs(localLogs)
        } else {
          setLogs([])
        }
      }
    } catch (error) {
      console.error("Error loading logs from localStorage:", error)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Substance Log</CardTitle>
          <CardDescription>Track your substance usage</CardDescription>
        </div>
        <LogUsageButton />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <p className="text-muted-foreground">No substance logs yet</p>
            <p className="text-sm text-muted-foreground">Click "Log Usage" to add your first entry</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center space-x-4 rounded-xl border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{log.substance_type}</p>
                  <p className="text-sm text-muted-foreground">{log.amount}</p>
                </div>
                <div className="text-sm text-muted-foreground">{formatLogDate(log.date)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full rounded-full" asChild>
          <a href="/log">View All Logs</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

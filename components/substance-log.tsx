import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { SubstanceIcon } from "./substance-icons"

interface SubstanceLogEntry {
  id: string
  substance_type: string
  substance_subtype: string | null
  amount: string
  date: string
  harm_points: number
}

export function SubstanceLog({ className }: { className?: string }) {
  const logs = useMemo(() => {
    try {
      const storedLogs = localStorage.getItem("standalone_substance_logs")
      if (!storedLogs) return []

      const allLogs = JSON.parse(storedLogs) as SubstanceLogEntry[]
      return allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error("Error loading substance logs:", error)
      return []
    }
  }, [])

  if (logs.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Substance Logs</CardTitle>
        <CardDescription>Individual substance use entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="mt-1">
                <SubstanceIcon name={log.substance_type} className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium capitalize truncate">
                    {log.substance_type}
                    {log.substance_subtype && ` (${log.substance_subtype})`}
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {log.amount} {log.substance_subtype || "units"}
                  </p>
                  <span className="text-xs text-red-500 font-medium">+{log.harm_points.toFixed(1)} points</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
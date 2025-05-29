import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { SubstanceIcon } from "./substance-icons"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useModal } from "@/contexts/modal-context"

interface SubstanceLogEntry {
  id: string
  substance_type: string
  substance_subtype: string | null
  amount: string
  date: string
  harm_points: number
  user_id?: string
}

export function SubstanceLog({ className }: { className?: string }) {
  const { open: modalOpen } = useModal()
  const [testUserId, setTestUserId] = useState<string | null>(null)
  const [logsState, setLogsState] = useState<SubstanceLogEntry[]>([])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTestUserId(localStorage.getItem('test_user_id'))
    }
  }, [])

  const logs = useMemo(() => {
    try {
      const storedLogs = localStorage.getItem("standalone_substance_logs")
      if (!storedLogs) return []
      let allLogs = JSON.parse(storedLogs) as SubstanceLogEntry[]
      // Filter logs for current test user
      if (testUserId) {
        allLogs = allLogs.filter(log => log.user_id === testUserId)
      }
      setLogsState(allLogs)
      return allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error("Error loading substance logs:", error)
      return []
    }
  }, [testUserId])

  // Delete log handler
  const handleDelete = (id: string) => {
    const updatedLogs = logsState.filter(log => log.id !== id)
    localStorage.setItem("standalone_substance_logs", JSON.stringify(updatedLogs))
    setLogsState(updatedLogs)
    window.dispatchEvent(new CustomEvent("substance-logs-updated"))
  }

  // Edit log handler (placeholder)
  const handleEdit = (id: string) => {
    alert("Edit functionality coming soon!")
  }

  if (logs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Substance Logs</CardTitle>
          <CardDescription>Track your substance use and its impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <div className="p-3 rounded-full bg-muted">
              <SubstanceIcon name="pill" className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No Substance Logs Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start tracking your substance use to see your patterns and make informed decisions about your health.
              </p>
            </div>
            <Button onClick={() => modalOpen("substance")} className="bg-red-500 hover:bg-red-600 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Log Your First Substance
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
              className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors group relative"
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
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" aria-label="Edit log" onClick={() => handleEdit(log.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete log" onClick={() => handleDelete(log.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
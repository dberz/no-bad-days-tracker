"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { format } from "date-fns"
import { getSubstanceLogs } from "@/app/actions/substance-log-actions"
import type { SubstanceLog } from "@/lib/database-types"
import { getSubstanceIcon } from "@/components/substance-icons"
import { SubstanceLogDialog } from "@/components/substance-log-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

export default function LogPage() {
  const [logs, setLogs] = useState<SubstanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getSubstanceLogs()
        setLogs(data)
      } catch (error) {
        console.error("Error fetching logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  // Filter logs based on selected time period
  const filteredLogs = logs.filter((log) => {
    if (timeFilter === "all") return true

    const logDate = new Date(log.date)
    const now = new Date()

    if (timeFilter === "last-week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(now.getDate() - 7)
      return logDate >= oneWeekAgo
    }

    if (timeFilter === "last-month") {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return logDate >= oneMonthAgo
    }

    if (timeFilter === "last-3-months") {
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(now.getMonth() - 3)
      return logDate >= threeMonthsAgo
    }

    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="py-6 w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Substance Logs</h1>
              <p className="text-muted-foreground">
                Track your substance use to get personalized insights and recommendations.
              </p>
            </div>

            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="new-log">New Log</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="new-log">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Log Details</CardTitle>
                    <CardDescription>
                      Record what you used, how much, and when. All data is private and secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-10">
                    <SubstanceLogDialog
                      trigger={
                        <Button size="lg" className="rounded-full bg-logButton text-black hover:bg-logButton/80">
                          <PlusCircle className="h-5 w-5 mr-2" />
                          Log Usage
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Log History</h2>
                  <div>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-[180px] rounded-full">
                        <SelectValue placeholder="Filter by time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">Loading logs...</p>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <p className="text-muted-foreground text-xl">No substance logs yet</p>
                    <p className="text-muted-foreground mb-4">Use the button below to add your first entry</p>
                    <SubstanceLogDialog
                      trigger={
                        <Button className="bg-logButton text-black hover:bg-logButton/80">Add Your First Log</Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Group logs by date */}
                    {groupLogsByDate(filteredLogs).map(([date, dateGroup]) => (
                      <div key={date} className="mb-8">
                        <h3 className="text-lg font-medium mb-3">{formatDate(date)}</h3>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                          {dateGroup.map((log) => (
                            <div key={log.id} className="rounded-md border p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center space-x-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  {getSubstanceIcon(log.substance_type, "h-5 w-5")}
                                </div>
                                <div className="flex-grow">
                                  <p className="font-medium">
                                    {formatSubstanceType(log.substance_type, log.substance_subtype)}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">{log.amount}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(new Date(log.date), "h:mm a")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {(log.context || log.supplements?.length || log.notes) && (
                                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                                  {log.context && (
                                    <p>
                                      <span className="font-medium">Context:</span> {formatContext(log.context)}
                                    </p>
                                  )}
                                  {log.supplements?.length > 0 && (
                                    <p>
                                      <span className="font-medium">Supplements:</span> {log.supplements.join(", ")}
                                    </p>
                                  )}
                                  {log.notes && (
                                    <p>
                                      <span className="font-medium">Notes:</span> {log.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper function to group logs by date
function groupLogsByDate(logs: SubstanceLog[]): [string, SubstanceLog[]][] {
  const groups = logs.reduce(
    (groups, log) => {
      const date = new Date(log.date).toISOString().split("T")[0]
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(log)
      return groups
    },
    {} as Record<string, SubstanceLog[]>,
  )

  // Sort by date (newest first) and convert to array
  return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
}

// Helper function to format date headers
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return format(date, "EEEE, MMMM d, yyyy")
  }
}

// Helper function to format substance type for display
function formatSubstanceType(type: string, subtype?: string): string {
  if (!type) return "Unknown"

  const formattedType = type.charAt(0).toUpperCase() + type.slice(1)

  if (subtype) {
    return `${formattedType} - ${subtype}`
  }

  return formattedType
}

// Helper function to format context for display
function formatContext(context: string): string {
  if (!context) return "Not specified"

  const contextMap: Record<string, string> = {
    "social-small": "Small Social Gathering",
    "social-party": "Party / Large Event",
    solo: "Solo / Alone",
    therapeutic: "Therapeutic / Medical",
    work: "Work Related",
  }

  return contextMap[context] || context
}

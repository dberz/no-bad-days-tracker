"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Dot } from "recharts"
import { getSubstanceIcon } from "./substance-icons"
import { useModal } from "@/contexts/modal-context"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the substance log type
interface SubstanceLog {
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

// Define the chart data type
interface ChartData {
  date: string
  harmScore: number
  substance?: string
  subtype?: string
  restorationActive?: boolean
  isExample?: boolean
}

interface HarmScoreChartProps {
  className?: string
}

// Custom dot component for the chart
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props

  // First check if payload exists
  if (!payload) {
    return <Dot {...props} />
  }

  // Then check if substance exists
  if (!payload.substance) {
    return <Dot {...props} />
  }

  // Use a different style for example data
  const isExample = payload.isExample
  const fillColor = isExample ? "#e5e5e5" : "#fff"
  const strokeColor = isExample ? "#aaa" : "#ff6b00"
  const opacity = isExample ? 0.7 : 1

  return (
    <g transform={`translate(${cx},${cy})`} opacity={opacity}>
      <circle r={6} fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <foreignObject width="16" height="16" x="-8" y="-8">
        <div className="flex items-center justify-center w-full h-full">{getSubstanceIcon(payload.substance)}</div>
      </foreignObject>
    </g>
  )
}

// Update the getExampleChartData function to provide better example data
const getExampleChartData = () => {
  const today = new Date()
  const data: ChartData[] = []
  let cumulativeScore = 0

  // Start 14 days ago
  for (let i = 14; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    // Add some example substance use events
    if (i === 12) {
      cumulativeScore += 6 // 2 beers
      data.push({
        date: dateStr,
        harmScore: cumulativeScore,
        substance: "alcohol",
        subtype: "beer",
        isExample: true,
      })
    } else if (i === 8) {
      cumulativeScore += 9 // 3 glasses of wine
      data.push({
        date: dateStr,
        harmScore: cumulativeScore,
        substance: "alcohol",
        subtype: "wine",
        isExample: true,
      })
    } else if (i === 4) {
      cumulativeScore += 3 // 1 beer
      data.push({
        date: dateStr,
        harmScore: cumulativeScore,
        substance: "alcohol",
        subtype: "beer",
        isExample: true,
      })
    } else if (i === 2) {
      cumulativeScore += 1 // 2 puffs of cannabis
      data.push({
        date: dateStr,
        harmScore: cumulativeScore,
        substance: "cannabis",
        subtype: "smoked",
        isExample: true,
      })
    } else {
      // Decay on days without substance use
      cumulativeScore = Math.max(0, cumulativeScore * 0.9)
      data.push({
        date: dateStr,
        harmScore: cumulativeScore,
        restorationActive: true,
        isExample: true,
      })
    }
  }

  return data
}

export function HarmScoreChart({ className }: HarmScoreChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [currentScore, setCurrentScore] = useState(0)
  const [allTimeScore, setAllTimeScore] = useState(0)
  const { open } = useModal()

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score < 30) return "text-green-500 bg-green-50 border-green-200"
    if (score < 70) return "text-yellow-500 bg-yellow-50 border-yellow-200"
    return "text-red-500 bg-red-50 border-red-200"
  }

  // Load logs from localStorage and prepare chart data
  const loadData = useCallback(() => {
    try {
      console.log("Loading chart data...")
      const storedLogs = localStorage.getItem("standalone_substance_logs")
      if (storedLogs) {
        console.log("Found logs:", storedLogs)
        const logs = JSON.parse(storedLogs) as SubstanceLog[]

        // Sort logs by date
        logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Create chart data with substance info and restoration periods
        const data: ChartData[] = []
        let cumulativeScore = 0
        let totalHarmPoints = 0

        logs.forEach((log, index) => {
          const date = new Date(log.date).toISOString().split("T")[0]
          const harmPoints = log.harm_points || 0
          cumulativeScore += harmPoints
          totalHarmPoints += harmPoints

          console.log(`Log ${index}: ${log.substance_type}, harm points: ${harmPoints.toFixed(2)}`)

          // Add data point for substance use
          data.push({
            date,
            harmScore: Number.parseFloat(cumulativeScore.toFixed(2)),
            substance: log.substance_type,
            subtype: log.substance_subtype || undefined,
            restorationActive: false,
          })

          // Add restoration period (3 days after substance use)
          const restorationDays = 3
          for (let i = 1; i <= restorationDays; i++) {
            const restorationDate = new Date(log.date)
            restorationDate.setDate(restorationDate.getDate() + i)
            const restorationDateStr = restorationDate.toISOString().split("T")[0]

            // Reduce harm score by 10% each day during restoration
            cumulativeScore = Math.max(0, cumulativeScore - harmPoints * 0.1)

            // Check if there's already a data point for this date
            const existingIndex = data.findIndex((d) => d.date === restorationDateStr)
            if (existingIndex === -1) {
              data.push({
                date: restorationDateStr,
                harmScore: Number.parseFloat(cumulativeScore.toFixed(2)),
                restorationActive: true,
              })
            }
          }
        })

        // Sort by date again to ensure proper order
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        console.log("Processed chart data:", data)
        setChartData(data)

        // Calculate current score (last value in the chart)
        if (data.length > 0) {
          // Cap current score at 100 for display purposes
          setCurrentScore(Math.min(100, Number.parseFloat(data[data.length - 1].harmScore.toFixed(2))))
          // All time score has no upper limit
          setAllTimeScore(Number.parseFloat(totalHarmPoints.toFixed(2)))

          console.log("Current score:", currentScore.toFixed(2))
          console.log("All time score:", allTimeScore.toFixed(2))
        } else {
          setCurrentScore(0)
          setAllTimeScore(0)
        }
      } else {
        console.log("No logs found in localStorage")
      }
    } catch (error) {
      console.error("Error loading substance logs for chart:", error)
    }
  }, [])

  useEffect(() => {
    // Load data initially
    loadData()

    // Set up event listener for updates
    const handleLogsUpdated = () => {
      console.log("Log update detected, refreshing chart...")
      loadData()
    }

    const handleLogAdded = (event: CustomEvent) => {
      console.log("New log added:", event.detail)
      loadData()
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "standalone_substance_logs") {
        console.log("Storage change detected for substance logs")
        loadData()
      }
    }

    window.addEventListener("substance-logs-updated", handleLogsUpdated)
    window.addEventListener("substance-log-added", handleLogAdded as EventListener)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("substance-logs-updated", handleLogsUpdated)
      window.removeEventListener("substance-log-added", handleLogAdded as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadData])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-0.5">
            <CardTitle>Harm Index</CardTitle>
            <CardDescription>Your substance harm score over time</CardDescription>
          </div>
        </div>

        {/* Score cards */}
        <div className="flex gap-4 mb-2">
          <div className={`flex-1 rounded-lg border p-3 ${getScoreColor(currentScore)}`}>
            <div className="text-xs font-medium mb-1">Current Score</div>
            <div className="text-2xl font-bold">{currentScore.toFixed(2)}</div>
          </div>
          <div className="flex-1 rounded-lg border p-3 bg-gray-50 border-gray-200">
            <div className="text-xs font-medium mb-1">All Time Score</div>
            <div className="text-2xl font-bold">{allTimeScore.toFixed(2)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          {chartData.length === 0 ? (
            <div className="h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getExampleChartData()}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="exampleGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#aaaaaa" />
                      <stop offset="100%" stopColor="#cccccc" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]} // Set Y-axis domain to 0-100
                    tickFormatter={(value) => `${value.toFixed(2)}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      return [`${Number.parseFloat(value as string).toFixed(2)}`, "Example data"]
                    }}
                    labelFormatter={(label) => "Example visualization"}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="harmScore"
                    stroke="url(#exampleGradient)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={(props) => {
                      // Use a simpler dot for example data to avoid the error
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill="#e5e5e5"
                          stroke="#aaa"
                          strokeWidth={1}
                          opacity={0.7}
                        />
                      )
                    }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
                <div className="text-center max-w-md p-4 bg-white/90 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Track Your Substance Use</h3>
                  <p className="text-muted-foreground mb-4">
                    Log your first substance use to start tracking your harm score and see patterns over time.
                  </p>
                  <Button onClick={() => open("substance")} className="bg-red-500 hover:bg-red-600 text-white">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Log Your First Usage
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="harmGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff6b00" />
                    <stop offset="100%" stopColor="#ff9d00" />
                  </linearGradient>
                  <linearGradient id="restorationGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]} // Set Y-axis domain to 0-100
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    const { payload } = props
                    if (!payload) return ["", ""]

                    const label = [`${Number.parseFloat(value as string).toFixed(2)}`, "Harm Score"]

                    if (payload.substance) {
                      label.push(`Substance: ${payload.substance}`)
                      if (payload.subtype) {
                        label.push(`Type: ${payload.subtype}`)
                      }
                    }

                    if (payload.restorationActive) {
                      label.push("Restoration active")
                    }

                    return label
                  }}
                  labelFormatter={(label) => formatDate(label as string)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="harmScore"
                  stroke="url(#harmGradient)"
                  strokeWidth={2}
                  dot={<CustomDot />}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

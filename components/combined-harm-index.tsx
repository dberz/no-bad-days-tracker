"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon, PlusCircle, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react"
import { format, subMonths, differenceInDays, addDays, isSameDay, isAfter } from "date-fns"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, ReferenceLine } from "recharts"
import { cn } from "@/lib/utils"
import { SubstanceIcon } from "./substance-icons"
import { Button } from "@/components/ui/button"
import { useModal } from "@/contexts/modal-context"
import { useLogsStore } from "@/lib/store/useLogsStore"
import { SubstanceDistribution } from "./substance-distribution"
import { SubstanceLog } from "./substance-log"
import { TestUserToggle } from "@/components/test-user-toggle"
import { SubstanceLogDialog } from "@/components/substance-log-dialog"
import { InterventionLogDialog } from "@/components/intervention-log-dialog"

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
  user_id: string
}

// Define the chart data type
interface ChartData {
  date: string
  formattedDate: string
  harmScore: number
  substances?: {
    id: string
    type: string
    amount: number
    units: string
  }[]
}

// Substance half-lives in days
const SUBSTANCE_HALF_LIVES = {
  alcohol: 2,
  cannabis: 3,
  mdma: 5,
  lsd: 4,
  psilocybin: 4,
  ketamine: 3,
  nicotine: 2,
  prescription_stimulant: 3,
  caffeine: 1,
  cocaine: 2,
  default: 3, // Default for substances not listed
}

// Calculate lambda from half-life
function calculateLambda(halfLifeDays: number): number {
  return Math.log(2) / halfLifeDays
}

// Calculate harm decay over time
function calculateHarmDecay(initialHarm: number, halfLifeDays: number, daysPassed: number): number {
  const lambda = calculateLambda(halfLifeDays)
  return initialHarm * Math.exp(-lambda * daysPassed)
}

// Get half-life for a substance
function getSubstanceHalfLife(substanceType: string): number {
  const type = substanceType.toLowerCase()
  if (type === "alcohol") return SUBSTANCE_HALF_LIVES.alcohol
  if (type === "cannabis") return SUBSTANCE_HALF_LIVES.cannabis
  if (type === "mdma") return SUBSTANCE_HALF_LIVES.mdma
  if (type === "lsd" || type === "psychedelics") return SUBSTANCE_HALF_LIVES.lsd
  if (type === "psilocybin") return SUBSTANCE_HALF_LIVES.psilocybin
  if (type === "ketamine") return SUBSTANCE_HALF_LIVES.ketamine
  if (type === "nicotine") return SUBSTANCE_HALF_LIVES.nicotine
  if (type === "caffeine") return SUBSTANCE_HALF_LIVES.caffeine
  if (type === "cocaine") return SUBSTANCE_HALF_LIVES.cocaine
  return SUBSTANCE_HALF_LIVES.default
}

interface CombinedHarmIndexProps {
  userId?: string
  showLogButton?: boolean
  className?: string
}

// Custom animation timing
const ANIMATION_CONFIG = {
  duration: 1000,
  easing: "ease-out",
} as const

// Helper: get color by substance category
const SUBSTANCE_CATEGORY: Record<string, string> = {
  cannabis: "cannabis",
  marijuana: "cannabis",
  weed: "cannabis",
  smoked: "cannabis",
  edible: "cannabis",
  alcohol: "alcohol",
  beer: "alcohol",
  wine: "alcohol",
  liquor: "alcohol",
  spirits: "alcohol",
  nicotine: "nicotine",
  caffeine: "caffeine",
  stimulants: "stimulants",
  prescription: "stimulants",
  adderall: "stimulants",
  ritalin: "stimulants",
  cocaine: "stimulants",
  crack: "stimulants",
  meth: "stimulants",
  amphetamine: "stimulants",
  mdma: "psychedelics",
  ketamine: "psychedelics",
  psychedelics: "psychedelics",
  lsd: "psychedelics",
  acid: "psychedelics",
  psilocybin: "psychedelics",
  mushrooms: "psychedelics",
  shrooms: "psychedelics",
}
const SUBSTANCE_COLORS = {
  cannabis: "#22c55e", // green
  stimulants: "#ef4444", // red
  psychedelics: "#3b82f6", // blue
  alcohol: "#f59e0b", // orange
  nicotine: "#eab308", // yellow
  caffeine: "#a16207", // brown
  other: "#6b7280", // gray
}
const getSubstanceColor = (substance: string) => {
  const category = SUBSTANCE_CATEGORY[substance] || "other"
  return SUBSTANCE_COLORS[category as keyof typeof SUBSTANCE_COLORS] || SUBSTANCE_COLORS.other
}

export function CombinedHarmIndex({ userId, showLogButton = true, className }: CombinedHarmIndexProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [currentScore, setCurrentScore] = useState(0)
  const [allTimeScore, setAllTimeScore] = useState(0)
  const [substanceHarm, setSubstanceHarm] = useState(0)
  const [interventionReduction, setInterventionReduction] = useState(0)
  const [decayReduction, setDecayReduction] = useState(0)
  const [loading, setLoading] = useState(true)

  // Use a try-catch block to handle cases where the modal context might not be available
  const { open: modalOpen } = useModal()

  // Get logs from the Zustand store
  const logs = useLogsStore((state) => state.logs)

  // Get current test user id from localStorage (client only)
  const [testUserId, setTestUserId] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTestUserId(localStorage.getItem('test_user_id'))
    }
  }, [])

  // Add animation state
  const [isAnimating, setIsAnimating] = useState(false)
  const prevDataLength = useRef(0)

  // Update animation state when data changes
  useEffect(() => {
    if (chartData.length > prevDataLength.current) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), ANIMATION_CONFIG.duration)
      return () => clearTimeout(timer)
    }
    prevDataLength.current = chartData.length
  }, [chartData])

  // Get risk level and color based on harm score
  const getRiskLevel = (score: number) => {
    if (score < 20) return { level: "Low", color: "bg-green-500", textColor: "text-green-700" }
    if (score < 40) return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-700" }
    if (score < 60) return { level: "Elevated", color: "bg-orange-500", textColor: "text-orange-700" }
    if (score < 80) return { level: "High", color: "bg-red-500", textColor: "text-red-700" }
    return { level: "Severe", color: "bg-red-700", textColor: "text-red-800" }
  }

  const risk = getRiskLevel(currentScore)

  // Load logs from localStorage and prepare chart data
  const loadData = useCallback(() => {
    try {
      setLoading(true)
      console.log("Loading combined harm index data...")
      const storedLogs = localStorage.getItem("standalone_substance_logs")
      if (storedLogs) {
        console.log("Found logs:", storedLogs)
        let logs = JSON.parse(storedLogs) as SubstanceLog[]
        // Filter logs for current test user
        if (testUserId) {
          logs = logs.filter(log => log.user_id === testUserId)
        }

        // Filter logs for the last 3 months
        const now = new Date()
        const startDate = subMonths(now, 3)

        const filteredLogs = logs.filter((log) => {
          const logDate = new Date(log.date)
          return isAfter(logDate, startDate) || isSameDay(logDate, startDate)
        })

        // Sort logs by date
        filteredLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Create a map of all dates in the range
        const dateMap = new Map<string, ChartData>()

        // Initialize with all dates in the range
        if (filteredLogs.length > 0) {
          const firstDate = new Date(filteredLogs[0].date)
          const lastDate = new Date()
          const totalDays = Math.max(1, differenceInDays(lastDate, firstDate))

          // Add one day before the first log for better visualization
          const startingDate = addDays(firstDate, -1)
          dateMap.set(startingDate.toISOString().split("T")[0], {
            date: startingDate.toISOString().split("T")[0],
            formattedDate: format(startingDate, "MMM d"),
            harmScore: 0,
            substances: [],
          })

          // Add all days including the first log
          for (let i = 0; i <= totalDays; i++) {
            const currentDate = addDays(firstDate, i)
            const dateKey = currentDate.toISOString().split("T")[0]
            const formattedDate = format(currentDate, "MMM d")

            dateMap.set(dateKey, {
              date: dateKey,
              formattedDate,
              harmScore: 0,
              substances: [],
            })
          }
        }

        // Add substance logs to their respective dates
        filteredLogs.forEach((log) => {
          const date = new Date(log.date).toISOString().split("T")[0]
          const formattedDate = format(new Date(log.date), "MMM d")

          if (!dateMap.has(date)) {
            dateMap.set(date, {
              date,
              formattedDate,
              harmScore: 0,
              substances: [],
            })
          }

          const dataPoint = dateMap.get(date)!

          if (!dataPoint.substances) {
            dataPoint.substances = []
          }

          dataPoint.substances.push({
            id: log.id,
            type: log.substance_type,
            amount: Number.parseFloat(log.amount) || 1,
            units: log.substance_subtype || "",
          })
        })

        // Calculate harm score for each date with decay
        const data = Array.from(dateMap.values())

        // Calculate current harm score with decay
        let totalCurrentHarm = 0
        let totalOriginalHarm = 0
        let totalDecayReduction = 0
        let totalAllTimeHarm = 0

        filteredLogs.forEach((log) => {
          const logDate = new Date(log.date)
          const daysSince = differenceInDays(now, logDate)

          // Get harm points from log
          const harmPoints = log.harm_points || 0

          // Get half-life for this substance
          const halfLife = getSubstanceHalfLife(log.substance_type)

          // Calculate decayed harm
          const currentHarm = calculateHarmDecay(harmPoints, halfLife, daysSince)

          totalOriginalHarm += harmPoints
          totalCurrentHarm += currentHarm
          totalDecayReduction += harmPoints - currentHarm
          totalAllTimeHarm += harmPoints
        })

        // Calculate harm score for each date in the chart
        data.forEach((point) => {
          let pointHarmScore = 0

          // Calculate harm from all substances up to this date
          const pointDate = new Date(point.date)

          filteredLogs.forEach((log) => {
            const logDate = new Date(log.date)

            // Only include logs that happened before or on this date
            if (logDate <= pointDate) {
              const daysSince = differenceInDays(pointDate, logDate)

              // Get harm points from log
              const harmPoints = log.harm_points || 0

              // Get half-life for this substance
              const halfLife = getSubstanceHalfLife(log.substance_type)

              // Calculate decayed harm
              const decayedHarm = calculateHarmDecay(harmPoints, halfLife, daysSince)

              pointHarmScore += decayedHarm
            }
          })

          point.harmScore = Number.parseFloat(pointHarmScore.toFixed(2))
        })

        // Sort by date
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        console.log("Processed combined harm index data:", data)
        setChartData(data)
        setCurrentScore(Math.min(100, Number.parseFloat(totalCurrentHarm.toFixed(2)))) // Cap current score at 100
        setAllTimeScore(Number.parseFloat(totalAllTimeHarm.toFixed(2))) // All-time score has no upper limit
        setSubstanceHarm(Number.parseFloat(totalOriginalHarm.toFixed(2)))
        setDecayReduction(Number.parseFloat(totalDecayReduction.toFixed(2)))
      } else {
        console.log("No logs found in localStorage")
        setChartData([])
        setCurrentScore(0)
        setAllTimeScore(0)
        setSubstanceHarm(0)
        setDecayReduction(0)
      }
    } catch (error) {
      console.error("Error loading substance logs for chart:", error)
    } finally {
      setLoading(false)
    }
  }, [testUserId])

  useEffect(() => {
    // Load data initially
    loadData()

    // Set up event listener for updates
    const handleLogsUpdated = () => {
      console.log("Log update detected, refreshing combined harm index...")
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

  // Also update when logs change in the Zustand store
  useEffect(() => {
    loadData()
  }, [logs, loadData])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ChartData
      const score = dataPoint.harmScore
      let recoveryStatus = "Excellent Recovery"
      let statusColor = "text-green-500"
      
      if (score >= 50) {
        recoveryStatus = "Needs Attention"
        statusColor = "text-red-500"
      } else if (score >= 25) {
        recoveryStatus = "Moderate Recovery"
        statusColor = "text-yellow-500"
      }

      return (
        <div className="bg-white p-4 rounded-md shadow-md border border-gray-200">
          <p className="font-bold">{dataPoint.formattedDate}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Recovery Score</p>
            <p className={`text-lg font-bold ${statusColor}`}>{score.toFixed(1)}</p>
          </div>
          <p className={`text-sm font-medium mt-1 ${statusColor}`}>{recoveryStatus}</p>

          {dataPoint.substances && dataPoint.substances.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="text-sm font-medium text-gray-600">Substances:</p>
              <ul className="list-disc pl-5 mt-1">
                {dataPoint.substances.map((substance, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <SubstanceIcon name={substance.type} className="h-4 w-4" />
                    <span>{substance.type}: {substance.amount} {substance.units}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // Handle log button click
  const handleLogClick = () => {
    modalOpen("substance")
  }

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score < 25) return "text-green-500"
    if (score < 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className={cn("relative", className)}>
      <div className="absolute top-2 right-2 z-10">
        <TestUserToggle />
      </div>
      <CardHeader className="pb-4 border-b bg-gradient-to-b from-background to-muted/30 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl font-bold">
              Your Harm Recovery Index
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="mt-2 text-base text-muted-foreground max-w-xl">
              Track your recovery progress and healing journey over time. Lower scores indicate better recovery.
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <SubstanceLogDialog buttonVariant="default" buttonSize="sm" className="rounded-full">
                Log Substance
              </SubstanceLogDialog>
              <InterventionLogDialog buttonVariant="secondary" buttonSize="sm" className="rounded-full">
                Log Intervention
              </InterventionLogDialog>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex gap-4">
              <div className="p-4 rounded-lg border bg-card flex flex-col items-center min-w-[120px]">
                <p className="text-xs font-medium text-muted-foreground mb-1">Current Recovery Score</p>
                <div className="flex items-baseline gap-2">
                  <p className={cn("text-3xl font-bold", getScoreColor(chartData[chartData.length - 1]?.harmScore || 0))}>
                    {(chartData[chartData.length - 1]?.harmScore || 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
              </div>
              <div className="p-4 rounded-lg border bg-card flex flex-col items-center min-w-[120px]">
                <p className="text-xs font-medium text-muted-foreground mb-1">Recovery Progress</p>
                <p className="text-3xl font-bold text-green-500">
                  {decayReduction > 0 ? `+${decayReduction.toFixed(1)}` : "0.0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Points recovered</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="space-y-8">
          {/* Primary Chart - Full Width */}
          <div className="h-[400px] relative">
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-b from-background to-muted/20 rounded-lg border border-dashed">
                {/* Example data chart with 50% opacity */}
                <div className="absolute inset-0 opacity-50 pointer-events-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "2024-01-01", harmIndex: 45, substances: 2, interventions: 1 },
                        { date: "2024-01-02", harmIndex: 35, substances: 1, interventions: 2 },
                        { date: "2024-01-03", harmIndex: 25, substances: 0, interventions: 3 },
                        { date: "2024-01-04", harmIndex: 15, substances: 0, interventions: 2 },
                        { date: "2024-01-05", harmIndex: 10, substances: 0, interventions: 1 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
                      <Area type="monotone" dataKey="harmIndex" stroke="none" fill="url(#gHarm)" />
                      <Area type="monotone" dataKey="substances" stroke="none" fill="url(#gSub)" />
                      <Area type="monotone" dataKey="interventions" stroke="none" fill="url(#gInt)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="max-w-md text-center space-y-6 relative z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-muted">
                      <LineChartIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Track Your Recovery Journey</h3>
                    <p className="text-sm text-muted-foreground">
                      Log your substance use to see your recovery progress over time. You'll get:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50 flex flex-col items-center gap-2">
                      <LineChartIcon className="h-4 w-4 text-green-500" />
                      <p className="font-medium">Recovery Tracking</p>
                      <p className="text-xs text-muted-foreground">Monitor your progress with daily scores</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 flex flex-col items-center gap-2">
                      <PieChartIcon className="h-4 w-4 text-blue-500" />
                      <p className="font-medium">Usage Insights</p>
                      <p className="text-xs text-muted-foreground">See patterns and substance breakdown</p>
                    </div>
                  </div>

                  {showLogButton && (
                    <Button onClick={handleLogClick} className="bg-red-500 hover:bg-red-600 text-white w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Start Tracking Now
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <defs>
                    <linearGradient id="colorHarm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.1} />
                      <stop offset="50%" stopColor="#eab308" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `${value.toFixed(0)}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    domain={[0, 100]}
                    padding={{ top: 20, bottom: 20 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Background gradient */}
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#recoveryGradient)" />
                  <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Low Risk', position: 'right', fill: '#22c55e', fontSize: 12 }} />
                  <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate Risk', position: 'right', fill: '#f59e0b', fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="harmScore"
                    stroke="#22c55e"
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={ANIMATION_CONFIG.duration}
                    animationEasing={ANIMATION_CONFIG.easing}
                    dot={(props) => {
                      const dataPoint = chartData[props.index]
                      const score = dataPoint?.harmScore || 0
                      const isLatest = props.index === chartData.length - 1
                      let color = "#22c55e"
                      if (dataPoint?.substances && dataPoint.substances.length > 0) {
                        color = getSubstanceColor(dataPoint.substances[0].type)
                        return (
                          <g transform={`translate(${props.cx},${props.cy})`}>
                            <circle 
                              r={isLatest && isAnimating ? 6 : 4} 
                              fill={color}
                              className={isLatest && isAnimating ? "animate-ping" : ""}
                            />
                            <SubstanceIcon
                              name={dataPoint.substances[0].type}
                              className={cn(
                                "h-4 w-4 absolute",
                                isLatest && isAnimating && "animate-bounce"
                              )}
                              style={{
                                transform: "translate(-8px, -8px)",
                                color: color,
                                fill: color,
                              }}
                            />
                          </g>
                        )
                      }
                      return (
                        <circle 
                          cx={props.cx} 
                          cy={props.cy} 
                          r={isLatest && isAnimating ? 4 : 2} 
                          fill={color}
                          className={isLatest && isAnimating ? "animate-ping" : ""}
                        />
                      )
                    }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    fill="url(#colorHarm)"
                    fillOpacity={1}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Two Column Layout for Additional Charts */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubstanceDistribution allTimeScore={allTimeScore} />
              <SubstanceLog />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

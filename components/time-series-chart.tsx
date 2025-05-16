"use client"

import { useLogsStore } from "@/lib/store/useLogsStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, parseISO } from "date-fns"
import { useMemo } from "react"
import { SubstanceIcon } from "@/components/substance-icons"

interface ChartData {
  date: string
  formattedDate: string
  substances: number
  interventions: number
  harmIndex?: number
  // Store the substance names for the day to render icons
  substanceNames: string[]
}

// Custom dot component to render substance icons with proper null checks
const CustomDot = (props: any) => {
  // Add null checks for props and payload
  if (!props || !props.payload) {
    return null
  }

  const { cx, cy, payload } = props

  // Add null check for substanceNames and ensure it's an array
  if (!payload.substanceNames || !Array.isArray(payload.substanceNames) || payload.substanceNames.length === 0) {
    return null
  }

  // Use the first substance name for the icon
  const substanceName = payload.substanceNames[0]

  // Add null check for substanceName
  if (!substanceName) {
    return null
  }

  return (
    <g transform={`translate(${cx - 8},${cy - 8})`}>
      <foreignObject width={16} height={16}>
        <div className="w-4 h-4">
          <SubstanceIcon name={substanceName} className="w-4 h-4 drop-shadow-sm" />
        </div>
      </foreignObject>
    </g>
  )
}

// Get color based on harm index value
const getHarmColor = (harmIndex: number) => {
  if (harmIndex < 25) return "#10b981" // Green for low harm
  if (harmIndex < 50) return "#f59e0b" // Yellow for medium harm
  return "#ef4444" // Red for high harm
}

// Custom gradient definitions based on harm index
const CustomGradientDefs = ({ data }: { data: ChartData[] }) => {
  // Calculate the maximum harm index
  const maxHarmIndex = Math.max(...data.map((d) => d.harmIndex || 0))

  // Determine the color based on the maximum harm index
  const color = getHarmColor(maxHarmIndex)

  return (
    <defs>
      <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#0D8BFF" stopOpacity={0.35} />
        <stop offset="95%" stopColor="#0D8BFF" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gHarmLow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gHarmMedium" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gHarmHigh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

// Custom line for harm index with dynamic color
const CustomHarmLine = ({ data }: { data: ChartData[] }) => {
  // Calculate the maximum harm index
  const maxHarmIndex = Math.max(...data.map((d) => d.harmIndex || 0))

  // Determine the color and gradient based on the maximum harm index
  const color = getHarmColor(maxHarmIndex)
  let gradientId = "gHarmLow"

  if (maxHarmIndex >= 50) {
    gradientId = "gHarmHigh"
  } else if (maxHarmIndex >= 25) {
    gradientId = "gHarmMedium"
  }

  return (
    <>
      <Area type="monotone" dataKey="harmIndex" stroke="none" fill={`url(#${gradientId})`} />
      <Line
        type="monotone"
        dataKey="harmIndex"
        stroke={color}
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 8 }}
        name="harmIndex"
      />
    </>
  )
}

export function TimeSeriesChart() {
  const logs = useLogsStore((state) => state.logs)

  // Transform logs to daily counts
  const chartData = useMemo(() => {
    const dataMap = new Map<string, ChartData>()

    // Process all logs
    logs.forEach((log) => {
      const date = parseISO(log.createdAt)
      const dateKey = format(date, "yyyy-MM-dd")
      const formattedDate = format(date, "MMM d")

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          formattedDate,
          substances: 0,
          interventions: 0,
          harmIndex: 0,
          substanceNames: [], // Initialize as empty array
        })
      }

      const entry = dataMap.get(dateKey)!
      if (log.type === "substance") {
        entry.substances += 1
        // Add substance name to the array for icon rendering
        if (log.name) {
          entry.substanceNames.push(log.name)
        }
        // Simple mock harm index calculation
        entry.harmIndex = (entry.harmIndex || 0) + (log.value || 3)
      } else {
        entry.interventions += 1
        // Interventions reduce harm index
        entry.harmIndex = Math.max(0, (entry.harmIndex || 0) - 1)
      }
    })

    // Convert to array and sort by date
    return Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  // Calculate Y-axis domain based on data
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 10]

    // Find max values
    const maxSubstances = Math.max(...chartData.map((d) => d.substances))
    const maxInterventions = Math.max(...chartData.map((d) => d.interventions))
    const maxHarmIndex = Math.max(...chartData.map((d) => d.harmIndex || 0))

    // Calculate appropriate max Y value
    const maxY = Math.max(maxSubstances, maxInterventions, maxHarmIndex, 5) // At least 5 for visibility

    // Round up to nearest multiple of 5
    const roundedMaxY = Math.ceil(maxY / 5) * 5

    return [0, roundedMaxY]
  }, [chartData])

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Activity Timeline</CardTitle>
        <CardDescription>Substances, interventions, and harm index over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground">No data to display yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" data-testid="TimeSeriesChart">
              <LineChart data={chartData}>
                <CustomGradientDefs data={chartData} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={yAxisDomain} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "substances") return [value, "Substances"]
                    if (name === "interventions") return [value, "Interventions"]
                    return [value, "Harm Index"]
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area type="monotone" dataKey="substances" stroke="none" fill="url(#gSub)" />
                <Area type="monotone" dataKey="interventions" stroke="none" fill="url(#gInt)" />
                <Line
                  type="monotone"
                  dataKey="substances"
                  stroke="#0D8BFF"
                  strokeWidth={2}
                  dot={<CustomDot />}
                  activeDot={{ r: 8 }}
                  name="substances"
                />
                <Line
                  type="monotone"
                  dataKey="interventions"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 8 }}
                  name="interventions"
                />
                <CustomHarmLine data={chartData} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

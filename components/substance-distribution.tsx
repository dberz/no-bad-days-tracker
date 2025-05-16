import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { ParentSize } from "@visx/responsive"
import { SubstanceIcon } from "./substance-icons"

interface SubstanceData {
  substance: string
  points: number
}

const SUBSTANCE_COLORS = {
  alcohol: "#ef4444", // red
  cannabis: "#22c55e", // green
  psychedelics: "#8b5cf6", // purple
  stimulants: "#f59e0b", // amber
  default: "#6b7280", // gray
}

export function SubstanceDistribution({ className, allTimeScore }: { className?: string; allTimeScore: number }) {
  // Get substance logs from localStorage
  const substanceData = useMemo(() => {
    try {
      const storedLogs = localStorage.getItem("standalone_substance_logs")
      if (!storedLogs) return []

      const logs = JSON.parse(storedLogs)
      const substancePoints = new Map<string, number>()

      logs.forEach((log: any) => {
        const substance = log.substance_type
        const points = log.harm_points || 0
        substancePoints.set(substance, (substancePoints.get(substance) || 0) + points)
      })

      return Array.from(substancePoints.entries()).map(([substance, points]) => ({
        substance,
        points,
      }))
    } catch (error) {
      console.error("Error loading substance distribution:", error)
      return []
    }
  }, [])

  const total = substanceData.reduce((sum, { points }) => sum + points, 0)

  if (substanceData.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Substance Distribution</CardTitle>
        <CardDescription>
          Total harm points: {allTimeScore.toFixed(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <ParentSize>
            {({ width, height }) => {
              const radius = Math.min(width, height) / 2
              const thickness = radius * 0.2

              return (
                <svg width={width} height={height}>
                  <Group top={height / 2} left={width / 2}>
                    <Pie
                      data={substanceData}
                      pieValue={(d) => d.points}
                      outerRadius={radius - thickness}
                      innerRadius={radius - thickness * 2}
                      padAngle={0.02}
                    >
                      {(pie) => {
                        return pie.arcs.map((arc) => {
                          const substance = arc.data.substance
                          const color = SUBSTANCE_COLORS[substance as keyof typeof SUBSTANCE_COLORS] || SUBSTANCE_COLORS.default
                          const percentage = ((arc.data.points / total) * 100).toFixed(1)
                          const [centroidX, centroidY] = pie.path.centroid(arc)
                          
                          return (
                            <g key={`arc-${substance}`}>
                              <path d={pie.path(arc) || ""} fill={color} />
                              <g
                                transform={`translate(${centroidX * 1.3}, ${centroidY * 1.3})`}
                                style={{ pointerEvents: "none" }}
                              >
                                <foreignObject
                                  x={-12}
                                  y={-12}
                                  width={24}
                                  height={24}
                                  style={{ overflow: "visible" }}
                                >
                                  <div className="flex items-center justify-center">
                                    <SubstanceIcon name={substance} className="h-6 w-6 text-white" />
                                  </div>
                                </foreignObject>
                              </g>
                            </g>
                          )
                        })
                      }}
                    </Pie>
                  </Group>
                </svg>
              )
            }}
          </ParentSize>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {substanceData.map(({ substance, points }) => (
            <div key={substance} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: SUBSTANCE_COLORS[substance as keyof typeof SUBSTANCE_COLORS] || SUBSTANCE_COLORS.default,
                }}
              />
              <span className="text-sm font-medium capitalize">{substance}</span>
              <div className="flex-1 text-right">
                <span className="text-sm text-muted-foreground">
                  {points.toFixed(1)} ({((points / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
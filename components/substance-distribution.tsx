import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { ParentSize } from "@visx/responsive"
import { SubstanceIcon } from "./substance-icons"

interface SubstanceData {
  substance: string
  points: number
}

// Map substance to category
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

export function SubstanceDistribution({ className, allTimeScore }: { className?: string; allTimeScore: number }) {
  // Get substance logs from localStorage
  const substanceData = useMemo(() => {
    try {
      const storedLogs = localStorage.getItem("standalone_substance_logs")
      if (!storedLogs) return []

      const logs = JSON.parse(storedLogs)
      const categoryPoints = new Map<string, number>()

      logs.forEach((log: any) => {
        const substance = log.substance_type
        const category = SUBSTANCE_CATEGORY[substance] || "other"
        const points = log.harm_points || 0
        categoryPoints.set(category, (categoryPoints.get(category) || 0) + points)
      })

      return Array.from(categoryPoints.entries()).map(([category, points]) => ({
        category,
        points,
      }))
    } catch (error) {
      console.error("Error loading substance distribution:", error)
      return []
    }
  }, [])

  const total = substanceData.reduce((sum, { points }) => sum + points, 0)

  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; category: string; points: number; percent: string } | null>(null)

  if (substanceData.length === 0) {
    return null
  }

  // Helper to get color by category
  const getColor = (category: string) => {
    return SUBSTANCE_COLORS[category as keyof typeof SUBSTANCE_COLORS] || SUBSTANCE_COLORS.other
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
                          const category = arc.data.category
                          const color = getColor(category)
                          const percentage = ((arc.data.points / total) * 100).toFixed(1)
                          const [centroidX, centroidY] = pie.path.centroid(arc)
                          const isHovered = hovered === category
                          return (
                            <g key={`arc-${category}`}
                              onMouseEnter={e => {
                                setHovered(category)
                                setTooltip({
                                  x: e.clientX,
                                  y: e.clientY,
                                  category,
                                  points: arc.data.points,
                                  percent: percentage,
                                })
                              }}
                              onMouseMove={e => {
                                if (hovered === category) {
                                  setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                                }
                              }}
                              onMouseLeave={() => {
                                setHovered(null)
                                setTooltip(null)
                              }}
                            >
                              <path d={pie.path(arc) || ""} fill={color} opacity={isHovered ? 0.85 : 1} stroke={isHovered ? "#222" : undefined} strokeWidth={isHovered ? 2 : 0} />
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
                                    <SubstanceIcon name={category} className="h-6 w-6 text-white" />
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
          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-white"
              style={{
                left: tooltip.x + 12,
                top: tooltip.y - 24,
                background: getColor(tooltip.category),
                minWidth: 120,
                transition: 'background 0.2s',
              }}
            >
              <div className="font-bold capitalize">{tooltip.category}</div>
              <div>{tooltip.points.toFixed(1)} points</div>
              <div>{tooltip.percent}% of total</div>
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {substanceData.map(({ category, points }) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getColor(category),
                }}
              />
              <span className="text-sm font-medium capitalize">{category}</span>
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
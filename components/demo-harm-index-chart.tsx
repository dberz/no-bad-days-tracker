"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, ArrowRight, Beer, Pill, Brain, CalendarRange, Zap, Cannabis, Moon, Dumbbell } from "lucide-react"
import { getSubstanceLogs } from "@/app/actions/substance-log-actions"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DemoHarmIndexChart() {
  const [hasLogs, setHasLogs] = useState(false)
  const router = useRouter()

  // Check if user has logs
  const checkForLogs = async () => {
    try {
      const logs = await getSubstanceLogs()
      setHasLogs(logs.length > 0)

      // If they have logs, refresh the page to show real data
      if (logs.length > 0) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error checking logs:", error)
    }
  }

  // Call this when component mounts
  useEffect(() => {
    checkForLogs()
  }, [])

  return (
    <Card className="w-full bg-[#FDFBF7] text-[#29241C]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Harm Index</CardTitle>
            <CardDescription>Track how your substance use affects your wellness over time</CardDescription>
          </div>
          <div>
            <Select defaultValue="3m">
              <SelectTrigger className="w-[130px] rounded-full flex items-center gap-2 bg-[#FFE6A7] border-[#29241C]/20 text-[#29241C]">
                <CalendarRange className="h-4 w-4 text-[#29241C]/70" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#FDFBF7] text-[#29241C]">
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasLogs ? (
          <div className="space-y-6">
            {/* Demo Chart */}
            <div className="h-[350px] w-full rounded-md border p-4 relative bg-gradient-to-b from-[#F9F8F4] to-[#F1EBE2]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md p-6">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-[#FFE6A7] flex items-center justify-center text-[#29241C]">
                      <LineChart className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-[#29241C]">See Your Harm Index</h3>
                  <p className="text-sm text-[#29241C]/70">
                    Log your substance use to see how it affects your harm index score. The more you log, the more
                    personalized insights you'll receive.
                  </p>

                  {/* Demo items showing what would appear on the chart */}
                  <div className="flex justify-center space-x-8 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-2">Negative Impact</div>
                      <div className="flex space-x-2">
                        <div className="rounded-full bg-red-500/80 h-8 w-8 flex items-center justify-center text-[#FDFBF7]">
                          <Beer className="h-4 w-4" />
                        </div>
                        <div className="rounded-full bg-red-500/80 h-8 w-8 flex items-center justify-center text-[#FDFBF7]">
                          <Zap className="h-4 w-4" title="MDMA" />
                        </div>
                        <div className="rounded-full bg-red-500/80 h-8 w-8 flex items-center justify-center text-[#FDFBF7]">
                          <Cannabis className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-2">Positive Impact</div>
                      <div className="flex space-x-2">
                        <div className="rounded-full bg-green-500/80 h-8 w-8 flex items-center justify-center text-[#FDFBF7]">
                          <Moon className="h-4 w-4" title="Sleep" />
                        </div>
                        <div className="rounded-full bg-green-500/80 h-8 w-8 flex items-center justify-center text-[#FDFBF7]">
                          <Dumbbell className="h-4 w-4" title="Exercise" />
                        </div>
                        <div className="rounded-full bg-green-500/80 h-8 w-8 flex items-center justify-center text-[#FDFBF7]">
                          <Pill className="h-4 w-4" title="Supplements" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      Use the + button in the top right to log your first entry
                    </p>
                  </div>
                </div>
              </div>

              {/* Watermarked demo chart in background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                  {/* Demo line */}
                  <path
                    d="M0,150 L100,180 L200,160 L300,220 L400,200 L500,120 L600,100 L700,80 L800,60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  {/* Area under the curve */}
                  <path
                    d="M0,150 L100,180 L200,160 L300,220 L400,200 L500,120 L600,100 L700,80 L800,60 L800,300 L0,300 Z"
                    fill="currentColor"
                    opacity="0.1"
                  />

                  {/* Demo event markers */}
                  <circle cx="200" cy="160" r="8" fill="currentColor" />
                  <circle cx="300" cy="220" r="8" fill="currentColor" />
                  <circle cx="500" cy="120" r="8" fill="currentColor" />
                  <circle cx="700" cy="80" r="8" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Event legend */}
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Substance Use</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Positive Interventions</span>
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">How It Works</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 bg-[#F9F8F4]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Beer className="h-5 w-5 text-[#29241C]" />
                    <span className="font-medium">Log Substance Use</span>
                  </div>
                  <p className="text-sm text-[#29241C]/70">
                    Record what you use, how much, and how you feel during and after
                  </p>
                </div>

                <div className="rounded-lg border p-4 bg-[#F9F8F4]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-5 w-5 text-[#29241C]" />
                    <span className="font-medium">Track Wellness Factors</span>
                  </div>
                  <p className="text-sm text-[#29241C]/70">
                    Log sleep, exercise, and substance breaks to improve your score
                  </p>
                </div>

                <div className="rounded-lg border p-4 bg-[#F9F8F4]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Pill className="h-5 w-5 text-[#29241C]" />
                    <span className="font-medium">Get Recommendations</span>
                  </div>
                  <p className="text-sm text-[#29241C]/70">
                    Receive personalized suggestions to reduce harm and improve wellness
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-full bg-[#FFE6A7] hover:bg-[#FFE6A7]/80 border-[#29241C]/20 text-[#29241C]"
                onClick={() => router.push("/education")}
              >
                Learn More About Harm Reduction
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <p className="text-muted-foreground">Loading your data...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Beer, Cannabis, Pill, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogSubstanceButton } from "./substance-logger"

interface AllTimeUsageSummaryProps {
  userId?: string
  showLogButton?: boolean
  className?: string
}

type TimePeriod = "all-time" | "this-month" | "this-year"

export function AllTimeUsageSummary({ userId, showLogButton = true, className }: AllTimeUsageSummaryProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all-time")

  // Demo data - in a real app, this would come from an API or database
  const allSubstances = [
    {
      name: "Alcohol",
      icon: Beer,
      usageCount: 24,
      lastUsed: "2 days ago",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
    },
    {
      name: "Cannabis",
      icon: Cannabis,
      usageCount: 12,
      lastUsed: "5 days ago",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    {
      name: "MDMA",
      icon: Pill,
      usageCount: 3,
      lastUsed: "30+ days ago",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
  ]

  // Filter substances based on selected time period
  const getFilteredSubstances = () => {
    switch (timePeriod) {
      case "this-month":
        return allSubstances.map((substance) => ({
          ...substance,
          usageCount: Math.floor(substance.usageCount * 0.3), // Simulate monthly data (30% of all-time)
        }))
      case "this-year":
        return allSubstances.map((substance) => ({
          ...substance,
          usageCount: Math.floor(substance.usageCount * 0.8), // Simulate yearly data (80% of all-time)
        }))
      default:
        return allSubstances
    }
  }

  const substances = getFilteredSubstances()

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Substance Use Summary</CardTitle>
          <CardDescription>Your substance use over time</CardDescription>
        </div>
        {showLogButton && (
          <LogSubstanceButton variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Log
          </LogSubstanceButton>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4 space-x-2">
          <Button
            variant={timePeriod === "all-time" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("all-time")}
            className="text-xs"
          >
            All Time
          </Button>
          <Button
            variant={timePeriod === "this-month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("this-month")}
            className="text-xs"
          >
            This Month
          </Button>
          <Button
            variant={timePeriod === "this-year" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("this-year")}
            className="text-xs"
          >
            This Year
          </Button>
        </div>

        {substances.length === 0 ? (
          <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">No usage data available</p>
              <p className="text-xs text-muted-foreground mt-1">Log your first substance use to see data here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {substances.slice(0, 3).map((substance) => (
              <div
                key={substance.name}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3",
                  substance.borderColor,
                  substance.bgColor,
                )}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-white",
                      substance.textColor,
                    )}
                  >
                    <substance.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={cn("font-medium", substance.textColor)}>{substance.name}</div>
                    <div className="text-sm text-muted-foreground">Last used: {substance.lastUsed}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("text-2xl font-bold", substance.textColor)}>{substance.usageCount.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Total uses</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full rounded-full" asChild>
          <Link href="/substance-use">View All Substances</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

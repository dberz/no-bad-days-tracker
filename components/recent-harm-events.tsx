"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Beer, Cannabis, Pill } from "lucide-react"

interface RecentHarmEventsProps {
  className?: string
}

export function RecentHarmEvents({ className }: RecentHarmEventsProps) {
  // Demo data - in a real app, this would come from an API or database
  const events = [
    {
      date: "Sep 30, 2025",
      substance: "Alcohol",
      icon: Beer,
      amount: "4 drinks",
      harmScore: 65,
      color: "text-amber-500",
    },
    {
      date: "Sep 25, 2025",
      substance: "Cannabis",
      icon: Cannabis,
      amount: "1 joint",
      harmScore: 82,
      color: "text-green-500",
    },
    {
      date: "Sep 1, 2025",
      substance: "MDMA",
      icon: Pill,
      amount: "1 dose",
      harmScore: 45,
      color: "text-purple-500",
    },
  ]

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        <CardDescription>Your most recent substance use</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-1">Log your first substance use to see data here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-center space-x-4 rounded-xl border p-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-muted", event.color)}>
                  <event.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {event.substance} - {event.amount}
                  </p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{event.harmScore}</div>
                  <div className="text-xs text-muted-foreground">Harm Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

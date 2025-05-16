"use client"

import { CombinedHarmIndex } from "@/components/combined-harm-index"
import { RecentActivityCard } from "@/components/recent-activity-card"
import { TimeSeriesChart } from "@/components/time-series-chart"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <CombinedHarmIndex />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeSeriesChart />
        <RecentActivityCard />
      </div>
    </div>
  )
}

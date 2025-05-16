"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { AllTimeUsageSummary } from "@/components/all-time-usage-summary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart } from "lucide-react"
import { SubstanceTips } from "@/components/substance-tips"
import { DirectLogButtons, FloatingDirectLogButtons } from "@/components/direct-log-buttons"

export default function InsightsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Compact banner with styled buttons */}
      <div className="bg-yellow-100 border-b border-yellow-300 py-2">
        <div className="container mx-auto">
          <DirectLogButtons />
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-12 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
              <p className="text-sm text-muted-foreground">
                Understand your patterns and get personalized recommendations.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <AllTimeUsageSummary className="md:col-span-1" />

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold">Usage Patterns</CardTitle>
                  <CardDescription>How your substance use has changed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BarChart className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Weekly Usage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="chart-substance" className="text-sm">
                        Substance:
                      </Label>
                      <Select defaultValue="alcohol">
                        <SelectTrigger id="chart-substance" className="h-8 w-[130px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alcohol">Alcohol</SelectItem>
                          <SelectItem value="cannabis">Cannabis</SelectItem>
                          <SelectItem value="all">All Substances</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Placeholder for chart - in a real app, this would be a Chart.js or similar component */}
                  <div className="h-[300px] w-full rounded-md bg-muted/40 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Usage visualization would appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">(Chart showing weekly alcohol consumption)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="patterns" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="patterns">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">Usage Patterns</CardTitle>
                    <CardDescription>Insights about your substance use habits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Weekend Concentration</h3>
                      <p className="text-sm text-muted-foreground">
                        80% of your alcohol consumption occurs on Friday and Saturday nights, typically between 8 PM and
                        midnight.
                      </p>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Social Context</h3>
                      <p className="text-sm text-muted-foreground">
                        You primarily use substances in social settings (75% of logs), with small gatherings being the
                        most common context.
                      </p>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Frequency Trends</h3>
                      <p className="text-sm text-muted-foreground">
                        Your overall substance use has decreased by 15% in the past month compared to the previous
                        month.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="correlations">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">Health Correlations</CardTitle>
                    <CardDescription>How substance use correlates with your wellness</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Sleep Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        On nights when you consume more than 3 alcoholic drinks, you report an average of 2 hours less
                        sleep.
                      </p>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Supplement Effect</h3>
                      <p className="text-sm text-muted-foreground">
                        When you take No Bad Days supplements before drinking, you report 40% fewer hangover symptoms
                        the next day.
                      </p>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Mood Correlation</h3>
                      <p className="text-sm text-muted-foreground">
                        Your mood ratings are 30% lower the day after drinking more than 3 drinks compared to days after
                        moderate or no drinking.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">Personalized Recommendations</CardTitle>
                    <CardDescription>Suggestions to improve your wellness based on your data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Supplement Protocol</h3>
                      <p className="text-sm text-muted-foreground">
                        Take No Bad Days supplement before drinking to reduce next-day symptoms. Based on your patterns,
                        Friday and Saturday evenings would be optimal times.
                      </p>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Hydration Strategy</h3>
                      <p className="text-sm text-muted-foreground">
                        Your logs show minimal water intake during drinking sessions. Try alternating alcoholic drinks
                        with water to reduce dehydration effects.
                      </p>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Recovery Days</h3>
                      <p className="text-sm text-muted-foreground">
                        Consider adding at least 2 consecutive substance-free days per week to allow your body to
                        recover. Based on your schedule, Monday-Tuesday might work best.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Add this at the bottom */}
            <div className="mt-2">
              <SubstanceTips />
            </div>
          </div>
        </div>
      </main>

      {/* Floating buttons */}
      <FloatingDirectLogButtons />
    </div>
  )
}

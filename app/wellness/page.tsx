"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HarmScoreChart } from "@/components/harm-score-chart"
import { Brain, Calendar, Clock, Dumbbell, Moon, Sun } from "lucide-react"
import { SubstanceTips } from "@/components/substance-tips"
import { DirectLogButtons, FloatingDirectLogButtons } from "@/components/direct-log-buttons"

export default function WellnessPage() {
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
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Wellness Tracking</h1>
              <p className="text-sm text-muted-foreground">Track factors that can improve your harm score over time</p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
                <TabsTrigger value="breaks">Substance Breaks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold">Harm Score Trend</CardTitle>
                      <CardDescription>Track your wellness score over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HarmScoreChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-xl font-bold">Sleep Quality</CardTitle>
                        <CardDescription>Recent sleep patterns</CardDescription>
                      </div>
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Average Sleep</span>
                          <span className="text-sm">7.2 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sleep Quality</span>
                          <span className="text-sm">Good</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Consistency</span>
                          <span className="text-sm">Moderate</span>
                        </div>
                        <Button variant="outline" className="w-full rounded-full" asChild>
                          <a href="/wellness?tab=sleep">Track Sleep</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-xl font-bold">Exercise</CardTitle>
                        <CardDescription>Recent physical activity</CardDescription>
                      </div>
                      <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Weekly Sessions</span>
                          <span className="text-sm">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Activity Types</span>
                          <span className="text-sm">Cardio, Strength</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Last Activity</span>
                          <span className="text-sm">2 days ago</span>
                        </div>
                        <Button variant="outline" className="w-full rounded-full" asChild>
                          <a href="/wellness?tab=exercise">Track Exercise</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-xl font-bold">Substance Breaks</CardTitle>
                        <CardDescription>Periods of abstinence to improve recovery</CardDescription>
                      </div>
                      <Brain className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Alcohol</span>
                              <span className="text-green-600 text-sm">12 days</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Current break started on Sep 18</div>
                            <div className="mt-2 text-xs text-green-600">+8 points to harm score</div>
                          </div>

                          <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Cannabis</span>
                              <span className="text-green-600 text-sm">5 days</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Current break started on Sep 25</div>
                            <div className="mt-2 text-xs text-green-600">+4 points to harm score</div>
                          </div>

                          <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">MDMA</span>
                              <span className="text-green-600 text-sm">30+ days</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Last use was Aug 30</div>
                            <div className="mt-2 text-xs text-green-600">+10 points to harm score</div>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full rounded-full" asChild>
                          <a href="/wellness?tab=breaks">Manage Breaks</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sleep">
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold">Log Sleep</CardTitle>
                      <CardDescription>Track your sleep duration and quality</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sleep-date">Date</Label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Input id="sleep-date" type="date" className="rounded-full" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="sleep-start">Bedtime</Label>
                          <div className="flex items-center space-x-2">
                            <Moon className="h-4 w-4 text-muted-foreground" />
                            <Input id="sleep-start" type="time" className="rounded-full" />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="sleep-end">Wake Time</Label>
                          <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4 text-muted-foreground" />
                            <Input id="sleep-end" type="time" className="rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="sleep-quality">Sleep Quality</Label>
                        <Select>
                          <SelectTrigger id="sleep-quality" className="rounded-full">
                            <SelectValue placeholder="How well did you sleep?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="terrible">Terrible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="supplements">Supplements Taken</Label>
                        <Select>
                          <SelectTrigger id="supplements" className="rounded-full">
                            <SelectValue placeholder="Did you take any supplements?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-bad-days">No Bad Days</SelectItem>
                            <SelectItem value="no-bad-nights">No Bad Nights</SelectItem>
                            <SelectItem value="other">Other supplements</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          placeholder="Any other details about your sleep..."
                          className="rounded-full"
                        />
                      </div>

                      <Button className="w-full rounded-full">Save Sleep Log</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold">Sleep History</CardTitle>
                      <CardDescription>Your recent sleep patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">September 29, 2025</p>
                              <p className="text-sm text-muted-foreground">7.5 hours</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Good</p>
                              <p className="text-xs text-muted-foreground">11:00 PM - 6:30 AM</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">September 28, 2025</p>
                              <p className="text-sm text-muted-foreground">6.5 hours</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Fair</p>
                              <p className="text-xs text-muted-foreground">12:00 AM - 6:30 AM</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">September 27, 2025</p>
                              <p className="text-sm text-muted-foreground">8 hours</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Excellent</p>
                              <p className="text-xs text-muted-foreground">10:30 PM - 6:30 AM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="exercise">
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold">Log Exercise</CardTitle>
                      <CardDescription>Track your physical activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exercise-date">Date</Label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Input id="exercise-date" type="date" className="rounded-full" />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="exercise-type">Activity Type</Label>
                        <Select>
                          <SelectTrigger id="exercise-type" className="rounded-full">
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cardio">Cardio (Running, Cycling, etc.)</SelectItem>
                            <SelectItem value="strength">Strength Training</SelectItem>
                            <SelectItem value="yoga">Yoga/Stretching</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="walking">Walking</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="exercise-duration">Duration</Label>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="exercise-duration"
                              type="number"
                              placeholder="Minutes"
                              className="rounded-full"
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="exercise-intensity">Intensity</Label>
                          <Select>
                            <SelectTrigger id="exercise-intensity" className="rounded-full">
                              <SelectValue placeholder="Intensity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="vigorous">Vigorous</SelectItem>
                              <SelectItem value="max">Maximum Effort</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="exercise-notes">Notes</Label>
                        <Input
                          id="exercise-notes"
                          placeholder="Any other details about your workout..."
                          className="rounded-full"
                        />
                      </div>

                      <Button className="w-full rounded-full">Save Exercise Log</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold">Exercise History</CardTitle>
                      <CardDescription>Your recent physical activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Strength Training</p>
                              <p className="text-sm text-muted-foreground">45 minutes, Moderate</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">September 28, 2025</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Running</p>
                              <p className="text-sm text-muted-foreground">30 minutes, Vigorous</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">September 26, 2025</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Yoga</p>
                              <p className="text-sm text-muted-foreground">60 minutes, Light</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">September 24, 2025</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="breaks">
                <div className="grid gap-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold">Substance Breaks</CardTitle>
                      <CardDescription>Track periods of abstinence to improve recovery</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Alcohol</span>
                              <span className="text-green-600 text-sm">12 days</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Current break started on Sep 18</div>
                            <div className="mt-2 text-xs text-green-600">+8 points to harm score</div>
                            <Button variant="outline" size="sm" className="w-full mt-3 rounded-full">
                              End Break
                            </Button>
                          </div>

                          <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Cannabis</span>
                              <span className="text-green-600 text-sm">5 days</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Current break started on Sep 25</div>
                            <div className="mt-2 text-xs text-green-600">+4 points to harm score</div>
                            <Button variant="outline" size="sm" className="w-full mt-3 rounded-full">
                              End Break
                            </Button>
                          </div>

                          <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">MDMA</span>
                              <span className="text-green-600 text-sm">30+ days</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Last use was Aug 30</div>
                            <div className="mt-2 text-xs text-green-600">+10 points to harm score</div>
                            <Button variant="outline" size="sm" className="w-full mt-3 rounded-full">
                              End Break
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-xl border p-4">
                          <h3 className="text-lg font-medium mb-4">Start a New Break</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                              <Label htmlFor="break-substance">Substance</Label>
                              <Select>
                                <SelectTrigger id="break-substance" className="rounded-full">
                                  <SelectValue placeholder="Select substance" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="alcohol">Alcohol</SelectItem>
                                  <SelectItem value="cannabis">Cannabis</SelectItem>
                                  <SelectItem value="mdma">MDMA</SelectItem>
                                  <SelectItem value="ketamine">Ketamine</SelectItem>
                                  <SelectItem value="psychedelics">Psychedelics</SelectItem>
                                  <SelectItem value="all">All Substances</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="break-start">Start Date</Label>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input id="break-start" type="date" className="rounded-full" />
                              </div>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="break-goal">Goal Duration</Label>
                              <Select>
                                <SelectTrigger id="break-goal" className="rounded-full">
                                  <SelectValue placeholder="Select goal" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1w">1 Week</SelectItem>
                                  <SelectItem value="2w">2 Weeks</SelectItem>
                                  <SelectItem value="1m">1 Month</SelectItem>
                                  <SelectItem value="3m">3 Months</SelectItem>
                                  <SelectItem value="indefinite">Indefinite</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="break-notes">Notes</Label>
                              <Input
                                id="break-notes"
                                placeholder="Why are you taking this break?"
                                className="rounded-full"
                              />
                            </div>
                          </div>

                          <Button className="w-full mt-4 rounded-full">Start Break</Button>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Break History</h3>
                          <div className="space-y-3">
                            <div className="rounded-xl border p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Alcohol</p>
                                  <p className="text-sm text-muted-foreground">14 days (Aug 1 - Aug 15)</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-600">Completed</p>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">All Substances</p>
                                  <p className="text-sm text-muted-foreground">21 days (Jul 1 - Jul 22)</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-600">Completed</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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

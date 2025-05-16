"use client"

import { TabsContent } from "@/components/ui/tabs"
import { DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Beer, Brain, LineChart, Pill, Shield, Sparkles, Zap } from "lucide-react"
import { SubstanceLogDialog } from "./substance-log-dialog"
import { getSubstanceLogs } from "@/app/actions/substance-log-actions"
import { useRouter } from "next/navigation"

export function WelcomeExperience() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [hasLogs, setHasLogs] = useState(false)
  const [showAccountPrompt, setShowAccountPrompt] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has seen welcome screen before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    if (hasSeenWelcome) {
      setShowWelcome(false)
    }

    // Check if user has any logs
    const checkLogs = async () => {
      try {
        const logs = await getSubstanceLogs()
        setHasLogs(logs.length > 0)

        // If user has exactly one log and hasn't been prompted for account creation
        if (logs.length === 1 && !localStorage.getItem("hasBeenPromptedForAccount")) {
          setShowAccountPrompt(true)
        }
      } catch (error) {
        console.error("Error checking logs:", error)
      }
    }

    checkLogs()

    // Listen for substance log added event
    const handleLogAdded = () => {
      // Close welcome dialog when first log is added
      localStorage.setItem("hasSeenWelcome", "true")
      setShowWelcome(false)
      checkLogs() // Refresh logs
    }

    window.addEventListener("substance-log-added", handleLogAdded)

    return () => {
      window.removeEventListener("substance-log-added", handleLogAdded)
    }
  }, [])

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true")
    setShowWelcome(false)
  }

  const handleCloseAccountPrompt = () => {
    localStorage.setItem("hasBeenPromptedForAccount", "true")
    setShowAccountPrompt(false)
  }

  const handleCreateAccount = () => {
    localStorage.setItem("hasBeenPromptedForAccount", "true")
    router.push("/auth/register")
  }

  if (!showWelcome && !showAccountPrompt) return null

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 shadow-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center w-full">
                Welcome to No Bad Days Tracker
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 rounded-full p-2 h-8 w-8"
                onClick={handleCloseWelcome}
              >
                ✕
              </Button>
            </div>
            <DialogDescription className="text-center">
              Track your substance use, understand your patterns, and get personalized recommendations
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="how-it-works" className="mt-4">
            <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm bg-amber-100 p-1 rounded-full">
              <TabsTrigger
                value="how-it-works"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                How It Works
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Benefits
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="how-it-works" className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-none bg-amber-50 rounded-xl">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-200 mx-auto mb-2">
                      <Beer className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center text-base font-medium">Log Your Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm px-4 pb-4">
                    Record what substances you use, how much, and how you feel during and after
                  </CardContent>
                </Card>

                <Card className="border-none bg-amber-50 rounded-xl">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-200 mx-auto mb-2">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center text-base font-medium">Track Your Patterns</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm px-4 pb-4">
                    See how your usage affects your harm index and identify patterns over time
                  </CardContent>
                </Card>

                <Card className="border-none bg-amber-50 rounded-xl">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-200 mx-auto mb-2">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center text-base font-medium">Get Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm px-4 pb-4">
                    Receive personalized recommendations to reduce harm and improve your wellness
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <SubstanceLogDialog />
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Understand Your Patterns</h3>
                    <p className="text-sm text-muted-foreground">
                      Identify how different substances affect your mood, sleep, and overall wellness
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                    <Pill className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Reduce Potential Harm</h3>
                    <p className="text-sm text-muted-foreground">
                      Get evidence-based recommendations to minimize negative effects of substance use
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Track Your Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      See how changes in your habits improve your harm index score over time
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Private and Secure</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is private and secure - use with just a username or add email for more features
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-amber-50">
                  <h3 className="text-base font-medium mb-2">Your Privacy Matters</h3>
                  <p className="text-sm text-muted-foreground">
                    We take your privacy seriously. You can use No Bad Days Tracker with just a username and password -
                    no email required.
                  </p>
                </div>

                <div className="rounded-lg border p-4 bg-amber-50">
                  <h3 className="text-base font-medium mb-2">Optional Email Benefits</h3>
                  <p className="text-sm text-muted-foreground">
                    Adding an email is optional but allows you to reset your password, receive exclusive newsletter
                    content, and get early access to new features.
                  </p>
                </div>

                <div className="rounded-lg border p-4 bg-amber-50">
                  <h3 className="text-base font-medium mb-2">Data Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and stored securely. We never share your personal information with third
                    parties.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseWelcome} className="w-full sm:flex-1 rounded-full">
              Skip for Now
            </Button>
            <Button
              onClick={handleCloseWelcome}
              className="w-full sm:flex-1 bg-amber-300 text-foreground hover:bg-amber-400 rounded-full"
            >
              Get Started
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Creation Prompt */}
      <Dialog open={showAccountPrompt} onOpenChange={setShowAccountPrompt}>
        <DialogContent className="sm:max-w-[500px] max-w-[95%] max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl w-full">Create a Free Account</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 rounded-full p-2 h-8 w-8"
                onClick={handleCloseAccountPrompt}
              >
                ✕
              </Button>
            </div>
            <DialogDescription>Save your progress and unlock all features by creating a free account</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4 bg-amber-50">
              <h3 className="font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Your first log has been saved!
              </h3>
              <p className="text-sm text-muted-foreground">
                Create a free account to continue tracking your substance use and get personalized insights.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                  <Shield className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Privacy-focused:</span> Use with just a username
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                  <LineChart className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Track progress:</span> See your harm index improve over time
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 mt-0.5">
                  <Brain className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Personalized insights:</span> Get recommendations based on your data
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseAccountPrompt} className="w-full sm:flex-1 rounded-full">
              Later
            </Button>
            <Button
              onClick={handleCreateAccount}
              className="w-full sm:flex-1 bg-amber-300 hover:bg-amber-400 text-foreground rounded-full"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

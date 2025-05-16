"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Beer, Wine, CoffeeIcon as Cocktail, Cannabis, Pill, Zap, Cigarette, Coffee, X } from "lucide-react"
import { AtomicIcon, KetamineIcon } from "./substance-icons"
import { SubstanceTips } from "@/components/substance-tips"
import { subDays } from "date-fns"
import { getSubstanceInsights } from "@/lib/substance-insights"

interface SubstanceLogButtonProps {
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function SubstanceLogButton({
  variant = "default",
  size = "default",
  className,
  children,
}: SubstanceLogButtonProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("substance")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [loggedSubstance, setLoggedSubstance] = useState("")
  const [loggedSubstanceSubtype, setLoggedSubstanceSubtype] = useState("")
  const [substanceInsights, setSubstanceInsights] = useState<any[]>([])

  // Form state
  const [substanceType, setSubstanceType] = useState("alcohol")
  const [substanceSubtype, setSubstanceSubtype] = useState("")
  const [amount, setAmount] = useState<number[]>([2])
  const [context, setContext] = useState("social-small")
  const [supplements, setSupplements] = useState<string[]>([])
  const [supplementInput, setSupplementInput] = useState("")
  const [notes, setNotes] = useState("")
  const [feelingDuring, setFeelingDuring] = useState<number[]>([5])
  const [feelingAfter, setFeelingAfter] = useState<number[]>([5])
  const [notesDuring, setNotesDuring] = useState("")
  const [notesAfter, setNotesAfter] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [harmPoints, setHarmPoints] = useState(0)

  // Update the resetForm function to reset the tips state
  const resetForm = useCallback(() => {
    setSubstanceType("alcohol")
    setSubstanceSubtype("")
    setAmount([2])
    setContext("social-small")
    setSupplements([])
    setSupplementInput("")
    setNotes("")
    setFeelingDuring([5])
    setFeelingAfter([5])
    setNotesDuring("")
    setNotesAfter("")
    setActiveTab("substance")
    setShowTips(false)
    setLoggedSubstance("")
    setLoggedSubstanceSubtype("")
    setSubstanceInsights([])

    const now = new Date()
    setDate(now.toISOString().split("T")[0])
    setTime(now.toTimeString().slice(0, 5))
  }, [])

  // Set today's date and current time as defaults
  useEffect(() => {
    const now = new Date()
    setDate(now.toISOString().split("T")[0])
    setTime(now.toTimeString().slice(0, 5))
  }, [])

  // Calculate harm points whenever substance type, subtype, or amount changes
  useEffect(() => {
    if (substanceType && amount[0]) {
      // Calculate harm points based on substance type, subtype, and amount
      let points = 0

      switch (substanceType) {
        case "alcohol":
          // Base points: 1 point per standard drink
          points = amount[0]
          break
        case "cannabis":
          if (substanceSubtype === "edible") {
            // 2.5 points per 50mg
            points = (amount[0] / 50) * 2.5
          } else {
            // 1 point per 5 puffs
            points = amount[0] / 5
          }
          break
        case "psychedelics":
          if (substanceSubtype === "ketamine") {
            // 5 points per 50mg
            points = (amount[0] / 50) * 5
          } else if (substanceSubtype === "mdma") {
            // 5 points per 100mg
            points = (amount[0] / 100) * 5
          } else {
            // LSD, psilocybin: 5 points per dose
            points = amount[0] * 5
          }
          break
        case "stimulants":
          if (substanceSubtype === "nicotine") {
            // 0.5 points per cigarette
            points = amount[0] * 0.5
          } else if (substanceSubtype === "caffeine") {
            // 0.1 points per 100mg
            points = (amount[0] / 100) * 0.1
          } else if (substanceSubtype === "cocaine") {
            // 5 points per 100mg
            points = (amount[0] / 100) * 5
          } else {
            // Prescription: 3 points per dose
            points = amount[0] * 3
          }
          break
        default:
          points = amount[0]
      }

      // Apply context multiplier
      if (context === "social-party") {
        points *= 1.2 // 20% increase for party context
      } else if (context === "solo") {
        points *= 1.5 // 50% increase for solo use
      }

      setHarmPoints(Math.round(points * 10) / 10) // Round to 1 decimal place
    }
  }, [substanceType, substanceSubtype, amount, context])

  // Function to add a supplement
  const addSupplement = () => {
    if (supplementInput && !supplements.includes(supplementInput)) {
      setSupplements([...supplements, supplementInput])
      setSupplementInput("")
    }
  }

  // Function to remove a supplement
  const removeSupplement = (supplement: string) => {
    setSupplements(supplements.filter((s) => s !== supplement))
  }

  // Function to set date to specific times
  const setDateToLastNight = useCallback(() => {
    const lastNight = subDays(new Date(), 1)
    setDate(lastNight.toISOString().split("T")[0])
    setTime("21:00") // 9:00 PM
  }, [])

  const setDateToLastFriday = useCallback(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSubtract = (dayOfWeek + 2) % 7 || 7 // Calculate days to last Friday
    const lastFriday = subDays(today, daysToSubtract)
    setDate(lastFriday.toISOString().split("T")[0])
    setTime("20:00") // 8:00 PM
  }, [])

  const setDateToLastSaturday = useCallback(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSubtract = (dayOfWeek + 1) % 7 || 7 // Calculate days to last Saturday
    const lastSaturday = subDays(today, daysToSubtract)
    setDate(lastSaturday.toISOString().split("T")[0])
    setTime("20:00") // 8:00 PM
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check if this is the first log
      const existingLogsString = localStorage.getItem("substanceLogs")
      const existingLogs = existingLogsString ? JSON.parse(existingLogsString) : []
      const isFirstLog = existingLogs.length === 0

      // Create a simple log object
      const log = {
        id: `log-${Date.now()}`,
        substance_type: substanceType,
        substance_subtype: substanceSubtype,
        amount: amount[0].toString(), // Store the numeric value as a string
        date: new Date(`${date}T${time}`).toISOString(),
        context,
        supplements,
        notes,
        feeling_during: feelingDuring[0],
        feeling_after: feelingAfter[0],
        notes_during: notesDuring,
        notes_after: notesAfter,
        harm_points: harmPoints, // Save the calculated harm points
      }

      // Save to localStorage
      localStorage.setItem("substanceLogs", JSON.stringify([log, ...existingLogs]))

      // Also save to standalone_substance_logs for the chart
      const standaloneLogsString = localStorage.getItem("standalone_substance_logs")
      const standaloneLogs = standaloneLogsString ? JSON.parse(standaloneLogsString) : []
      localStorage.setItem("standalone_substance_logs", JSON.stringify([log, ...standaloneLogs]))

      // If this is the first log, close the welcome dialog
      if (isFirstLog) {
        localStorage.setItem("hasSeenWelcome", "true")
      }

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event("substance-log-added"))

      // Dispatch a custom event to notify other components that data has changed
      window.dispatchEvent(new CustomEvent("substance-logs-updated"))

      toast({
        title: "Success",
        description: "Substance log saved successfully",
      })

      // Set the logged substance and show tips
      setLoggedSubstance(substanceType)
      setLoggedSubstanceSubtype(substanceSubtype)

      // Get substance-specific insights
      const insights = getSubstanceInsights(substanceType, substanceSubtype, 3)
      setSubstanceInsights(insights)

      // Show tips
      setShowTips(true)

      // Don't close the dialog yet - we'll show tips first
      setActiveTab("tips")
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error saving log:", error)
      toast({
        title: "Error",
        description: "Failed to save log. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Add a function to handle closing the tips and dialog
  const handleCloseTips = useCallback(() => {
    setShowTips(false)
    setOpen(false)
    resetForm()
  }, [resetForm])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    },
    [resetForm],
  )

  // Get subtypes based on substance type
  const getSubtypes = () => {
    switch (substanceType) {
      case "alcohol":
        return [
          { value: "beer", label: "Beer", icon: <Beer className="h-4 w-4" /> },
          { value: "wine", label: "Wine", icon: <Wine className="h-4 w-4" /> },
          { value: "liquor", label: "Liquor", icon: <Cocktail className="h-4 w-4" /> },
        ]
      case "cannabis":
        return [
          { value: "smoked", label: "Smoked", icon: <Cannabis className="h-4 w-4" /> },
          { value: "edible", label: "Edible", icon: <Pill className="h-4 w-4" /> },
        ]
      case "psychedelics":
        return [
          { value: "lsd", label: "LSD", icon: <AtomicIcon className="h-4 w-4" /> },
          { value: "psilocybin", label: "Psilocybin", icon: <AtomicIcon className="h-4 w-4" /> },
          { value: "ketamine", label: "Ketamine", icon: <KetamineIcon className="h-4 w-4" /> },
          { value: "mdma", label: "MDMA", icon: <Pill className="h-4 w-4" /> },
        ]
      case "stimulants":
        return [
          { value: "nicotine", label: "Nicotine", icon: <Cigarette className="h-4 w-4" /> },
          { value: "caffeine", label: "Caffeine", icon: <Coffee className="h-4 w-4" /> },
          { value: "prescription", label: "Prescription", icon: <Pill className="h-4 w-4" /> },
          { value: "cocaine", label: "Cocaine", icon: <Zap className="h-4 w-4" /> },
        ]
      default:
        return []
    }
  }

  // Get max amount for slider based on substance type and subtype
  const getMaxAmount = () => {
    switch (substanceType) {
      case "alcohol":
        if (substanceSubtype === "beer") return 12 // Max 12 beers
        if (substanceSubtype === "wine") return 8 // Max 8 glasses of wine
        if (substanceSubtype === "liquor") return 8 // Max 8 shots
        return 12 // Default for alcohol
      case "cannabis":
        return substanceSubtype === "edible" ? 100 : 20 // Max 100mg for edibles, 20 puffs for smoked
      case "psychedelics":
        if (substanceSubtype === "ketamine") return 200 // Max 200mg for ketamine
        if (substanceSubtype === "mdma") return 200 // Max 200mg for MDMA
        return 3 // Max 3 doses for LSD/psilocybin
      case "stimulants":
        if (substanceSubtype === "nicotine") return 20 // Max 20 cigarettes
        if (substanceSubtype === "caffeine") return 500 // Max 500mg caffeine
        if (substanceSubtype === "cocaine") return 500 // Max 500mg cocaine
        return 5 // Max 5 doses for prescription stimulants
      default:
        return 10
    }
  }

  // Get step size for slider based on substance type and subtype
  const getStepSize = () => {
    switch (substanceType) {
      case "alcohol":
        return 0.5 // 0.5 drink increments
      case "cannabis":
        return substanceSubtype === "edible" ? 5 : 1 // 5mg for edibles, 1 puff for smoked
      case "psychedelics":
        if (substanceSubtype === "ketamine") return 10 // 10mg increments for ketamine
        if (substanceSubtype === "mdma") return 10 // 10mg increments for MDMA
        return 0.5 // 0.5 dose increments for LSD/psilocybin
      case "stimulants":
        if (substanceSubtype === "nicotine") return 1 // 1 cigarette increments
        if (substanceSubtype === "caffeine") return 25 // 25mg increments for caffeine
        if (substanceSubtype === "cocaine") return 25 // 25mg increments for cocaine
        return 0.5 // 0.5 dose increments for prescription stimulants
      default:
        return 1
    }
  }

  // Get amount unit based on substance type and subtype
  const getAmountUnit = () => {
    switch (substanceType) {
      case "alcohol":
        if (substanceSubtype === "beer") return "drinks (12oz)"
        if (substanceSubtype === "wine") return "drinks (5oz)"
        if (substanceSubtype === "liquor") return "drinks (1.5oz)"
        return "drinks"
      case "cannabis":
        return substanceSubtype === "edible" ? "mg" : "puffs"
      case "psychedelics":
        if (substanceSubtype === "ketamine") return "mg"
        if (substanceSubtype === "mdma") return "mg"
        return "doses"
      case "stimulants":
        if (substanceSubtype === "nicotine") return "cigarettes"
        if (substanceSubtype === "caffeine") return "mg"
        if (substanceSubtype === "cocaine") return "mg"
        return "doses"
      default:
        return "units"
    }
  }

  // Get emoji for feeling rating
  const getFeelingEmoji = (rating: number) => {
    if (rating <= 2) return "😞"
    if (rating <= 4) return "😕"
    if (rating <= 6) return "😐"
    if (rating <= 8) return "🙂"
    return "😄"
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={variant} size={size} className={className}>
        {children || (
          <>
            <PlusCircle className="h-4 w-4 mr-1" />
            Log Substance
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Log Substance Usage</DialogTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full absolute right-4 top-4"
                  onClick={() => setOpen(false)}
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription>Record what you used and how much.</DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="substance">Substance</TabsTrigger>
                <TabsTrigger value="context">Context</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="tips" disabled={!showTips}>
                  Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="substance" className="space-y-4 py-4">
                <div className="grid gap-4">
                  {/* Substance Type Selection with Icons */}
                  <div className="grid gap-2">
                    <Label>Substance Type</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        type="button"
                        variant={substanceType === "alcohol" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 p-2"
                        onClick={() => {
                          setSubstanceType("alcohol")
                          setSubstanceSubtype("")
                        }}
                      >
                        <Beer className="h-8 w-8 mb-1" />
                        <span className="text-xs">Alcohol</span>
                      </Button>

                      <Button
                        type="button"
                        variant={substanceType === "cannabis" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 p-2"
                        onClick={() => {
                          setSubstanceType("cannabis")
                          setSubstanceSubtype("")
                        }}
                      >
                        <Cannabis className="h-8 w-8 mb-1" />
                        <span className="text-xs">Cannabis</span>
                      </Button>

                      <Button
                        type="button"
                        variant={substanceType === "psychedelics" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 p-2"
                        onClick={() => {
                          setSubstanceType("psychedelics")
                          setSubstanceSubtype("")
                        }}
                      >
                        <AtomicIcon className="h-8 w-8 mb-1" />
                        <span className="text-xs">Psychedelics</span>
                      </Button>

                      <Button
                        type="button"
                        variant={substanceType === "stimulants" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 p-2"
                        onClick={() => {
                          setSubstanceType("stimulants")
                          setSubstanceSubtype("")
                        }}
                      >
                        <Zap className="h-8 w-8 mb-1" />
                        <span className="text-xs">Stimulants</span>
                      </Button>
                    </div>
                  </div>

                  {/* Substance Subtype Selection with Rounded Buttons */}
                  {getSubtypes().length > 0 && (
                    <div className="grid gap-2">
                      <Label>Subtype</Label>
                      <div className="flex flex-wrap gap-2">
                        {getSubtypes().map((subtype) => (
                          <Button
                            key={subtype.value}
                            type="button"
                            variant={substanceSubtype === subtype.value ? "default" : "outline"}
                            size="sm"
                            className="rounded-full flex items-center gap-1"
                            onClick={() => setSubstanceSubtype(subtype.value)}
                          >
                            {subtype.icon}
                            <span>{subtype.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <Label htmlFor="amount">Amount</Label>
                      <span className="text-sm">
                        {amount[0]} {getAmountUnit()}{" "}
                        <span className="text-orange-500 font-medium">+{harmPoints} points</span>
                      </span>
                    </div>
                    <Slider
                      id="amount"
                      value={amount}
                      onValueChange={setAmount}
                      min={0}
                      max={getMaxAmount()}
                      step={getStepSize()}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 {getAmountUnit()}</span>
                      <span>
                        {getMaxAmount()} {getAmountUnit()}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Date & Time</Label>
                      <div className="flex gap-2 text-xs">
                        <button type="button" onClick={setDateToLastNight} className="text-blue-600 hover:underline">
                          Last night
                        </button>
                        <button type="button" onClick={setDateToLastFriday} className="text-blue-600 hover:underline">
                          Last Friday
                        </button>
                        <button type="button" onClick={setDateToLastSaturday} className="text-blue-600 hover:underline">
                          Last Saturday
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                      <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab("context")}>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="context" className="space-y-4 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="context">Context</Label>
                    <Select value={context} onValueChange={setContext}>
                      <SelectTrigger id="context">
                        <SelectValue placeholder="Select context" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social-small">Small Social Gathering</SelectItem>
                        <SelectItem value="social-party">Party / Large Event</SelectItem>
                        <SelectItem value="solo">Solo / Alone</SelectItem>
                        <SelectItem value="therapeutic">Therapeutic / Medical</SelectItem>
                        <SelectItem value="work">Work Related</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Supplements Taken (Optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={supplementInput}
                        onChange={(e) => setSupplementInput(e.target.value)}
                        placeholder="e.g., No Bad Days, Vitamin C"
                      />
                      <Button type="button" onClick={addSupplement} className="shrink-0">
                        Add
                      </Button>
                    </div>

                    {supplements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {supplements.map((supplement) => (
                          <div key={supplement} className="flex items-center bg-secondary rounded-full px-3 py-1">
                            <span className="text-sm">{supplement}</span>
                            <button
                              type="button"
                              onClick={() => removeSupplement(supplement)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any other details you want to record"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("substance")}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("experience")}>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>How did you feel during use?</Label>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">{getFeelingEmoji(feelingDuring[0])}</div>
                      <Slider
                        value={feelingDuring}
                        onValueChange={setFeelingDuring}
                        min={0}
                        max={10}
                        step={1}
                        className="w-full max-w-md"
                      />
                      <div className="flex justify-between w-full max-w-md mt-1 text-xs text-muted-foreground">
                        <span>Terrible</span>
                        <span>Neutral</span>
                        <span>Great</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes-during">Notes During Use (Optional)</Label>
                    <Textarea
                      id="notes-during"
                      value={notesDuring}
                      onChange={(e) => setNotesDuring(e.target.value)}
                      placeholder="How did you feel? Any effects worth noting?"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>How did you feel after use?</Label>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">{getFeelingEmoji(feelingAfter[0])}</div>
                      <Slider
                        value={feelingAfter}
                        onValueChange={setFeelingAfter}
                        min={0}
                        max={10}
                        step={1}
                        className="w-full max-w-md"
                      />
                      <div className="flex justify-between w-full max-w-md mt-1 text-xs text-muted-foreground">
                        <span>Terrible</span>
                        <span>Neutral</span>
                        <span>Great</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes-after">Notes After Use (Optional)</Label>
                    <Textarea
                      id="notes-after"
                      value={notesAfter}
                      onChange={(e) => setNotesAfter(e.target.value)}
                      placeholder="How did you feel afterward? Any hangover or aftereffects?"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("context")}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Log"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="space-y-4 py-4">
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium text-center">Substance-Specific Tips</h3>

                  {/* Display substance-specific insights */}
                  <div className="space-y-4">
                    {substanceInsights.map((insight, index) => (
                      <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">{insight.tip}</p>
                      </div>
                    ))}
                  </div>

                  {/* General harm reduction tips */}
                  <SubstanceTips substance={loggedSubstance} />

                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Remember, these tips are for harm reduction purposes only. The safest approach is always abstinence.
                  </p>

                  <div className="flex justify-center">
                    <Button onClick={handleCloseTips}>Close</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Log"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

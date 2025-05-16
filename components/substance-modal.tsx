"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { format, subDays } from "date-fns"
import { calculateHarmPoints } from "@/lib/harm-scale"
import { useLogsStore } from "@/lib/store/useLogsStore"
import { SubstanceIcon } from "@/components/substance-icons" // Updated import

// Substance types with their icons - using custom components for missing icons
const SUBSTANCE_TYPES = [
  { id: "alcohol", name: "Alcohol", icon: "Wine" },
  { id: "cannabis", name: "Cannabis", icon: "cannabis" }, // Use string identifier for our custom icon
  { id: "psychedelics", name: "Psychedelics", icon: "psychedelics" }, // Use string identifier for our custom icon
  { id: "stimulants", name: "Stimulants", icon: "Zap" },
]

// Substance subtypes - using custom components for missing icons
const SUBSTANCE_SUBTYPES = {
  alcohol: [
    { value: "beer", label: "Beer", icon: "Beer" },
    { value: "wine", label: "Wine", icon: "Wine" },
    { value: "liquor", label: "Liquor", icon: "Cocktail" },
  ],
  cannabis: [
    { value: "smoked", label: "Smoked", icon: "cannabis" }, // Use string identifier for our custom icon
    { value: "edible", label: "Edible", icon: "Cookie" },
  ],
  psychedelics: [
    { value: "lsd", label: "LSD", icon: "Sparkles" },
    { value: "psilocybin", label: "Psilocybin", icon: "Flower" },
    { value: "ketamine", label: "Ketamine", icon: "ketamine" }, // Use string identifier for our custom icon
    { value: "mdma", label: "MDMA", icon: "Pill" },
  ],
  stimulants: [
    { value: "nicotine", label: "Nicotine", icon: "Cigarette" },
    { value: "caffeine", label: "Caffeine", icon: "Coffee" },
    { value: "prescription", label: "Prescription", icon: "Pill" },
    { value: "cocaine", label: "Cocaine", icon: "Snowflake" },
  ],
}

// Context options
const CONTEXTS = [
  { value: "social-small", label: "Small Social Gathering" },
  { value: "social-party", label: "Party / Large Event" },
  { value: "solo", label: "Solo / Alone" },
  { value: "therapeutic", label: "Therapeutic / Medical" },
  { value: "work", label: "Work Related" },
  { value: "other", label: "Other" },
]

// Get max amount for slider based on substance type and subtype
function getMaxAmount(substanceType: string, substanceSubtype: string | null): number {
  switch (substanceType) {
    case "alcohol":
      return 12 // Max 12 drinks
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
function getStepSize(substanceType: string, substanceSubtype: string | null): number {
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
function getAmountUnit(substanceType: string, substanceSubtype: string | null): string {
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

interface SubstanceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubstanceModal({ isOpen, onClose }: SubstanceModalProps) {
  const [activeTab, setActiveTab] = useState("substance")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const addLog = useLogsStore((state) => state.add)

  // Form state
  const [substanceType, setSubstanceType] = useState("alcohol")
  const [substanceSubtype, setSubstanceSubtype] = useState("")
  const [amount, setAmount] = useState<number[]>([2])
  const [context, setContext] = useState("social-small")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [harmPoints, setHarmPoints] = useState(0)

  // Set today's date and current time as defaults
  useEffect(() => {
    const now = new Date()
    setDate(now.toISOString().split("T")[0])
    setTime(now.toTimeString().slice(0, 5))
  }, [])

  // Calculate harm points whenever substance type, subtype, or amount changes
  useEffect(() => {
    if (substanceType && amount[0]) {
      const points = calculateHarmPoints(substanceType, substanceSubtype, amount[0], context)
      setHarmPoints(points)
    }
  }, [substanceType, substanceSubtype, amount, context])

  // Reset form when dialog closes
  const resetForm = () => {
    setSubstanceType("alcohol")
    setSubstanceSubtype("")
    setAmount([2])
    setContext("social-small")
    setNotes("")
    setActiveTab("substance")

    const now = new Date()
    setDate(now.toISOString().split("T")[0])
    setTime(now.toTimeString().slice(0, 5))
  }

  // Function to set date to specific times
  const setDateToLastNight = () => {
    const lastNight = subDays(new Date(), 1)
    setDate(lastNight.toISOString().split("T")[0])
    setTime("21:00") // 9:00 PM
  }

  const setDateToYesterday = () => {
    const yesterday = subDays(new Date(), 1)
    setDate(yesterday.toISOString().split("T")[0])
    setTime(format(new Date(), "HH:mm"))
  }

  const setDateToLastWeekend = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSubtract = dayOfWeek === 0 ? 1 : dayOfWeek === 6 ? 0 : dayOfWeek + 1
    const lastWeekend = subDays(today, daysToSubtract)
    setDate(lastWeekend.toISOString().split("T")[0])
    setTime("20:00") // 8:00 PM
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a timestamp from date and time
      const timestamp = new Date(`${date}T${time}`).toISOString()

      // Get the icon for this substance
      const iconName = substanceSubtype
        ? SUBSTANCE_SUBTYPES[substanceType as keyof typeof SUBSTANCE_SUBTYPES]?.find(
            (s) => s.value === substanceSubtype,
          )?.icon || SUBSTANCE_TYPES.find((t) => t.id === substanceType)?.icon
        : SUBSTANCE_TYPES.find((t) => t.id === substanceType)?.icon

      // Add to the logs store
      addLog({
        type: "substance",
        name: substanceType,
        value: amount[0],
        createdAt: timestamp,
        details: {
          substance_subtype: substanceSubtype,
          context,
          notes,
          harm_points: harmPoints,
          icon: iconName, // Store the icon name for chart rendering
        },
      })

      // For backward compatibility, also save to localStorage in the old format
      try {
        const existingLogsString = localStorage.getItem("standalone_substance_logs")
        const existingLogs = existingLogsString ? JSON.parse(existingLogsString) : []

        const legacyLog = {
          id: `log-${Date.now()}`,
          substance_type: substanceType,
          substance_subtype: substanceSubtype,
          amount: amount[0].toString(),
          date: timestamp,
          context,
          notes,
          harm_points: harmPoints,
          icon: iconName, // Store the icon name for chart rendering
        }

        localStorage.setItem("standalone_substance_logs", JSON.stringify([legacyLog, ...existingLogs]))

        // Dispatch legacy events for backward compatibility
        window.dispatchEvent(new CustomEvent("substance-log-added", { detail: legacyLog }))
        window.dispatchEvent(new CustomEvent("substance-logs-updated"))
      } catch (error) {
        console.error("Error saving legacy log:", error)
      }

      toast({
        title: "Success",
        description: "Substance log saved successfully",
      })

      // Close the dialog
      onClose()
      resetForm()
    } catch (error) {
      console.error("Error saving log:", error)
      toast({
        title: "Error",
        description: "Failed to save log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Log Substance Use</DialogTitle>
          <DialogDescription>Record what you used and how much.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="substance">Substance</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="substance" className="space-y-4 py-2">
              {/* Substance Type Selection */}
              <div className="grid gap-2">
                <Label>Substance Type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SUBSTANCE_TYPES.map((type) => (
                    <Button
                      key={type.id}
                      type="button"
                      variant={substanceType === type.id ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 p-2"
                      onClick={() => {
                        setSubstanceType(type.id)
                        setSubstanceSubtype("")
                      }}
                    >
                      <SubstanceIcon name={type.icon} className="h-8 w-8 mb-1" />
                      <span className="text-xs">{type.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Substance Subtype Selection */}
              {SUBSTANCE_SUBTYPES[substanceType as keyof typeof SUBSTANCE_SUBTYPES]?.length > 0 && (
                <div className="grid gap-2">
                  <Label>Subtype</Label>
                  <div className="flex flex-wrap gap-2">
                    {SUBSTANCE_SUBTYPES[substanceType as keyof typeof SUBSTANCE_SUBTYPES].map((subtype) => (
                      <Button
                        key={subtype.value}
                        type="button"
                        variant={substanceSubtype === subtype.value ? "default" : "outline"}
                        size="sm"
                        className="rounded-full flex items-center gap-1"
                        onClick={() => setSubstanceSubtype(subtype.value)}
                      >
                        <SubstanceIcon name={subtype.icon} className="h-4 w-4" />
                        <span>{subtype.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount Slider */}
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Amount</Label>
                  <span className="text-sm">
                    {amount[0]} {getAmountUnit(substanceType, substanceSubtype)}{" "}
                    <span className="text-orange-500 font-medium">+{harmPoints.toFixed(2)} points</span>
                  </span>
                </div>
                <Slider
                  id="amount"
                  value={amount}
                  onValueChange={setAmount}
                  min={0}
                  max={getMaxAmount(substanceType, substanceSubtype)}
                  step={getStepSize(substanceType, substanceSubtype)}
                  className="py-4"
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("details")}>
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 py-2">
              {/* Context Selection */}
              <div className="grid gap-2">
                <Label htmlFor="context">Context</Label>
                <Select value={context} onValueChange={setContext}>
                  <SelectTrigger id="context" className="rounded-xl">
                    <SelectValue placeholder="Select context" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTEXTS.map((ctx) => (
                      <SelectItem key={ctx.value} value={ctx.value}>
                        {ctx.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Time */}
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Date & Time</Label>
                  <div className="flex gap-2 text-xs">
                    <button type="button" onClick={setDateToYesterday} className="text-brand hover:underline">
                      Yesterday
                    </button>
                    <button type="button" onClick={setDateToLastNight} className="text-brand hover:underline">
                      Last night
                    </button>
                    <button type="button" onClick={setDateToLastWeekend} className="text-brand hover:underline">
                      Weekend
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any other details you want to record"
                  className="rounded-xl"
                />
              </div>

              <div className="rounded-xl border p-4 bg-brand-soft">
                <div className="font-medium">Estimated Harm Points</div>
                <div className="mt-1 text-2xl font-bold">{harmPoints.toFixed(2)}</div>
                <div className="mt-1 text-sm text-muted-foreground">Based on substance type, amount, and context</div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("substance")}
                  className="rounded-xl"
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl">
                  {isSubmitting ? "Saving..." : "Save Log"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  )
}

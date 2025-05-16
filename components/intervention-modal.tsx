"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLogsStore } from "@/lib/store/useLogsStore"
import { Icon } from "@/components/ui/icon"

// Intervention types with their icons
const INTERVENTION_TYPES = [
  { value: "sleep", label: "Sleep", icon: "Moon" },
  { value: "exercise", label: "Exercise", icon: "Dumbbell" },
  { value: "meditation", label: "Meditation", icon: "Heart" },
  { value: "hydration", label: "Hydration", icon: "Droplets" },
  { value: "nutrition", label: "Nutrition", icon: "Apple" },
  { value: "abstinence", label: "Abstinence", icon: "ShieldCheck" },
  { value: "social", label: "Social Connection", icon: "Users" },
  { value: "therapy", label: "Therapy", icon: "HeartHandshake" },
  { value: "recovery", label: "Recovery", icon: "Leaf" },
]

interface InterventionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InterventionModal({ isOpen, onClose }: InterventionModalProps) {
  const [interventionType, setInterventionType] = useState("sleep")
  const [duration, setDuration] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [notes, setNotes] = useState("")
  const [quality, setQuality] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const addLog = useLogsStore((state) => state.add)

  const resetForm = () => {
    setInterventionType("sleep")
    setDuration("")
    setDate(new Date().toISOString().split("T")[0])
    setTime(new Date().toTimeString().slice(0, 5))
    setNotes("")
    setQuality(5)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const harmReduction = getHarmReduction(interventionType, duration)
      const timestamp = new Date(`${date}T${time}`).toISOString()

      // Get the icon for this intervention
      const iconName = INTERVENTION_TYPES.find((t) => t.value === interventionType)?.icon || "Heart"

      // Add to the logs store
      addLog({
        type: "intervention",
        name: interventionType,
        value: Number.parseFloat(duration) || 1,
        createdAt: timestamp,
        details: {
          quality,
          notes,
          harm_reduction: harmReduction,
          icon: iconName, // Store the icon name for chart rendering
        },
      })

      // For backward compatibility, also save to localStorage in the old format
      try {
        const existingLogs = localStorage.getItem("intervention_logs")
        const logs = existingLogs ? JSON.parse(existingLogs) : []

        const legacyLog = {
          id: `intervention-${Date.now()}`,
          intervention_type: interventionType,
          duration,
          date: timestamp,
          notes: notes || null,
          quality,
          harm_reduction: harmReduction,
          icon: iconName, // Store the icon name for chart rendering
        }

        logs.push(legacyLog)
        localStorage.setItem("intervention_logs", JSON.stringify(logs))

        // Dispatch legacy events for backward compatibility
        window.dispatchEvent(new Event("intervention-logs-updated"))
        window.dispatchEvent(new Event("harm-index-updated"))
      } catch (error) {
        console.error("Error saving legacy intervention log:", error)
      }

      toast({
        title: "Success",
        description: "Intervention log saved successfully",
      })

      resetForm()
      onClose()
    } catch (error) {
      console.error("Error saving intervention log:", error)
      toast({
        title: "Error",
        description: "Failed to save log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate harm reduction based on intervention type and duration
  const getHarmReduction = (type: string, duration: string): number => {
    switch (type) {
      case "sleep":
        return 3
      case "exercise":
        return 2
      case "meditation":
        return 1.5
      case "hydration":
        return 1
      case "nutrition":
        return 1
      case "abstinence":
        return 4
      case "social":
        return 1
      case "therapy":
        return 2.5
      case "recovery":
        return 1.5
      default:
        return 0
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Log Intervention</DialogTitle>
          <DialogDescription>Record activities that reduce harm.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="intervention-type">Intervention Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {INTERVENTION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={interventionType === type.value ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 p-2"
                  onClick={() => setInterventionType(type.value)}
                >
                  <Icon name={type.icon} className="h-8 w-8 mb-1" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration/Amount</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder={
                interventionType === "sleep"
                  ? "e.g., 8 hours"
                  : interventionType === "exercise"
                    ? "e.g., 30 minutes"
                    : "Amount"
              }
              required
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
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

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quality">Quality (1-10)</Label>
              <span>{quality}</span>
            </div>
            <Slider
              id="quality"
              min={1}
              max={10}
              step={1}
              value={[quality]}
              onValueChange={(value) => setQuality(value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this intervention"
              className="rounded-xl"
            />
          </div>

          <div className="rounded-xl border p-4 bg-green-50">
            <div className="font-medium">Estimated Harm Reduction</div>
            <div className="mt-1 text-2xl font-bold">{getHarmReduction(interventionType, duration).toFixed(2)}</div>
            <div className="mt-1 text-sm text-muted-foreground">Based on intervention type and duration</div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl">
              {isSubmitting ? "Saving..." : "Save Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

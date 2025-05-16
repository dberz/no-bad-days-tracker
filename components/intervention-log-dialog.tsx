"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"

interface InterventionLogDialogProps {
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function InterventionLogDialog({
  buttonVariant = "default",
  buttonSize = "default",
  className = "",
  children,
  open: externalOpen,
  onOpenChange,
}: InterventionLogDialogProps) {
  const [open, setOpen] = useState(externalOpen || false)

  // Sync with external open state
  useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen)
    }
  }, [externalOpen])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {children || (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Log Intervention
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Intervention Activity</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="intervention-type" className="text-right">
              Type
            </Label>
            <Select>
              <SelectTrigger id="intervention-type" className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="therapy">Therapy</SelectItem>
                <SelectItem value="supplements">Supplements</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input id="duration" placeholder="e.g., 30 minutes" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input id="date" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea id="notes" placeholder="Any additional details..." className="col-span-3" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleOpenChange(false)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

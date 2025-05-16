"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SubstanceLogModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Substance Usage</DialogTitle>
          <DialogDescription>
            Track your substance use to better understand your patterns and reduce harm.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="substance" className="text-right">
              Substance
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select substance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alcohol">Alcohol</SelectItem>
                <SelectItem value="cannabis">Cannabis</SelectItem>
                <SelectItem value="mdma">MDMA</SelectItem>
                <SelectItem value="ketamine">Ketamine</SelectItem>
                <SelectItem value="cocaine">Cocaine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input id="amount" placeholder="e.g. 2 drinks" className="col-span-3" />
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
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              alert("Substance usage logged!")
              setOpen(false)
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function openSubstanceLogModal() {
  // Create and dispatch a custom event
  const event = new CustomEvent("open-substance-log-modal")
  window.dispatchEvent(event)
}

"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Beer } from "lucide-react"

export function StyledLogButtons() {
  // Function to open substance log modal
  const openSubstanceLog = () => {
    const event = new CustomEvent("open-substance-log-modal")
    window.dispatchEvent(event)
  }

  // Function to open intervention log modal
  const openInterventionLog = () => {
    const event = new CustomEvent("open-intervention-log-modal")
    window.dispatchEvent(event)
  }

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={openSubstanceLog}
        className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-full shadow-md"
        size="lg"
      >
        <Beer className="h-5 w-5 mr-2" />
        Log Substance
      </Button>

      <Button
        onClick={openInterventionLog}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-md"
        size="lg"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Log Intervention
      </Button>
    </div>
  )
}

// Remove the floating buttons
export function FloatingLogButtons() {
  return null
}

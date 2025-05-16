"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function SimpleLogButtons() {
  // Function to open substance log dialog using the custom event
  const openSubstanceLogDialog = () => {
    const event = new CustomEvent("open-substance-log-dialog")
    window.dispatchEvent(event)
  }

  // Function to open intervention log dialog using the custom event
  const openInterventionLogDialog = () => {
    const event = new CustomEvent("open-intervention-log-dialog")
    window.dispatchEvent(event)
  }

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={openSubstanceLogDialog}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg"
        size="lg"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Log Substance
      </Button>
      <Button
        onClick={openInterventionLogDialog}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg"
        size="lg"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Log Intervention
      </Button>
    </div>
  )
}

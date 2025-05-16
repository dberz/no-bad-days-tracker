"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, X, Beer } from "lucide-react"
import { openSubstanceLogger } from "./substance-logger"

export function MobileFab() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleLogSubstance = () => {
    openSubstanceLogger()
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 items-end">
          <Button
            size="sm"
            className="rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
            onClick={handleLogSubstance}
          >
            <Beer className="h-4 w-4 mr-2" />
            Log Substance
          </Button>
        </div>
      )}

      <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={toggleOpen}>
        {isOpen ? <X className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { InterventionLogDialog } from "@/components/intervention-log-dialog"

interface InterventionLogButtonProps {
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function InterventionLogButton({
  variant = "outline",
  size = "default",
  className,
}: InterventionLogButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={variant} size={size} className={className}>
        <PlusCircle className="h-4 w-4 mr-1" />+ Intervention
      </Button>

      <InterventionLogDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

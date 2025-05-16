"use client"

import { useState } from "react"
import { PlusCircle, Activity, HeartPulse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubstanceLogDialog } from "@/components/substance-log-dialog"
import { InterventionLogDialog } from "@/components/intervention-log-dialog"

/** Single floating-action button that expands to our two log actions. */
export function LogFab() {
  const [open, setOpen] = useState<"none" | "substance" | "intervention">("none")

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open !== "none" && (
        <>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Log Substance"
            onClick={() => setOpen(open === "substance" ? "none" : "substance")}
          >
            <Activity className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Log Intervention"
            onClick={() => setOpen(open === "intervention" ? "none" : "intervention")}
          >
            <HeartPulse className="h-5 w-5" />
          </Button>
        </>
      )}

      <Button
        variant="default"
        size="icon"
        aria-label="Open log menu"
        onClick={() => setOpen(open === "none" ? "substance" : "none")}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>

      <SubstanceLogDialog open={open === "substance"} onOpenChange={(o) => setOpen(o ? "substance" : "none")} />
      <InterventionLogDialog
        open={open === "intervention"}
        onOpenChange={(o) => setOpen(o ? "intervention" : "none")}
      />
    </div>
  )
}

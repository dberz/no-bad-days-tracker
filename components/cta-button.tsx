"use client"

import { Button } from "@/components/ui/button"
import { Beer, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { SubstanceLogDialog } from "./substance-log-dialog"
import { InterventionLogDialog } from "./intervention-log-dialog"

interface CtaProps {
  type: "substance" | "intervention"
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
}

export function CtaButton({ type, className, variant = "default", size = "default", showIcon = true }: CtaProps) {
  return (
    <>
      {type === "substance" ? (
        <SubstanceLogDialog
          buttonVariant={variant}
          buttonSize={size}
          className={cn(
            "rounded-full",
            type === "substance" ? "bg-logButton text-black hover:bg-logButton/80" : "",
            className,
          )}
        >
          {showIcon && <Beer className="mr-2 h-4 w-4" />}
          Log Substance
        </SubstanceLogDialog>
      ) : (
        <InterventionLogDialog
          buttonVariant={variant}
          buttonSize={size}
          className={cn("rounded-full", className)}
        >
          {showIcon && <Heart className="mr-2 h-4 w-4" />}
          Log Intervention
        </InterventionLogDialog>
      )}
    </>
  )
}

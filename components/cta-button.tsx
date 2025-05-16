"use client"

import { Button } from "@/components/ui/button"
import { useModal } from "@/contexts/modal-context"
import { Beer, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface CtaProps {
  type: "substance" | "intervention"
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showIcon?: boolean
}

export function CtaButton({ type, className, variant = "default", size = "default", showIcon = true }: CtaProps) {
  const { open } = useModal()

  return (
    <Button
      onClick={() => open(type)}
      variant={variant}
      size={size}
      className={cn(
        "rounded-full",
        type === "substance" ? "bg-logButton text-black hover:bg-logButton/80" : "",
        className,
      )}
    >
      {showIcon && type === "substance" && <Beer className="mr-2 h-4 w-4" />}
      {showIcon && type === "intervention" && <Heart className="mr-2 h-4 w-4" />}
      {type === "substance" ? "Log Substance" : "Log Intervention"}
    </Button>
  )
}

"use client"

import { CtaButton } from "@/components/cta-button"
import { useMediaQuery } from "@/hooks/use-media-query"

export function CtaContainer() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex justify-around items-center p-4">
        <CtaButton type="substance" />
        <CtaButton type="intervention" />
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <CtaButton type="intervention" />
      <CtaButton type="substance" />
    </div>
  )
}

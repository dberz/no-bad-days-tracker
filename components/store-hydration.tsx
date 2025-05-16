"use client"

import { useEffect } from "react"
import { useLogsStore } from "@/lib/store/useLogsStore"

export function StoreHydration() {
  const hydrate = useLogsStore((state) => state.hydrate)

  useEffect(() => {
    // Hydrate the store on client-side
    hydrate()
  }, [hydrate])

  return null
}

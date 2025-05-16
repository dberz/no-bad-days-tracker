"use client"

import { DebugSubstanceLog } from "@/components/debug-substance-log"

export default function DebugPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>
      <DebugSubstanceLog />
    </div>
  )
}

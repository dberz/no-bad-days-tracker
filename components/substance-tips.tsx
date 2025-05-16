"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, X } from "lucide-react"
import { loadTips, type SubstanceTip, getTipsForSubstance, getRandomGeneralTip } from "@/lib/substance-tips"
import { Button } from "@/components/ui/button"

interface SubstanceTipsProps {
  substance?: string
  onClose?: () => void
  className?: string
}

export function SubstanceTips({ substance, onClose, className }: SubstanceTipsProps) {
  const [tips, setTips] = useState<SubstanceTip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTips() {
      setLoading(true)
      try {
        const allTips = await loadTips()

        if (substance) {
          // Get specific tips for this substance
          const substanceTips = getTipsForSubstance(allTips, substance, 2)
          setTips(substanceTips)
        } else {
          // Get a random general tip
          const generalTip = getRandomGeneralTip(allTips)
          setTips(generalTip ? [generalTip] : [])
        }
      } catch (error) {
        console.error("Error loading tips:", error)
        setTips([])
      } finally {
        setLoading(false)
      }
    }

    fetchTips()
  }, [substance])

  if (loading) {
    return (
      <Card className={`bg-amber-50 border-amber-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm">Loading tips...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tips.length === 0) {
    return null
  }

  return (
    <Card className={`bg-amber-50 border-amber-200 ${className}`}>
      <CardContent className="p-4 relative">
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0 rounded-full"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        <div className="space-y-3">
          {tips.map((tip) => (
            <div key={tip.id} className="flex">
              <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{tip.tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

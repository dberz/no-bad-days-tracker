import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Brain, Lightbulb } from "lucide-react"

interface InsightsCardProps {
  className?: string
}

export function InsightsCard({ className }: InsightsCardProps) {
  const insights = [
    {
      id: 1,
      title: "Sleep Impact",
      description: "You average 2 hours less sleep on nights you drink alcohol.",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Mood Pattern",
      description: "Your mood ratings are 30% lower the day after drinking more than 3 drinks.",
      icon: <Lightbulb className="h-4 w-4" />,
    },
  ]

  return (
    <Card className={cn("rounded-2xl shadow-nbd", className)}>
      <CardHeader className="bg-gradient-to-r from-nbdYellow/30 to-nbdYellow/10">
        <CardTitle>Personalized Insights</CardTitle>
        <CardDescription>What we've learned from your patterns</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-xl border p-4 hover:bg-nbdYellow/10 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nbdYellow">{insight.icon}</div>
                <h4 className="font-semibold">{insight.title}</h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

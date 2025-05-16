import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ExternalLink, Pill, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

interface RecommendationsCardProps {
  className?: string
}

export function RecommendationsCard({ className }: RecommendationsCardProps) {
  const recommendations = [
    {
      id: 1,
      title: "Take No Bad Days before drinking",
      description: "Helps protect your body from alcohol's effects",
      icon: <Pill className="h-4 w-4" />,
      link: "https://nobad.day/products/no-bad-days",
    },
    {
      id: 2,
      title: "Try a 3-day alcohol break",
      description: "Give your body time to recover and reset",
      icon: <Sparkles className="h-4 w-4" />,
      link: "/education/alcohol-breaks",
    },
    {
      id: 3,
      title: "Hydrate between drinks",
      description: "Reduces hangover symptoms and dehydration",
      icon: <Zap className="h-4 w-4" />,
      link: "/education/hydration",
    },
  ]

  return (
    <Card className={cn("rounded-2xl shadow-nbd", className)}>
      <CardHeader className="bg-gradient-to-r from-nbdYellow/30 to-nbdYellow/10">
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>Personalized suggestions to improve your wellness</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="rounded-xl border p-4 hover:bg-nbdYellow/10 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nbdYellow">
                  {recommendation.icon}
                </div>
                <h4 className="font-semibold">{recommendation.title}</h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{recommendation.description}</p>
              <div className="mt-3">
                <Link href={recommendation.link} className="inline-flex items-center text-xs text-primary">
                  Learn more
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full rounded-full">
          View All Recommendations
        </Button>
      </CardFooter>
    </Card>
  )
}

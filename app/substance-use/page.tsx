import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Beer, Cannabis, Coffee, Pill, PlusCircle } from "lucide-react"
import { MushroomIcon } from "@/components/substance-icons"
import { SubstanceLogButton } from "@/components/substance-log-button"
import { cn } from "@/lib/utils"

export default function SubstanceUsePage() {
  // Demo data - in a real app, this would come from an API or database
  const substances = [
    {
      name: "Alcohol",
      icon: Beer,
      usageCount: 24,
      lastUsed: "2 days ago",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      details: "Most commonly consumed as beer, wine, and spirits. Depressant that affects coordination and judgment.",
    },
    {
      name: "Cannabis",
      icon: Cannabis,
      usageCount: 12,
      lastUsed: "5 days ago",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      details: "Consumed by smoking, vaping, or as edibles. Effects include relaxation and altered perception.",
    },
    {
      name: "MDMA",
      icon: Pill,
      usageCount: 3,
      lastUsed: "30+ days ago",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      details: "Stimulant with psychedelic properties. Increases energy and emotional connection.",
    },
    {
      name: "Caffeine",
      icon: Coffee,
      usageCount: 120,
      lastUsed: "Today",
      color: "text-brown-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-900",
      details: "Most widely consumed psychoactive substance. Found in coffee, tea, and energy drinks.",
    },
    {
      name: "Psychedelics",
      icon: MushroomIcon,
      usageCount: 2,
      lastUsed: "60+ days ago",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      details: "Includes substances like mushrooms and LSD. Causes altered perception and cognition.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-14 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Substance Use Summary</h2>
          <SubstanceLogButton className="rounded-full bg-logButton text-black hover:bg-logButton/80">
            <PlusCircle className="h-4 w-4 mr-1" />
            Log New Use
          </SubstanceLogButton>
        </div>
        <p className="text-muted-foreground">View and manage your complete substance use history by substance type.</p>

        <Card>
          <CardHeader>
            <CardTitle>All Substances</CardTitle>
            <CardDescription>Your complete substance use summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {substances.map((substance) => (
                <div key={substance.name} className="space-y-2">
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4",
                      substance.borderColor,
                      substance.bgColor,
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full bg-white",
                          substance.textColor,
                        )}
                      >
                        <substance.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className={cn("font-medium text-lg", substance.textColor)}>{substance.name}</div>
                        <div className="text-sm text-muted-foreground">Last used: {substance.lastUsed}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-3xl font-bold", substance.textColor)}>{substance.usageCount}</div>
                      <div className="text-xs text-muted-foreground">Total uses</div>
                    </div>
                  </div>
                  <div className="px-4">
                    <p className="text-sm text-muted-foreground">{substance.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

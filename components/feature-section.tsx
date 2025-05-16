import { cn } from "@/lib/utils"
import { Brain, Heart, Shield, Sparkles } from "lucide-react"

export function FeatureSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Track, Learn, Reduce Harm</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-2">
            Our tracker helps you understand your patterns and make informed choices.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 flex flex-col items-center text-center bg-amber-50 rounded-xl">
            <div className="bg-amber-100 rounded-full p-3 mb-3">
              <Brain className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-medium text-base mb-1">Track Usage</h3>
            <p className="text-sm text-muted-foreground">Log what you use</p>
          </div>

          <div className="p-4 flex flex-col items-center text-center bg-green-50 rounded-xl">
            <div className="bg-green-100 rounded-full p-3 mb-3">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-medium text-base mb-1">Monitor Health</h3>
            <p className="text-sm text-muted-foreground">Track wellness</p>
          </div>

          <div className="p-4 flex flex-col items-center text-center bg-blue-50 rounded-xl">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-base mb-1">Get Insights</h3>
            <p className="text-sm text-muted-foreground">Personalized tips</p>
          </div>

          <div className="p-4 flex flex-col items-center text-center bg-purple-50 rounded-xl">
            <div className="bg-purple-100 rounded-full p-3 mb-3">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-base mb-1">Reduce Harm</h3>
            <p className="text-sm text-muted-foreground">Minimize risks</p>
          </div>
        </div>
      </div>
    </section>
  )
}

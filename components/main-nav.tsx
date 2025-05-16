import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <a
        href="https://nobad.day/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        NBD
      </a>
      <Link href="/activity" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Activity
      </Link>
      <Link
        href="/substance-use"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Substances
      </Link>
      <Link href="/insights" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Insights
      </Link>
    </nav>
  )
}

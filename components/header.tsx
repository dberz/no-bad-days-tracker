"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  // Don't show header on auth pages
  if (pathname.startsWith("/auth/")) {
    return null
  }

  // Only show the header text on the homepage
  const showHeaderText = pathname === "/"

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="sticky top-0 z-50 w-full border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-xl">No Bad Days</span>
              </Link>
            </div>
            <MainNav className="hidden md:flex" />
          </div>

          <div className="flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>

      {showHeaderText && (
        <div className="container py-8 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Social Substance Harm Tracker</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Track your substance use, understand your patterns, and make informed decisions about your health.
            </p>
          </div>
        </div>
      )}
    </header>
  )
}

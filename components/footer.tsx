"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on auth pages
  if (pathname.startsWith("/auth/")) {
    return null
  }

  return (
    <footer className="w-full border-t bg-background py-6 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link href="/" className="font-semibold">
            No Bad Days
          </Link>
          <nav className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} No Bad Days. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StoreHydration } from "@/components/store-hydration"
import { ModalProvider } from "@/contexts/modal-context"
import { ModalContainer } from "@/components/modal-container"
import { CtaContainer } from "@/components/cta-container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Substance Harm Tracker",
  description: "Track your substance use, understand your patterns, and make informed decisions about your health.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ModalProvider>
            <StoreHydration />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <ModalContainer />
            <CtaContainer />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

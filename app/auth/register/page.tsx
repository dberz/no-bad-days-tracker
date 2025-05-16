"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/app/actions/auth-actions"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("Password")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate a test username when the component mounts
  useEffect(() => {
    const generateTestUsername = async () => {
      try {
        // Try to get the last test user number from localStorage
        let lastNumber = 0
        const lastTestUserString = localStorage.getItem("lastTestUserNumber")
        if (lastTestUserString) {
          lastNumber = Number.parseInt(lastTestUserString, 10)
        }

        // Increment the number and generate a new username
        const newNumber = lastNumber + 1
        const newUsername = `TestUser${newNumber}`

        // Save the new username and update localStorage
        setUsername(newUsername)
        localStorage.setItem("lastTestUserNumber", newNumber.toString())
      } catch (error) {
        console.error("Error generating test username:", error)
        // Fallback to a random number if localStorage fails
        const randomNum = Math.floor(Math.random() * 10000)
        setUsername(`TestUser${randomNum}`)
      }
    }

    generateTestUsername()
  }, [])

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Check if we have any locally stored logs
      let localLogs = []
      try {
        const logsString = localStorage.getItem("substanceLogs")
        if (logsString) {
          localLogs = JSON.parse(logsString)
        }
      } catch (e) {
        console.error("Error parsing local logs:", e)
      }

      // Register the user
      const result = await registerUser(username, email, password)

      if (result.error) {
        setError(result.error)
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: result.error,
        })
      } else {
        // Success! Show a toast and redirect
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        })

        // If we have local logs, we should transfer them to the server
        // This would be implemented in a separate function
        if (localLogs.length > 0) {
          // For now, just clear the local logs
          localStorage.removeItem("substanceLogs")
        }

        // Redirect to the home page or onboarding
        router.push("/onboarding")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An unexpected error occurred. Please try again.")
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>

        {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
                placeholder="Username"
              />
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="Email address"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

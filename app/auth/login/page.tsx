"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { loginUser } from "@/app/actions/auth-actions"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (!username) {
      setError("Username is required")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)
      formData.append("remember", rememberMe.toString())

      const result = await loginUser(formData)

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
          variant: "success",
        })

        // Redirect to dashboard
        router.push("/")
      } else {
        setError(result.error || "Failed to log in")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="flex items-center text-lg font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <Shield className="mr-2 h-5 w-5" />
          No Bad Days
        </Link>
      </div>

      <Card className="w-full max-w-md rounded-xl border-primary/10 shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Log in to continue tracking your wellness journey
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username or Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button className="w-full group" type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-center max-w-md">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-4 w-4 text-primary mr-1" />
          <span className="text-sm font-medium">Secure Login</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your data is private and secure. We use industry-standard encryption to protect your personal information.
        </p>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertTriangle } from "lucide-react"
import {
  getUserProfile,
  updateUserProfile,
  updateUserAccount,
  changePassword,
  deleteAccount,
} from "@/app/actions/profile-actions"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Profile form state
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [healthConditions, setHealthConditions] = useState<string[]>([])
  const [psychiatricConditions, setPsychiatricConditions] = useState<string[]>([])

  // Account form state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDeletePassword, setConfirmDeletePassword] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile()
        setProfile(data)

        if (data) {
          // Set profile form state
          setAge(data.age?.toString() || "")
          setGender(data.gender || "")
          setHealthConditions(data.health_conditions || [])
          setPsychiatricConditions(data.psychiatric_conditions || [])

          // Set account form state
          setUsername(data.username || "")
          setEmail(data.email || "")
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [toast])

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setHealthConditions([...healthConditions, condition])
    } else {
      setHealthConditions(healthConditions.filter((c) => c !== condition))
    }
  }

  const handlePsychiatricConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setPsychiatricConditions([...psychiatricConditions, condition])
    } else {
      setPsychiatricConditions(psychiatricConditions.filter((c) => c !== condition))
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("age", age)
      formData.append("gender", gender)

      // Add health conditions
      healthConditions.forEach((condition) => {
        formData.append("healthConditions", condition)
      })

      // Add psychiatric conditions
      psychiatricConditions.forEach((condition) => {
        formData.append("psychiatricConditions", condition)
      })

      const result = await updateUserProfile(formData)

      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          variant: "success",
        })
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("email", email)

      const result = await updateUserAccount(formData)

      if (result.success) {
        toast({
          title: "Account updated",
          description: "Your account has been updated successfully.",
          variant: "success",
        })
      } else {
        setError(result.error || "Failed to update account")
      }
    } catch (err) {
      console.error("Account update error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("currentPassword", currentPassword)
      formData.append("newPassword", newPassword)

      const result = await changePassword(formData)

      if (result.success) {
        toast({
          title: "Password changed",
          description: "Your password has been changed successfully.",
          variant: "success",
        })

        // Reset form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(result.error || "Failed to change password")
      }
    } catch (err) {
      console.error("Password change error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await deleteAccount(confirmDeletePassword)

      if (result.success) {
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
          variant: "success",
        })

        // Redirect to login page (handled by the server action)
      } else {
        setError(result.error || "Failed to delete account")
      }
    } catch (err) {
      console.error("Account deletion error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and profile information</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information to get more accurate harm index calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && activeTab === "profile" && (
                      <div className="rounded-md bg-destructive/10 p-3 mb-4 text-sm text-destructive">{error}</div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="100"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Your age helps us calculate more accurate harm scores. Ages 18-25 and over 65 may have
                          different risk factors.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup value={gender} onValueChange={setGender}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non-binary" id="non-binary" />
                            <Label htmlFor="non-binary">Non-binary</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                            <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                          Some substances affect different genders differently. This helps us provide more accurate harm
                          calculations.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Health Conditions (if any)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cardiovascular"
                              checked={healthConditions.includes("cardiovascular")}
                              onCheckedChange={(checked) =>
                                handleHealthConditionChange("cardiovascular", checked as boolean)
                              }
                            />
                            <Label htmlFor="cardiovascular">Cardiovascular issues</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="liver"
                              checked={healthConditions.includes("liver")}
                              onCheckedChange={(checked) => handleHealthConditionChange("liver", checked as boolean)}
                            />
                            <Label htmlFor="liver">Liver issues</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="kidney"
                              checked={healthConditions.includes("kidney")}
                              onCheckedChange={(checked) => handleHealthConditionChange("kidney", checked as boolean)}
                            />
                            <Label htmlFor="kidney">Kidney issues</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="respiratory"
                              checked={healthConditions.includes("respiratory")}
                              onCheckedChange={(checked) =>
                                handleHealthConditionChange("respiratory", checked as boolean)
                              }
                            />
                            <Label htmlFor="respiratory">Respiratory issues</Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Certain health conditions can increase risks associated with substance use.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Psychiatric Conditions (if any)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="anxiety"
                              checked={psychiatricConditions.includes("anxiety")}
                              onCheckedChange={(checked) =>
                                handlePsychiatricConditionChange("anxiety", checked as boolean)
                              }
                            />
                            <Label htmlFor="anxiety">Anxiety</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="depression"
                              checked={psychiatricConditions.includes("depression")}
                              onCheckedChange={(checked) =>
                                handlePsychiatricConditionChange("depression", checked as boolean)
                              }
                            />
                            <Label htmlFor="depression">Depression</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="bipolar"
                              checked={psychiatricConditions.includes("bipolar")}
                              onCheckedChange={(checked) =>
                                handlePsychiatricConditionChange("bipolar", checked as boolean)
                              }
                            />
                            <Label htmlFor="bipolar">Bipolar disorder</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="other-psychiatric"
                              checked={psychiatricConditions.includes("other-psychiatric")}
                              onCheckedChange={(checked) =>
                                handlePsychiatricConditionChange("other-psychiatric", checked as boolean)
                              }
                            />
                            <Label htmlFor="other-psychiatric">Other psychiatric condition</Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Psychiatric conditions can interact with substances and affect harm levels.
                        </p>
                      </div>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && activeTab === "profile" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Profile"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && activeTab === "account" && (
                      <div className="rounded-md bg-destructive/10 p-3 mb-4 text-sm text-destructive">{error}</div>
                    )}

                    <form onSubmit={handleAccountSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <p className="text-xs text-muted-foreground">
                          Email is optional but allows you to reset your password and receive exclusive content
                        </p>
                      </div>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && activeTab === "account" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Account"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && activeTab === "security" && (
                      <div className="rounded-md bg-destructive/10 p-3 mb-4 text-sm text-destructive">{error}</div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>

                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && activeTab === "security" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Changing password...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </form>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>

                      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="mt-4">
                            Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                              Delete Account
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <p className="text-sm font-medium">Please enter your password to confirm:</p>
                            <Input
                              type="password"
                              placeholder="Password"
                              value={confirmDeletePassword}
                              onChange={(e) => setConfirmDeletePassword(e.target.value)}
                            />
                          </div>

                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={!confirmDeletePassword || isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete Account"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

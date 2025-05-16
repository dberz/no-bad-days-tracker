"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateUserProfile, getUserProfile } from "@/app/actions/user-actions"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/database-types"

export function UserProfileForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [healthConditions, setHealthConditions] = useState<string[]>([])
  const [psychiatricConditions, setPsychiatricConditions] = useState<string[]>([])

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile = await getUserProfile()
        setUser(profile)

        if (profile) {
          setUsername(profile.username || "")
          setEmail(profile.email || "")
          setAge(profile.age ? profile.age.toString() : "")
          setGender(profile.gender || "")
          setHealthConditions(profile.health_conditions || [])
          setPsychiatricConditions(profile.psychiatric_conditions || [])
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("email", email)
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

      await updateUserProfile(formData)

      toast({
        variant: "success",
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <p>Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Update your profile information to get more accurate harm index calculations</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" min="18" max="100" value={age} onChange={(e) => setAge(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Your age helps us calculate more accurate harm scores. Ages 18-25 and over 65 may have different risk
              factors.
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
                  onCheckedChange={(checked) => handleHealthConditionChange("cardiovascular", checked as boolean)}
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
                  onCheckedChange={(checked) => handleHealthConditionChange("respiratory", checked as boolean)}
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
                  onCheckedChange={(checked) => handlePsychiatricConditionChange("anxiety", checked as boolean)}
                />
                <Label htmlFor="anxiety">Anxiety</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="depression"
                  checked={psychiatricConditions.includes("depression")}
                  onCheckedChange={(checked) => handlePsychiatricConditionChange("depression", checked as boolean)}
                />
                <Label htmlFor="depression">Depression</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bipolar"
                  checked={psychiatricConditions.includes("bipolar")}
                  onCheckedChange={(checked) => handlePsychiatricConditionChange("bipolar", checked as boolean)}
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
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

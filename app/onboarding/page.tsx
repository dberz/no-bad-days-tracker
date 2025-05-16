"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { updateUserProfile } from "@/app/actions/profile-actions"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [healthConditions, setHealthConditions] = useState<string[]>([])
  const [psychiatricConditions, setPsychiatricConditions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

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

  const handleNext = () => {
    if (step === 1 && !age) {
      setError("Please enter your age")
      return
    }

    if (step === 1 && !gender) {
      setError("Please select your gender")
      return
    }

    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
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

        // Redirect to dashboard
        router.push("/")
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

  const handleSkip = () => {
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg rounded-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Help us provide more accurate insights by sharing some information about yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
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
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 1 ? (
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
          ) : (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          {step === 2 ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete"
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

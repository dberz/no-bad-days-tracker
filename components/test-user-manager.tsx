import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid"

function getTestUserId() {
  let id = localStorage.getItem("test_user_id")
  if (!id) {
    id = uuidv4()
    localStorage.setItem("test_user_id", id)
  }
  return id
}

export function TestUserManager() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client
    const id = localStorage.getItem("test_user_id")
    setUserId(id)
    setLoading(false)
  }, [])

  // Create a new test user (clears all data)
  const handleCreateUser = () => {
    const newId = uuidv4()
    localStorage.setItem("test_user_id", newId)
    localStorage.removeItem("standalone_substance_logs")
    localStorage.removeItem("substanceLogs")
    localStorage.removeItem("nbd-logs")
    setUserId(newId)
    alert("New test user created. All data cleared.")
  }

  // Clear all data for current test user
  const handleClearData = () => {
    localStorage.removeItem("standalone_substance_logs")
    localStorage.removeItem("substanceLogs")
    localStorage.removeItem("nbd-logs")
    alert("All data for current test user cleared.")
  }

  // Add test data for current test user
  const handleAddTestData = () => {
    const now = new Date()
    const testSubstances = [
      { type: "cannabis", subtype: "smoked", amount: 1, harm: 3 },
      { type: "alcohol", subtype: "beer", amount: 2, harm: 2 },
      { type: "mdma", subtype: null, amount: 1, harm: 8 },
      { type: "ketamine", subtype: null, amount: 1, harm: 5 },
      { type: "caffeine", subtype: null, amount: 2, harm: 1 },
      { type: "nicotine", subtype: null, amount: 1, harm: 2 },
      { type: "psilocybin", subtype: "mushrooms", amount: 1, harm: 4 },
      { type: "cocaine", subtype: null, amount: 1, harm: 7 },
      { type: "alcohol", subtype: "wine", amount: 1, harm: 2 },
      { type: "cannabis", subtype: "edible", amount: 1, harm: 6 },
      { type: "caffeine", subtype: null, amount: 1, harm: 1 },
      { type: "alcohol", subtype: "liquor", amount: 1, harm: 4 },
      { type: "cannabis", subtype: "smoked", amount: 1, harm: 3 },
      { type: "nicotine", subtype: null, amount: 1, harm: 2 },
      { type: "caffeine", subtype: null, amount: 1, harm: 1 },
    ]
    const testInterventions = [
      { type: "exercise", amount: 1, reduction: 4 },
      { type: "meditation", amount: 1, reduction: 3 },
      { type: "hydration", amount: 1, reduction: 2 },
      { type: "nutrition", amount: 1, reduction: 2 },
      { type: "abstinence", amount: 1, reduction: 5 },
    ]
    // Spread logs over 30 days
    const logs = []
    for (let i = 0; i < testSubstances.length; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (30 - Math.floor((i / testSubstances.length) * 30)))
      logs.push({
        id: uuidv4(),
        user_id: userId,
        substance_type: testSubstances[i].type,
        substance_subtype: testSubstances[i].subtype,
        amount: testSubstances[i].amount.toString(),
        date: date.toISOString(),
        context: "test-data",
        supplements: [],
        notes: null,
        feeling_during: null,
        feeling_after: null,
        notes_during: null,
        notes_after: null,
        harm_points: testSubstances[i].harm,
      })
    }
    for (let i = 0; i < testInterventions.length; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (30 - Math.floor((i / testInterventions.length) * 30)))
      logs.push({
        id: uuidv4(),
        user_id: userId,
        substance_type: testInterventions[i].type,
        substance_subtype: null,
        amount: testInterventions[i].amount.toString(),
        date: date.toISOString(),
        context: "test-data",
        supplements: [],
        notes: null,
        feeling_during: null,
        feeling_after: null,
        notes_during: null,
        notes_after: null,
        harm_points: -testInterventions[i].reduction, // negative for reduction
      })
    }
    localStorage.setItem("standalone_substance_logs", JSON.stringify(logs))
    alert("Test data added for current test user.")
  }

  if (loading) {
    return <div className="text-xs text-muted-foreground p-2">Loading test user...</div>
  }

  return (
    <div className="flex flex-col gap-2 p-4 border rounded bg-muted/50">
      <div className="mb-2 font-bold">Test User Management</div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={handleCreateUser}>Create New Test User</Button>
        <Button variant="outline" onClick={handleClearData}>Clear Data</Button>
        <Button variant="outline" onClick={handleAddTestData}>Add Test Data</Button>
      </div>
      <div className="text-xs text-muted-foreground mt-2">Current Test User ID: <span className="font-mono">{userId}</span></div>
    </div>
  )
} 
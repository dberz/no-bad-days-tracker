import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User2 } from "lucide-react"

export function TestUserToggle() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem("test_user_id")
    setUserId(id)
    setLoading(false)
  }, [])

  // Create a new test user (clears all data for that user)
  const handleCreateUser = () => {
    const newId = uuidv4()
    localStorage.setItem("test_user_id", newId)
    // Remove only logs for this user
    const storedLogs = localStorage.getItem("standalone_substance_logs")
    let logs = []
    if (storedLogs) {
      logs = JSON.parse(storedLogs)
    }
    // Remove all logs for the new user (should be none, but just in case)
    const filteredLogs = logs.filter((log: any) => log.user_id !== newId)
    localStorage.setItem("standalone_substance_logs", JSON.stringify(filteredLogs))
    setUserId(newId)
    window.dispatchEvent(new CustomEvent("substance-logs-updated"))
    alert("New test user created. All data cleared for this user.")
  }

  // Clear all data for current test user
  const handleClearData = () => {
    const storedLogs = localStorage.getItem("standalone_substance_logs")
    let logs = []
    if (storedLogs) {
      logs = JSON.parse(storedLogs)
    }
    // Remove only logs for the current user
    const filteredLogs = logs.filter((log: any) => log.user_id !== userId)
    localStorage.setItem("standalone_substance_logs", JSON.stringify(filteredLogs))
    window.dispatchEvent(new CustomEvent("substance-logs-updated"))
    alert("All data for current test user cleared.")
  }

  // Add test data for current test user
  const handleAddTestData = () => {
    const now = new Date()
    const substanceTypes = [
      { type: "cannabis", subtypes: ["smoked", "edible", null] },
      { type: "alcohol", subtypes: ["beer", "wine", "liquor", null] },
      { type: "mdma", subtypes: [null] },
      { type: "ketamine", subtypes: [null] },
      { type: "caffeine", subtypes: [null] },
      { type: "nicotine", subtypes: [null] },
      { type: "psilocybin", subtypes: ["mushrooms", null] },
      { type: "cocaine", subtypes: [null] },
    ]
    const interventionTypes = [
      "exercise", "meditation", "hydration", "nutrition", "abstinence"
    ]
    const logs = []
    // Add 15 random substance logs
    for (let i = 0; i < 15; i++) {
      const s = substanceTypes[Math.floor(Math.random() * substanceTypes.length)]
      const subtype = s.subtypes[Math.floor(Math.random() * s.subtypes.length)]
      const daysAgo = Math.floor(Math.random() * 30)
      const date = new Date(now)
      date.setDate(now.getDate() - daysAgo)
      logs.push({
        id: uuidv4(),
        user_id: userId,
        substance_type: s.type,
        substance_subtype: subtype,
        amount: (Math.floor(Math.random() * 5) + 1).toString(),
        date: date.toISOString(),
        context: "test-data",
        supplements: [],
        notes: null,
        feeling_during: null,
        feeling_after: null,
        notes_during: null,
        notes_after: null,
        harm_points: parseFloat((Math.random() * 10 + 1).toFixed(1)),
      })
    }
    // Add 5 random intervention logs
    for (let i = 0; i < 5; i++) {
      const type = interventionTypes[Math.floor(Math.random() * interventionTypes.length)]
      const daysAgo = Math.floor(Math.random() * 30)
      const date = new Date(now)
      date.setDate(now.getDate() - daysAgo)
      logs.push({
        id: uuidv4(),
        user_id: userId,
        substance_type: type,
        substance_subtype: null,
        amount: (Math.floor(Math.random() * 3) + 1).toString(),
        date: date.toISOString(),
        context: "test-data",
        supplements: [],
        notes: null,
        feeling_during: null,
        feeling_after: null,
        notes_during: null,
        notes_after: null,
        harm_points: -parseFloat((Math.random() * 6 + 1).toFixed(1)),
      })
    }
    localStorage.setItem("standalone_substance_logs", JSON.stringify(logs))
    // Dispatch event so charts/logs update
    window.dispatchEvent(new CustomEvent("substance-logs-updated"))
    alert("Random test data added for current test user.")
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Test User Management">
            <User2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="mb-2 font-bold">Test User Management</div>
          {loading ? (
            <div className="text-xs text-muted-foreground p-2">Loading test user...</div>
          ) : (
            <>
              <div className="flex gap-2 flex-wrap mb-2">
                <Button variant="outline" size="sm" onClick={handleCreateUser}>New User</Button>
                <Button variant="outline" size="sm" onClick={handleClearData}>Clear Data</Button>
                <Button variant="outline" size="sm" onClick={handleAddTestData}>Add Test Data</Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2 break-all">Current User ID: <span className="font-mono">{userId}</span></div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
} 
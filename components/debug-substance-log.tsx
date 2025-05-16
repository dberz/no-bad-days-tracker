"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DebugSubstanceLog() {
  const [logs, setLogs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [substanceName, setSubstanceName] = useState("")
  const [amount, setAmount] = useState("")
  const [debugMessage, setDebugMessage] = useState("")

  // Load logs on component mount
  useEffect(() => {
    console.log("Component mounted, loading logs")
    if (typeof window !== "undefined") {
      try {
        const storedLogs = localStorage.getItem("debug_logs")
        console.log("Stored logs:", storedLogs)
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs)
          console.log("Parsed logs:", parsedLogs)
          setLogs(parsedLogs)
          setDebugMessage("Loaded " + parsedLogs.length + " logs from localStorage")
        } else {
          console.log("No logs found in localStorage")
          setDebugMessage("No logs found in localStorage")
        }
      } catch (error) {
        console.error("Error loading logs:", error)
        setDebugMessage("Error loading logs: " + (error instanceof Error ? error.message : String(error)))
      }
    }
  }, [])

  // Function to add a log
  const addLog = () => {
    try {
      console.log("Adding log:", substanceName, amount)

      // Create a new log
      const newLog = {
        id: Date.now().toString(),
        name: substanceName,
        amount: amount,
        date: new Date().toISOString(),
      }

      // Update state
      const updatedLogs = [newLog, ...logs]
      setLogs(updatedLogs)

      // Save to localStorage
      localStorage.setItem("debug_logs", JSON.stringify(updatedLogs))
      console.log("Saved logs to localStorage:", updatedLogs)

      // Reset form and close dialog
      setSubstanceName("")
      setAmount("")
      setOpen(false)

      setDebugMessage("Log added successfully: " + substanceName)
    } catch (error) {
      console.error("Error adding log:", error)
      setDebugMessage("Error adding log: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  // Function to clear logs
  const clearLogs = () => {
    try {
      localStorage.removeItem("debug_logs")
      setLogs([])
      setDebugMessage("All logs cleared")
      console.log("All logs cleared")
    } catch (error) {
      console.error("Error clearing logs:", error)
      setDebugMessage("Error clearing logs: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Debug Substance Log
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Log</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Substance Log</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="substance">Substance</Label>
                    <Input
                      id="substance"
                      value={substanceName}
                      onChange={(e) => setSubstanceName(e.target.value)}
                      placeholder="e.g., Alcohol"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g., 2 drinks"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addLog} disabled={!substanceName || !amount}>
                    Save Log
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-2 rounded mb-4 text-sm">
            <p>Debug: {debugMessage}</p>
          </div>

          {logs.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No logs yet</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="border p-3 rounded">
                  <p>
                    <strong>{log.name}</strong> - {log.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(log.date).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={clearLogs} className="w-full">
            Clear All Logs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

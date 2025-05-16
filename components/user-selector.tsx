"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, User, Plus, Trash2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TestUser {
  value: string
  label: string
}

export function UserSelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [users, setUsers] = useState<TestUser[]>([])
  const [newUserName, setNewUserName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<TestUser | null>(null)
  const { toast } = useToast()

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("test_users")
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      setUsers(parsedUsers)

      // Set the first user as active if no active user is set
      const activeUser = localStorage.getItem("active_test_user")
      if (parsedUsers.length > 0 && !activeUser) {
        setValue(parsedUsers[0].value)
        localStorage.setItem("active_test_user", parsedUsers[0].value)
      } else if (activeUser) {
        setValue(activeUser)
      }
    } else {
      // Initialize with a default test user if none exist
      const defaultUser = { value: "test_user_1", label: "Test User 1" }
      setUsers([defaultUser])
      setValue(defaultUser.value)
      localStorage.setItem("test_users", JSON.stringify([defaultUser]))
      localStorage.setItem("active_test_user", defaultUser.value)
    }
  }, [])

  const selectedUser = users.find((user) => user.value === value)

  const handleSelect = (currentValue: string) => {
    // If user selects the same value, just close the popover
    if (currentValue === value) {
      setOpen(false)
      return
    }

    setValue(currentValue)
    localStorage.setItem("active_test_user", currentValue)
    setOpen(false)

    // Dispatch a custom event to notify other components of user change
    window.dispatchEvent(
      new CustomEvent("test-user-changed", {
        detail: { userId: currentValue },
      }),
    )

    toast({
      title: "User Changed",
      description: `Switched to ${users.find((user) => user.value === currentValue)?.label}`,
    })
  }

  const handleCreateUser = () => {
    if (!newUserName.trim()) {
      toast({
        title: "Error",
        description: "User name cannot be empty",
        variant: "destructive",
      })
      return
    }

    // Generate a unique ID for the new user
    const newUserId = `test_user_${Date.now()}`
    const newUser = { value: newUserId, label: newUserName.trim() }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("test_users", JSON.stringify(updatedUsers))

    // Switch to the new user
    setValue(newUserId)
    localStorage.setItem("active_test_user", newUserId)

    // Initialize empty data for the new user
    localStorage.setItem(`standalone_substance_logs_${newUserId}`, JSON.stringify([]))

    // Dispatch event to notify components of user change
    window.dispatchEvent(
      new CustomEvent("test-user-changed", {
        detail: { userId: newUserId },
      }),
    )

    setNewUserName("")
    setIsCreateDialogOpen(false)

    toast({
      title: "User Created",
      description: `Created and switched to ${newUserName}`,
    })
  }

  const confirmDeleteUser = (user: TestUser) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return

    // Remove user from the list
    const updatedUsers = users.filter((user) => user.value !== userToDelete.value)
    setUsers(updatedUsers)
    localStorage.setItem("test_users", JSON.stringify(updatedUsers))

    // Delete user's data
    localStorage.removeItem(`standalone_substance_logs_${userToDelete.value}`)

    // If the deleted user was the active user, switch to another user
    if (userToDelete.value === value && updatedUsers.length > 0) {
      setValue(updatedUsers[0].value)
      localStorage.setItem("active_test_user", updatedUsers[0].value)

      // Dispatch event to notify components of user change
      window.dispatchEvent(
        new CustomEvent("test-user-changed", {
          detail: { userId: updatedUsers[0].value },
        }),
      )
    }

    setIsDeleteDialogOpen(false)
    setUserToDelete(null)

    toast({
      title: "User Deleted",
      description: `Deleted ${userToDelete.label}`,
    })
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="rounded-full hover-transition flex items-center"
            aria-label="Select a user"
          >
            <User className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline-block ml-1">{selectedUser?.label || "Select User"}</span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search users..." />
            <Alert className="m-2 py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-xs font-medium">Testing Only</AlertTitle>
              <AlertDescription className="text-xs">This user selector is for testing purposes only.</AlertDescription>
            </Alert>
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup heading="Test Users">
                {users.map((user) => (
                  <CommandItem
                    key={user.value}
                    value={user.value}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check className={cn("mr-2 h-4 w-4", value === user.value ? "opacity-100" : "opacity-0")} />
                      {user.label}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        confirmDeleteUser(user)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setIsCreateDialogOpen(true)
                  }}
                  className="text-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Test User
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Test User</DialogTitle>
            <DialogDescription>
              Create a new test user with a clean profile. All data will be stored locally.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="col-span-3"
                placeholder="Enter user name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Test User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.label}? This will remove all associated data and cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

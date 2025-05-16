"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import type { User as UserType } from "@/lib/database-types"

// Default user for when data can't be loaded
const DEFAULT_USER: UserType = {
  id: "default-user",
  username: "Demo User",
  email: null,
  created_at: new Date().toISOString(),
}

export function UserNav() {
  const [user, setUser] = useState<UserType>(DEFAULT_USER)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)

        // Use a timeout to prevent hanging if the fetch takes too long
        const timeoutPromise = new Promise<UserType>((resolve) => {
          setTimeout(() => resolve(DEFAULT_USER), 3000)
        })

        // Try to fetch the user data
        const fetchPromise = fetch("/api/user")
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then((data) => data as UserType)
          .catch((error) => {
            console.error("Error fetching user:", error)
            return DEFAULT_USER
          })

        // Race between fetch and timeout
        const userData = await Promise.race([fetchPromise, timeoutPromise])
        setUser(userData)
      } catch (error) {
        console.error("Error in loadUser:", error)
        setUser(DEFAULT_USER)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {loading ? "..." : user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{loading ? "Loading..." : user?.username || "Demo User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "demo@example.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { addSubstanceLog } from "./substance-log-actions"

export async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) {
      return null
    }
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const localStorageLogs = formData.get("localStorageLogs") as string

  if (!email || !password || !username) {
    throw new Error("Email, password, and username are required")
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    // Register the user with Supabase Auth and include username in metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error("User registration failed")
    }

    // If there are localStorage logs, import them
    if (localStorageLogs) {
      try {
        const logs = JSON.parse(localStorageLogs)

        // Sign in the user to get a session for importing logs
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          console.error("Error signing in after registration:", signInError)
        } else {
          // Import each log
          for (const log of logs) {
            const logFormData = new FormData()
            logFormData.append("substance_type", log.substance_type)
            logFormData.append("substance_subtype", log.substance_subtype || "")
            logFormData.append("amount", log.amount)
            logFormData.append("date", new Date(log.date).toISOString().split("T")[0])
            logFormData.append("time", new Date(log.date).toTimeString().slice(0, 5))
            logFormData.append("context", log.context || "")
            logFormData.append("supplements", log.supplements || "")
            logFormData.append("notes", log.notes || "")
            logFormData.append("feeling_during", log.feeling_during?.toString() || "5")
            logFormData.append("feeling_after", log.feeling_after?.toString() || "5")
            logFormData.append("notes_during", log.notes_during || "")
            logFormData.append("notes_after", log.notes_after || "")

            await addSubstanceLog(logFormData)
          }
        }
      } catch (error) {
        console.error("Error importing localStorage logs:", error)
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error registering user:", error)
    throw new Error(`Error registering user: ${error.message}`)
  }
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const remember = formData.get("remember") === "true"

  if (!username || !password) {
    return { success: false, error: "Username and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    // Try to login with username as email
    let { data, error } = await supabase.auth.signInWithPassword({
      email: username.includes("@") ? username : `${username}@example.com`,
      password,
      options: {
        // Set session expiration based on remember me option
        expiresIn: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      },
    })

    // If login failed and username doesn't contain @, try to find user by username
    if (error && !username.includes("@")) {
      // Get all users (this would need admin privileges in a real app)
      const { data: usersData } = await supabase.auth.admin.listUsers()

      if (usersData) {
        // Find user with matching username in metadata
        const user = usersData.users.find((u) => u.user_metadata?.username?.toLowerCase() === username.toLowerCase())

        if (user && user.email) {
          // Try login with the found email
          const result = await supabase.auth.signInWithPassword({
            email: user.email,
            password,
            options: {
              expiresIn: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
            },
          })

          data = result.data
          error = result.error
        }
      }
    }

    if (error) {
      return { success: false, error: "Invalid username or password" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error logging in:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function logoutUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  await supabase.auth.signOut()
  redirect("/")
}

export async function getUserByUsername(username: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    // Query users by their metadata
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      throw new Error(error.message)
    }

    // Find the user with the matching username in metadata
    const user = data.users.find((user) => user.user_metadata?.username === username)

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

export async function clearSession() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

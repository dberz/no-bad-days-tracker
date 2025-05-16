import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { cache } from "react"

// Flag to track if Supabase is working
let isSupabaseWorking = true

// Create a Supabase client for server components
export const createServerComponentClient = cache(() => {
  try {
    // If we already know Supabase is not working, don't even try
    if (!isSupabaseWorking) {
      console.log("Using mock Supabase client due to previous failures")
      return createMockClient()
    }

    const cookieStore = cookies()

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      isSupabaseWorking = false
      return createMockClient()
    }

    return supabaseCreateClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: (...args) => {
          return fetch(...args).catch((error) => {
            console.error("Supabase fetch error:", error)
            isSupabaseWorking = false
            throw error
          })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    isSupabaseWorking = false
    return createMockClient()
  }
})

// Create a mock client that returns fake data
function createMockClient() {
  return {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          then: (callback: Function) => {
            if (table === "users") {
              callback({
                data: [
                  {
                    id: "mock-user-1",
                    username: "Demo User",
                    email: "demo@example.com",
                    created_at: new Date().toISOString(),
                  },
                ],
                error: null,
              })
            } else {
              callback({ data: [], error: null })
            }
            return { catch: () => {} }
          },
        }),
        eq: () => ({
          single: () => ({
            then: (callback: Function) => {
              if (table === "users") {
                callback({
                  data: {
                    id: "mock-user-1",
                    username: "Demo User",
                    email: "demo@example.com",
                    created_at: new Date().toISOString(),
                  },
                  error: null,
                })
              } else {
                callback({ data: null, error: null })
              }
              return { catch: () => {} }
            },
          }),
          then: (callback: Function) => {
            callback({ data: [], error: null })
            return { catch: () => {} }
          },
        }),
        single: () => ({
          then: (callback: Function) => {
            callback({ data: null, error: null })
            return { catch: () => {} }
          },
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            then: (callback: Function) => {
              callback({
                data: {
                  id: `mock-${Date.now()}`,
                  created_at: new Date().toISOString(),
                },
                error: null,
              })
              return { catch: () => {} }
            },
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          then: (callback: Function) => {
            callback({ data: null, error: null })
            return { catch: () => {} }
          },
        }),
      }),
      delete: () => ({
        eq: () => ({
          then: (callback: Function) => {
            callback({ data: null, error: null })
            return { catch: () => {} }
          },
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }
}

// Create a Supabase client for client components
export const createBrowserClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase environment variables")
    return createMockClientForBrowser()
  }

  try {
    return supabaseCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  } catch (error) {
    console.error("Error creating browser Supabase client:", error)
    return createMockClientForBrowser()
  }
}

// Create a mock client for browser
function createMockClientForBrowser() {
  return {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          then: (callback: Function) => {
            if (table === "users") {
              callback({
                data: [
                  {
                    id: "mock-user-1",
                    username: "Demo User",
                    email: "demo@example.com",
                    created_at: new Date().toISOString(),
                  },
                ],
                error: null,
              })
            } else {
              callback({ data: [], error: null })
            }
            return { catch: () => {} }
          },
        }),
        eq: () => ({
          single: () => ({
            then: (callback: Function) => {
              if (table === "users") {
                callback({
                  data: {
                    id: "mock-user-1",
                    username: "Demo User",
                    email: "demo@example.com",
                    created_at: new Date().toISOString(),
                  },
                  error: null,
                })
              } else {
                callback({ data: null, error: null })
              }
              return { catch: () => {} }
            },
          }),
          then: (callback: Function) => {
            callback({ data: [], error: null })
            return { catch: () => {} }
          },
        }),
        single: () => ({
          then: (callback: Function) => {
            callback({ data: null, error: null })
            return { catch: () => {} }
          },
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            then: (callback: Function) => {
              callback({
                data: {
                  id: `mock-${Date.now()}`,
                  created_at: new Date().toISOString(),
                },
                error: null,
              })
              return { catch: () => {} }
            },
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          then: (callback: Function) => {
            callback({ data: null, error: null })
            return { catch: () => {} }
          },
        }),
      }),
      delete: () => ({
        eq: () => ({
          then: (callback: Function) => {
            callback({ data: null, error: null })
            return { catch: () => {} }
          },
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }
}

export { supabaseCreateClient as createClient }

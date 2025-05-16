import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/user-actions"

export async function GET() {
  try {
    // Try to get the current user
    const user = await getCurrentUser()

    // Return the user data
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error in user API route:", error)

    // Return a default user if there's an error
    return NextResponse.json({
      id: "default-user",
      username: "Demo User",
      email: null,
      created_at: new Date().toISOString(),
    })
  }
}

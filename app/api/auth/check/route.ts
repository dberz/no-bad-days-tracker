import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error checking authentication:", error)
      return NextResponse.json({ authenticated: false, error: error.message }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    return NextResponse.json({ authenticated: true, userId: session.user.id }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error checking authentication:", error)
    return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 })
  }
}

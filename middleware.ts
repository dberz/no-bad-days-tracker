import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/forgot-password" ||
    path.startsWith("/api/") ||
    path === "/" ||
    path === "/activity" ||
    path === "/substance-use"

  // Get the session cookie
  const userId = request.cookies.get("user_id")?.value

  // Redirect to login if accessing a protected path without authentication
  if (!isPublicPath && !userId) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (userId && (path === "/auth/login" || path === "/auth/register")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/profile/:path*",
    "/onboarding/:path*",
    "/log/:path*",
    "/insights/:path*",
    "/wellness/:path*",
    "/auth/:path*",
    // "/activity", // Remove this comment to include it in protected paths
    // "/substance-use", // Remove this comment to include it in protected paths
  ],
}

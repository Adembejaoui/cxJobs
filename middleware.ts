import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  const publicRoutes = ["/", "/api/register", "/company/signup"]
  const authRoutes = ["/auth", "/register"]

  // Skip middleware for API routes, Next.js internals, and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    if (pathname === "/company/signup" && token) {
      const invitationToken = request.nextUrl.searchParams.get("token")

      if (invitationToken) {
        // If user is already authenticated and has an invitation token, redirect based on their role
        if (token.role === "COMPANY") {
          console.log("[v0] Authenticated company user with invitation token - redirecting to company dashboard")
          return NextResponse.redirect(new URL("/dashboard/company/profile", request.url))
        } else if (token.role === "CANDIDATE") {
          if (!token.onboardingCompleted) {
            console.log("[v0] Authenticated candidate with invitation token - redirecting to onboarding")
            return NextResponse.redirect(new URL("/onboarding", request.url))
          } else {
            console.log("[v0] Authenticated candidate with invitation token - redirecting to candidate dashboard")
            return NextResponse.redirect(new URL("/dashboard/candidate/profile", request.url))
          }
        } else if (token.role === "ADMIN") {
          console.log("[v0] Authenticated admin with invitation token - redirecting to admin dashboard")
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      } else if (token) {
        // If authenticated user tries to access company signup without invitation token, redirect to their dashboard
        console.log("[v0] Authenticated user trying to access company signup without token - redirecting to dashboard")
        const role = token.role.toLowerCase()
        return NextResponse.redirect(new URL(`/dashboard/${role}/profile`, request.url))
      }
    }

    if (token && pathname === "/") {
      if (!token.onboardingCompleted && token.role === "CANDIDATE") {
        console.log("[v0] Authenticated candidate on home page - redirecting to onboarding")
        return NextResponse.redirect(new URL("/onboarding", request.url))
      } 
    }
    return NextResponse.next()
  }

  // Handle auth routes
  if (authRoutes.includes(pathname)) {
    if (token && pathname !== "/company/signup") {
      console.log("[v0] Authenticated user trying to access auth page - redirecting")
      if (!token.onboardingCompleted && token.role === "CANDIDATE") {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      } else if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/dashboard/")) {
    if (!token) {
      console.log("[v0] Unauthenticated user trying to access dashboard - redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }

    const pathParts = pathname.split("/")
    const roleFromPath = pathParts[2]?.toUpperCase() // candidate -> CANDIDATE
    const subRoute = pathParts[3] // onboarding, edit, profile, etc.

    // Verify user has access to this role's dashboard
    if (token.role !== roleFromPath) {
      console.log(`[v0] User with role ${token.role} trying to access ${roleFromPath} dashboard - redirecting`)
      const userRole = token.role.toLowerCase()
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
    }

    // Handle onboarding route - only for candidates who haven't completed onboarding
    if (subRoute === "onboarding") {
      if (token.role !== "CANDIDATE") {
        console.log("[v0] Non-candidate trying to access onboarding - redirecting to their dashboard")
        const userRole = token.role.toLowerCase()
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
      if (token.onboardingCompleted) {
        console.log("[v0] Candidate with completed onboarding trying to access onboarding - redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard/candidate", request.url))
      }
    }

    // Redirect candidates to onboarding if they haven't completed it
    if (token.role === "CANDIDATE" && !token.onboardingCompleted && subRoute !== "onboarding") {
      console.log("[v0] Candidate without completed onboarding - redirecting to onboarding")
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    return NextResponse.next()
  }

  // Handle company signup route (still separate)
  if (pathname.startsWith("/company/signup")) {
    return NextResponse.next()
  }

  // For all other protected routes, check authentication
  if (!token) {
    console.log("[v0] Unauthenticated user trying to access protected route - redirecting to home")
    return NextResponse.redirect(new URL("/", request.url))
  }

  console.log("[v0] Allowing access to protected route")
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

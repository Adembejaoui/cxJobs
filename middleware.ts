import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  console.log(
    "[v0] Middleware - path:",
    pathname,
    "authenticated:",
    !!token,
    "onboardingCompleted:",
    token?.onboardingCompleted,
  )

  const publicRoutes = ["/", "/api/register"]
  const authRoutes = ["/auth"]

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and trying to access home page, redirect based on onboarding status
    if (token) {
      if (!token.onboardingCompleted) {
        console.log("[v0] Authenticated user on home page - redirecting to onboarding")
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    }
    return NextResponse.next()
  }

  if (authRoutes.includes(pathname)) {
    if (token) {
      console.log("[v0] Authenticated user trying to access auth page - redirecting")
      if (!token.onboardingCompleted) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      } else {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
    return NextResponse.next()
  }

  if (pathname === "/onboarding") {
    if (!token) {
      console.log("[v0] Unauthenticated user trying to access onboarding - redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (token.onboardingCompleted) {
      console.log("[v0] User with completed onboarding trying to access onboarding - redirecting to dashboard")
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    console.log("[v0] Unauthenticated user trying to access protected route - redirecting to home")
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!token.onboardingCompleted) {
    console.log("[v0] Authenticated user without completed onboarding - redirecting to onboarding")
    return NextResponse.redirect(new URL("/onboarding", request.url))
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

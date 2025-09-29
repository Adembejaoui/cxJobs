import { type NextRequest, NextResponse } from "next/server"
import { verifyEmailZeroBounce } from "@/lib/verifyEmail"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
  }

  try {
    console.log(`[v0] Testing email verification for: ${email}`)
    console.log(`[v0] API Key present: ${!!process.env.ABSTRACT_API_KEY}`)

    const isValid = await verifyEmailZeroBounce(email)

    return NextResponse.json({
      email,
      isValid,
      apiKeyPresent: !!process.env.ABSTRACT_API_KEY,
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("[v0] Test email verification error:", error)
    return NextResponse.json(
      {
        error: "Failed to verify email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

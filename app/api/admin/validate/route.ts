import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 })
    }

    const invitation = await prisma.companyInvitation.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json({ success: false, error: "Invalid invitation token" }, { status: 404 })
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json({ success: false, error: "Invitation has expired" }, { status: 400 })
    }

    // Check if invitation has already been used
    if (invitation.usedAt) {
      return NextResponse.json({ success: false, error: "Invitation has already been used" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
      },
    })
  } catch (error) {
    console.error("Error validating invitation:", error)
    return NextResponse.json({ success: false, error: "Failed to validate invitation" }, { status: 500 })
  }
}

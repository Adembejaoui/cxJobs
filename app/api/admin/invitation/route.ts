import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, adminUserId } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    if (!adminUserId) {
      return NextResponse.json({ success: false, error: "Admin user ID is required" }, { status: 400 })
    }

    // TODO: Add proper admin authentication check here
    // For now, we'll assume the adminUserId is valid

    // Create invitation that expires in 7 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    console.log("[v0] Creating invitation with:", { email, adminUserId, expiresAt })

    const invitation = await prisma.companyInvitation.create({
      data: {
        email,
        createdBy: adminUserId,
        expiresAt,
      },
    })

    // Generate the invitation URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const invitationUrl = `${baseUrl}/company/signup?token=${invitation.token}`

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        token: invitation.token,
        url: invitationUrl,
        expiresAt: invitation.expiresAt,
      },
    })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json({ success: false, error: "Failed to create invitation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminUserId = searchParams.get("adminUserId")

    // TODO: Add proper admin authentication check here

    const invitations = await prisma.companyInvitation.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        token: true,
        email: true,
        createdAt: true,
        expiresAt: true,
        usedAt: true,
        usedBy: true,
      },
    })

    return NextResponse.json({
      success: true,
      invitations,
    })
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch invitations" }, { status: 500 })
  }
}

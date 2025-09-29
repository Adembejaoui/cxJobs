import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Schema for creating a user
const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string(),
  role: z.enum(["CANDIDATE", "COMPANY", "ADMIN"]).default("CANDIDATE"),
  invitationToken: z.string().optional(), // For company invitations
})

// Schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  role: z.enum(["CANDIDATE", "COMPANY", "ADMIN"]).optional(),
  search: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === "ADMIN"

    const body = await req.json()
    const validatedData = createUserSchema.parse(body)

    if (validatedData.invitationToken) {
      const invitation = await prisma.companyInvitation.findUnique({
        where: { token: validatedData.invitationToken },
      })

      if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
        return NextResponse.json({ success: false, message: "Invalid or expired invitation token" }, { status: 400 })
      }

      // Force role to COMPANY for invitation-based registration
      validatedData.role = "COMPANY"
    }

    if (!isAdmin && validatedData.role !== "CANDIDATE" && !validatedData.invitationToken) {
      validatedData.role = "CANDIDATE"
    }

    const { email, password, name, role, invitationToken } = validatedData

    /*const isEmailDeliverable = await verifyEmailZeroBounce(email)
    if (!isEmailDeliverable) {
      return NextResponse.json({ success: false, message: "Invalid or non-existent email address" }, { status: 400 })
    }*/

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (user.role === "CANDIDATE") {
      await prisma.candidate.create({
        data: {
          userId: user.id,
        },
      })
    } else if (user.role === "COMPANY") {
      await prisma.company.create({
        data: {
          userId: user.id,
          name: "", // Will be filled in the edit page
        },
      })

      if (invitationToken) {
        await prisma.companyInvitation.update({
          where: { token: invitationToken },
          data: { used: true, usedAt: new Date() },
        })
      }
    }

    const redirectUrl = user.role === "COMPANY" ? "/dashboard/COMPANY/profile/edit" : "/onboarding"

    return NextResponse.json(
      { success: true, message: "User created successfully", user, redirect: redirectUrl },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)

    // Handle Prisma database errors
    if (error instanceof PrismaClientKnownRequestError) {
      // Don't expose internal database details to the client
      let userMessage = "Unable to create user account. Please try again."

      // Handle specific known error codes
      if (error.code === "P2002") {
        userMessage = "Email address is already registered."
      } else if (error.code === "P2003") {
        userMessage = "Invalid data provided. Please check your information."
      }

      return NextResponse.json(
        {
          success: false,
          message: userMessage,
          canRetry: true, // Allow frontend to show retry option
        },
        { status: 400 },
      )
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))

      return NextResponse.json(
        {
          success: false,
          message: "Please check the information you provided",
          fieldErrors,
          canRetry: true,
        },
        { status: 400 },
      )
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request format. Please try again.",
          canRetry: true,
        },
        { status: 400 },
      )
    }

    // Generic error fallback - don't expose internal error details
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
        canRetry: true,
      },
      { status: 500 },
    )
  }
}

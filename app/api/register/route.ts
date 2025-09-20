import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


// Schema for creating a user
const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string(),
  role: z.enum(["CANDIDATE", "COMPANY", "ADMIN"]).default("CANDIDATE"),
});

// Schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  role: z.enum(["CANDIDATE", "COMPANY", "ADMIN"]).optional(),
  search: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    const body = await req.json();
    const validatedData = createUserSchema.parse(body);

    if (!isAdmin && validatedData.role !== "CANDIDATE") {
      validatedData.role = "CANDIDATE";
    }

    const { email, password, name, role } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already in use" },
      { status: 409 }
    )
    }

    const hashedPassword = await hash(password, 10);

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
    });

    // Add the logic to create the candidate profile if the role is 'CANDIDATE'
    if (user.role === "CANDIDATE") {
      await prisma.candidate.create({
        data: {
          userId: user.id,
        },
      });
    }

  return NextResponse.json(
  { success: true, message: "User created successfully", user , redirect:"/onboarding" },
  { status: 201 }
)

  } catch (error) {
    console.error("Error creating user:", error);

    // This block will now return the specific Prisma error message
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          message: "Database error occurred",
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.issues },
        { status: 400 }
      );
    }

    // Default 500 error
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}
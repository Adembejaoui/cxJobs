import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Import authOptions from lib/auth
import { prisma } from "@/lib/prisma" // Use prisma from lib/prisma
import { z } from "zod"

const onboardingSchema = z.object({
  profileData: z.object({
    personalInfo: z.object({
      fullName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      location: z.string(),
      professionalTitle: z.string(),
      presentation: z.string(),
      contractTypes: z.array(z.string()).optional(),
      salaryRange: z.string().optional(),
      workingHours: z.array(z.string()).optional(),
    }),
    experiences: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    competences: z.array(z.any()).optional(),
    jobPreferences: z
      .object({
        contractTypes: z.array(z.string()).optional(),
        salaryExpectationMin: z.number().nullable().optional(),
        salaryExpectationMax: z.number().nullable().optional(),
        workHours: z.string().optional(),
      })
      .optional(),
    preferences: z
      .object({
        contractTypes: z.array(z.string()).optional(),
        salaryMin: z.number().nullable().optional(),
        salaryMax: z.number().nullable().optional(),
        workingHours: z.array(z.string()).optional(),
      })
      .optional(),
  }),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Fetch user with candidate data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        candidate: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    const workHoursString = user.candidate?.workHours || ""
    const workHoursArray = workHoursString ? workHoursString.split(", ").filter(Boolean) : []

    const profileData = {
      personalInfo: {
        fullName: user.name || "",
        email: user.email || "",
        phone: user.candidate?.phone || "",
        location: user.candidate?.location || "",
        professionalTitle: user.candidate?.jobTitle || "",
        presentation: user.candidate?.presentation || "",
        salaryExpectationMin: user.candidate?.salaryExpectationMin || null,
        salaryExpectationMax: user.candidate?.salaryExpectationMax || null,
        contractTypes: user.candidate?.contractTypes || [],
        workHours: workHoursString, // Keep as string for display
      },
      experiences: user.candidate?.experiences || [],
      education: user.candidate?.formations || [],
      skills: user.candidate?.competences || [],
      languages: user.candidate?.languages || [],
      competences: user.candidate?.competences || [],
      preferences: {
        contractTypes: user.candidate?.contractTypes || [],
        salaryExpectationMin: user.candidate?.salaryExpectationMin || null,
        salaryExpectationMax: user.candidate?.salaryExpectationMax || null,
        workHours: user.candidate?.workHours || "",
      },
    }

    return NextResponse.json({ profileData })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Raw request body:", JSON.stringify(body, null, 2))

    const { profileData } = onboardingSchema.parse(body)

    console.log("[v0] Parsed profileData:", JSON.stringify(profileData, null, 2))

    const jobPreferencesData = profileData.jobPreferences || {}
    const preferencesData = profileData.preferences || {}
    const personalInfoPrefs = {
      contractTypes: profileData.personalInfo.contractTypes,
      workingHours: profileData.personalInfo.workingHours,
    }

    const contractTypes =
      jobPreferencesData.contractTypes || preferencesData.contractTypes || personalInfoPrefs.contractTypes || []
    const salaryMin = jobPreferencesData.salaryExpectationMin || preferencesData.salaryMin || null
    const salaryMax = jobPreferencesData.salaryExpectationMax || preferencesData.salaryMax || null
    const workingHours =
      jobPreferencesData.workHours || preferencesData.workingHours || personalInfoPrefs.workingHours || []

    const workHours = Array.isArray(workingHours) ? workingHours.join(", ") : workingHours

    console.log("[v0] Processed job preferences:", {
      contractTypes,
      salaryMin,
      salaryMax,
      workingHours,
      workHours,
    })

    const candidateData = {
      phone: profileData.personalInfo.phone,
      location: profileData.personalInfo.location,
      jobTitle: profileData.personalInfo.professionalTitle,
      presentation: profileData.personalInfo.presentation,
      salaryExpectationMin: salaryMin,
      salaryExpectationMax: salaryMax,
      contractTypes: contractTypes,
      workHours: workHours,
      competences: profileData.competences || profileData.skills || [],
      languages: profileData.languages || [],
      experiences: profileData.experiences || [],
      formations: profileData.education || [],
    }

    console.log("[v0] Candidate data to save:", JSON.stringify(candidateData, null, 2))

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: profileData.personalInfo.fullName,
        role: "CANDIDATE",
        onboardingCompleted: true,
        candidate: {
          upsert: {
            create: candidateData,
            update: candidateData,
          },
        },
      },
    })

    console.log("[v0] Successfully updated profile with job preferences")

    return NextResponse.json({
      success: true,
      message: "Profil complété avec succès",
      redirectTo: "/dashboard/candidate/profile",
    })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

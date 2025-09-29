import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

console.log("[v0] Profile API route loaded")

// ✅ Utility: normalize role
function normalizeRole(role: string) {
  return role.toLowerCase() === "candidat" || role.toLowerCase() === "candidate" ? "candidate" : "company"
}

// ✅ GET /api/profile?role=candidate|company
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("[v0] Session check:", { hasSession: !!session, userId: session?.user?.id })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    if (!role || !["candidate", "candidat", "company", "entreprise"].includes(role.toLowerCase())) {
      return NextResponse.json({ error: "Invalid role parameter" }, { status: 400 })
    }

    const normalizedrole = normalizeRole(role)
    const userId = session.user.id

    const userWithProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidate: normalizedrole === "candidate",
        company: normalizedrole === "company",
      },
    })

    if (!userWithProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure the user’s role matches
    const userrole = userWithProfile.role.toLowerCase()
    if (
      (normalizedrole === "candidate" && userrole !== "candidate") ||
      (normalizedrole === "company" && userrole !== "company")
    ) {
      return NextResponse.json({ error: "Role mismatch" }, { status: 403 })
    }

    let profileData = {}

    if (normalizedrole === "candidate" && userWithProfile.candidate) {
      const c = userWithProfile.candidate
      profileData = {
        name: userWithProfile.name,
        email: userWithProfile.email,
        phone: c.phone || "",
        location: c.location || "",
        jobTitle: c.jobTitle || "",
        presentation: c.presentation || "",
        logo: c.logo || "",
        contractTypes: Array.isArray(c.contractTypes) ? c.contractTypes : [],
        salaryExpectationMin: c.salaryExpectationMin || null,
        salaryExpectationMax: c.salaryExpectationMax || null,
        workHours: c.workHours || "",
        experiences: Array.isArray(c.experiences) ? c.experiences : [],
        formations: Array.isArray(c.formations) ? c.formations : [],
        languages: Array.isArray(c.languages) ? c.languages : [],
        competences: Array.isArray(c.competences) ? c.competences : [],
      }
    }

    if (normalizedrole === "company" && userWithProfile.company) {
      const comp = userWithProfile.company
      profileData = {
        name: comp.name,
        email: comp.email || userWithProfile.email,
        phone: comp.phone || "",
        address: comp.address || "",
        website: comp.website || "",
        sector: comp.sector || "",
        size: comp.size || "",
        foundedYear: comp.foundedYear || null,
        description: comp.description || "",
        logo: comp.logoUrl || "",
        coverPhoto: comp.coverUrl || "",
        values: Array.isArray(comp.values) ? comp.values : [],
        advantages: Array.isArray(comp.advantages) ? comp.advantages : [],
        photos: Array.isArray(comp.photos) ? comp.photos : [],
        langage: Array.isArray(comp.langage)
          ? comp.langage.map((lang: any) => (typeof lang === "string" ? { name: lang } : lang))
          : [],
      }
    }

    return NextResponse.json({
      success: true,
      profile: profileData,
      user: {
        id: userWithProfile.id,
        name: userWithProfile.name,
        email: userWithProfile.email,
        role: userWithProfile.role,
      },
    })
  } catch (error) {
    console.error("[v0] Profile GET error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// ✅ PATCH /api/profile?role=candidate|company
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    if (!role || !["candidate", "candidat", "company", "entreprise"].includes(role.toLowerCase())) {
      return NextResponse.json({ error: "Invalid role parameter" }, { status: 400 })
    }

    const normalizedrole = normalizeRole(role)
    const userId = session.user.id
    const body = await request.json().catch(() => null)

    if (!body?.profileData) {
      return NextResponse.json({ error: "Profile data is required" }, { status: 400 })
    }

    const { profileData } = body

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user role matches
    const userrole = user.role.toLowerCase()
    if (
      (normalizedrole === "candidate" && userrole !== "candidate") ||
      (normalizedrole === "company" && userrole !== "company")
    ) {
      return NextResponse.json({ error: "Role mismatch" }, { status: 403 })
    }

    let updatedProfile: any

    if (normalizedrole === "candidate") {
      const parseIntOrNull = (value: any): number | null => {
        if (value === null || value === undefined || value === "") return null
        const parsed = Number.parseInt(value, 10)
        return isNaN(parsed) ? null : parsed
      }

      const candidateData = {
        phone: profileData.phone ?? null,
        logo: profileData.logo ?? null,
        location: profileData.location ?? null,
        jobTitle: profileData.jobTitle ?? null,
        presentation: profileData.presentation ?? null,
        contractTypes: profileData.contractTypes ?? [],
        salaryExpectationMin: parseIntOrNull(profileData.salaryExpectationMin),
        salaryExpectationMax: parseIntOrNull(profileData.salaryExpectationMax),
        workHours: profileData.workHours ?? null,
        competences: profileData.competences ?? [],
        languages: profileData.languages ?? [],
        experiences: profileData.experiences ?? [],
        formations: profileData.formations ?? [],
      }

      // Update name/email at user level
      if (profileData.name || profileData.email) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            ...(profileData.name && { name: profileData.name }),
            ...(profileData.email && { email: profileData.email }),
          },
        })
      }

      updatedProfile = await prisma.candidate.upsert({
        where: { userId },
        update: candidateData,
        create: { userId, ...candidateData },
        include: { user: true },
      })
    }

    if (normalizedrole === "company") {
      const parseIntOrNull = (value: any): number | null => {
        if (value === null || value === undefined || value === "") return null
        const parsed = Number.parseInt(value, 10)
        return isNaN(parsed) ? null : parsed
      }

      const companyData = {
        name: profileData.name || "Company Name",
        email: profileData.email ?? null,
        phone: profileData.phone ?? null,
        address: profileData.address ?? null,
        website: profileData.website ?? null,
        sector: profileData.sector ?? null,
        size: profileData.size ?? null,
        foundedYear: parseIntOrNull(profileData.foundedYear),
        description: profileData.description ?? null,
        logoUrl: profileData.logo ?? null,
        coverUrl: profileData.coverPhoto ?? null,
        values: profileData.values ?? [],
        advantages: profileData.advantages ?? [],
        photos: profileData.photos ?? [],
        langage: Array.isArray(profileData.langage)
          ? profileData.langage.map((lang: any) => (typeof lang === "string" ? { name: lang } : lang))
          : [],
      }

      if (profileData.name) {
        await prisma.user.update({
          where: { id: userId },
          data: { name: profileData.name },
        })
      }

      updatedProfile = await prisma.company.upsert({
        where: { userId },
        update: companyData,
        create: { userId, ...companyData },
        include: { user: true },
      })
    }

    // Build response
    let responseData = {}

    if (normalizedrole === "candidate" && updatedProfile) {
      const c = updatedProfile
      responseData = {
        name: c.user.name,
        email: c.user.email,
        phone: c.phone || "",
        location: c.location || "",
        jobTitle: c.jobTitle || "",
        presentation: c.presentation || "",
        logo: c.logo || "",
        contractTypes: Array.isArray(c.contractTypes) ? c.contractTypes : [],
        salaryExpectationMin: c.salaryExpectationMin || null,
        salaryExpectationMax: c.salaryExpectationMax || null,
        workHours: c.workHours || "",
        experiences: Array.isArray(c.experiences) ? c.experiences : [],
        formations: Array.isArray(c.formations) ? c.formations : [],
        languages: Array.isArray(c.languages) ? c.languages : [],
        competences: Array.isArray(c.competences) ? c.competences : [],
      }
    }

    if (normalizedrole === "company" && updatedProfile) {
      const comp = updatedProfile
      responseData = {
        name: comp.name,
        email: comp.email || comp.user.email,
        phone: comp.phone || "",
        address: comp.address || "",
        website: comp.website || "",
        sector: comp.sector || "",
        size: comp.size || "",
        foundedYear: comp.foundedYear || null,
        description: comp.description || "",
        logo: comp.logoUrl || "",
        coverPhoto: comp.coverUrl || "",
        values: Array.isArray(comp.values) ? comp.values : [],
        advantages: Array.isArray(comp.advantages) ? comp.advantages : [],
        photos: Array.isArray(comp.photos) ? comp.photos : [],
        langage: Array.isArray(comp.langage)
          ? comp.langage.map((lang: any) => (typeof lang === "string" ? { name: lang } : lang))
          : [],
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: responseData,
    })
  } catch (error) {
    console.error("[v0] Profile PATCH error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

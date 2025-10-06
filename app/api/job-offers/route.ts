import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const jobOfferSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  location: z.string().min(1, "La localisation est requise"),
  contractType: z.string().min(1, "Le type de contrat est requis"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  displaySalary: z.boolean().default(false), // Keep in validation but don't save to DB
  workMode: z.enum(["sur site", "hybride", "télétravail"]),
  displayWorkMode: z.boolean().default(true), // Keep in validation but don't save to DB
  description: z.string().min(1, "La description est requise"),
  applicationMode: z.object({
    viaCxJobs: z.boolean(),
    atsUrl: z.string().optional(),
  }),
  requirements: z.object({
    skills: z.array(z.string()),
    languages: z.array(z.string()),
    benefits: z.array(z.string()).optional(),
  }),
  recruitment: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      description: z.string(),
    }),
  ),
  visibility: z.enum(["public", "private"]).default("public"),
  expirationDate: z.string().optional(),
  notifyOnApplication: z.boolean().default(true),
  publishNow: z.boolean().default(false),
  userId: z.string().min(1, "L'ID de l'utilisateur est requis"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = jobOfferSchema.parse(body)

    // Check if expiration date is in the past
    if (validatedData.expirationDate) {
      const expirationDate = new Date(validatedData.expirationDate)
      if (expirationDate < new Date()) {
        return NextResponse.json({ error: "La date d'expiration ne peut pas être dans le passé" }, { status: 400 })
      }
    }

    const company = await prisma.company.findUnique({
      where: { userId: validatedData.userId },
    })

    if (!company) {
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 })
    }

    // These are UI-only fields and don't exist in the Prisma schema
    const jobOffer = await prisma.jobOffer.create({
      data: {
        title: validatedData.title,
        location: validatedData.location,
        contractType: validatedData.contractType,
        salaryMin: validatedData.salaryMin,
        salaryMax: validatedData.salaryMax,
        workMode: validatedData.workMode,
        description: validatedData.description,
        applicationMode: validatedData.applicationMode,
        requirements: validatedData.requirements,
        recruitment: validatedData.recruitment,
        expirationDate: validatedData.expirationDate ? new Date(validatedData.expirationDate).toDateString() : null,
        status: validatedData.publishNow ? "published" : "draft",
        companyId: company.id,
      },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: validatedData.publishNow ? "Offre publiée avec succès" : "Brouillon enregistré avec succès",
        jobOffer,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating job offer:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Une erreur est survenue lors de la création de l'offre" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")
    const status = searchParams.get("status")

    const where: any = {}

    if (companyId) {
      where.companyId = companyId
    }

    if (status) {
      where.status = status
    }

    const jobOffers = await prisma.jobOffer.findMany({
      where,
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ jobOffers })
  } catch (error) {
    console.error("[v0] Error fetching job offers:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la récupération des offres" }, { status: 500 })
  }
}

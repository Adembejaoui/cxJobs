import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  console.log("[v0] ===== API ROUTE HIT =====")

  try {
    const { jobId } = await params
    console.log("[v0] Job ID from params:", jobId)

    if (!jobId) {
      console.log("[v0] No job ID provided")
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    console.log("[v0] Attempting to fetch job offer from database...")

    // First, just get the job offer without any relations
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id: jobId },
    })

    console.log("[v0] Job offer result:", JSON.stringify(jobOffer, null, 2))

    if (!jobOffer) {
      console.log("[v0] Job offer NOT FOUND in database")
      return NextResponse.json({ error: "Job offer not found" }, { status: 404 })
    }

    console.log("[v0] Job offer FOUND! Now fetching company...")

    // Try to get the company separately
    let company = null
    if (jobOffer.companyId) {
      try {
        company = await prisma.company.findUnique({
          where: { id: jobOffer.companyId },
        })
        console.log("[v0] Company result:", company ? "Found" : "Not found")
      } catch (companyError) {
        console.error("[v0] Error fetching company:", companyError)
      }
    } else {
      console.log("[v0] No companyId on job offer")
    }

    console.log("[v0] Returning successful response")
    return NextResponse.json({
      jobOffer: {
        ...jobOffer,
        company,
      },
    })
  } catch (error) {
    console.error("[v0] ===== ERROR IN API ROUTE =====")
    console.error("[v0] Error:", error)
    console.error("[v0] Error type:", typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error("[v0] Stack:", error.stack)
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

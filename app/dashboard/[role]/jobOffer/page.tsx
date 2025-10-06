"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainInformationSection } from "@/components/job-offer/main-information-section"
import { ApplicationModeSection } from "@/components/job-offer/application-mode-section"
import { RequirementsSection } from "@/components/job-offer/requirements-section"
import { RecruitmentProcessSection } from "@/components/job-offer/recruitment-process-section"
import { PreviewSidebar } from "@/components/job-offer/preview-sidebar"
import { JobOfferFormData } from "@/types/jobOffer"
import { useJobOfferForm } from "@/hooks/use-job-offer-form"
import { useSession } from "next-auth/react"

const initialFormData: JobOfferFormData = {
  title: "",
  location: "",
  contractType: "",
  salaryMin: undefined,
  salaryMax: undefined,
  displaySalary: false,
  workMode: "sur site",
  displayWorkMode: true,
  description: "",
  applicationMode: {
    viaCxJobs: true,
    atsUrl: undefined,
  },
  requirements: {
    skills: [],
    languages: [],
    benefits: [],
  },
  recruitment: [
    {
      title: "Candidature en ligne",
      duration: "Immédiat",
      description: "Soumission du CV et de la lettre de motivation",
    },
    {
      title: "Présélection des CV",
      duration: "2-3 jours",
      description: "Analyse des candidatures reçues",
    },
    {
      title: "",
      duration: "",
      description: "",
    },
  ],
  visibility: "public",
  expirationDate: "",
  notifyOnApplication: true,
  publishNow: false,
}

export default function CreateJobOfferPage() {
  const router = useRouter()
  const { data: sessionData, status } = useSession()
  const { formData, isSubmitting, isExpired, handleChange, handlePublish, handleSaveDraft } =
    useJobOfferForm(initialFormData)

  // 🚨 Redirect if not authenticated or not a company
  useEffect(() => {
    if (status === "loading") return // Wait until session is loaded
    if (!sessionData || sessionData.user.role !== "COMPANY") {
      router.push("/")
    }
  }, [sessionData, status, router])

  // 🕐 Optional: show nothing until session check is done
  if (status === "loading" || !sessionData || sessionData.user.role !== "COMPANY") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Créer une offre d'emploi</h1>
              <p className="text-sm text-muted-foreground">Espace Recruteur</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            <MainInformationSection formData={formData} onChange={handleChange} />
            <ApplicationModeSection formData={formData} onChange={handleChange} />
            <RequirementsSection formData={formData} onChange={handleChange} />
            <RecruitmentProcessSection formData={formData} onChange={handleChange} />
          </div>

          {/* Right Column - Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <PreviewSidebar
                formData={formData}
                onChange={handleChange}
                onPublish={handlePublish}
                onSaveDraft={handleSaveDraft}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

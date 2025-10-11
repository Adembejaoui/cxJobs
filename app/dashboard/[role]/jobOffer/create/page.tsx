"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainInformationSection } from "@/components/job-offer/main-information-section"
import { ApplicationModeSection } from "@/components/job-offer/application-mode-section"
import { RequirementsSection } from "@/components/job-offer/requirements-section"
import { PublicationSection } from "@/components/job-offer/publication-section"
import { PreviewSidebar } from "@/components/job-offer/preview-sidebar"
import type { JobOfferFormData } from "@/types/jobOffer"
import { useJobOfferForm } from "@/hooks/use-job-offer-form"

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
  },
  visibility: "public",
  expirationDate: "",
  notifyOnApplication: true,
  publishNow: false,
  status: "draft",
}

export default function CreateJobOfferPage() {
  const router = useRouter()
  const { formData, isSubmitting, isExpired, handleChange, handlePublish, handleSaveDraft } =
    useJobOfferForm(initialFormData)

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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <MainInformationSection formData={formData} onChange={handleChange} />
            <ApplicationModeSection formData={formData} onChange={handleChange} />
            <RequirementsSection formData={formData} onChange={handleChange} />
            <PublicationSection
              formData={formData}
              onChange={handleChange}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
              isExpired={isExpired}
            />
          </div>

          {/* Right Column - Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <PreviewSidebar formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

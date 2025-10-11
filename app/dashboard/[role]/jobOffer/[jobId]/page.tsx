"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, BarChart3 } from "lucide-react"
import { JobHeader } from "@/components/job-offer/prévisualiser/job-header"
import { DescriptionTab } from "@/components/job-offer/prévisualiser/description-tab"
import { CompanyTab } from "@/components/job-offer/prévisualiser/company-tab"
import { ProcessTab } from "@/components/job-offer/prévisualiser/process-tab"
import { ApplicationCard } from "@/components/job-offer/prévisualiser/application-card"
import { JobInfoCard } from "@/components/job-offer/prévisualiser/job-info-card"



interface JobOfferData {
  id: string
  title: string
  location: string
  contractType: string
  salaryMin?: number
  salaryMax?: number
  workMode: string
  description: string
  expirationDate?: string
  status: string
  requirements: {
    skills: string[]
    languages: string[]
  }
  createdAt: string
  company: {
    id: string
    name: string
    logoUrl?: string
    description?: string
    sector?: string
    size?: string
    foundedYear?: number
    website?: string
    advantages?: Array<{ title: string; description: string }>
    values?: Array<{ title: string; description: string }>
    recruitment?: Array<{ title: string; duration: string; description: string }>
  }
}

export default function JobOfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { role, jobId } = params
  const [jobOffer, setJobOffer] = useState<JobOfferData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    const fetchJobOffer = async () => {
      try {
        const response = await fetch(`/api/job-offers/${jobId}`)
        if (!response.ok) throw new Error("Failed to fetch job offer")
        const data = await response.json()
        setJobOffer(data.jobOffer)
      } catch (error) {
        console.error("[v0] Error fetching job offer:", error)
      } finally {
        setLoading(false)
      }
    }

    if (jobId) fetchJobOffer()
  }, [jobId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!jobOffer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Offre non trouvée</p>
          <p className="text-sm text-muted-foreground mt-2">Cette offre n'existe pas ou a été supprimée.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Retour aux offres
          </Button>
        </div>
      </div>
    )
  }

  const getExperienceLevel = () => {
    const skills = jobOffer.requirements.skills || []
    if (skills.length > 5) return "3-5 ans"
    if (skills.length > 3) return "1-2 ans"
    return "Débutant accepté"
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux offres
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-balance">Prévisualisation de l'offre</h1>
            <p className="text-sm text-muted-foreground mt-1">Voici comment votre offre apparaît aux candidats</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <JobHeader
              title={jobOffer.title}
              companyName={jobOffer.company.name}
              companyLogo={jobOffer.company.logoUrl}
              status={jobOffer.status}
              salaryMin={jobOffer.salaryMin}
              salaryMax={jobOffer.salaryMax}
              experienceLevel={getExperienceLevel()}
              expirationDate={jobOffer.expirationDate}
              location={jobOffer.location}
              contractType={jobOffer.contractType}
              workMode={jobOffer.workMode}
              languages={jobOffer.requirements.languages}
              skills={jobOffer.requirements.skills}
            />

            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b bg-muted/30">
                  <TabsList className="h-auto p-0 bg-transparent w-full justify-start px-6">
                    <TabsTrigger
                      value="description"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4 text-base font-medium transition-all"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="entreprise"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4 text-base font-medium transition-all"
                    >
                      Entreprise
                    </TabsTrigger>
                    <TabsTrigger
                      value="processus"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4 text-base font-medium transition-all"
                    >
                      Processus
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  <TabsContent value="description" className="mt-0">
                    <DescriptionTab
                      description={jobOffer.description}
                      skills={jobOffer.requirements.skills}
                      languages={jobOffer.requirements.languages}
                      advantages={jobOffer.company.advantages}
                    />
                  </TabsContent>

                  <TabsContent value="entreprise" className="mt-0">
                    <CompanyTab
                      companyName={jobOffer.company.name}
                      description={jobOffer.company.description}
                      sector={jobOffer.company.sector}
                      size={jobOffer.company.size}
                      foundedYear={jobOffer.company.foundedYear}
                      website={jobOffer.company.website}
                      values={jobOffer.company.values}
                    />
                  </TabsContent>

                  <TabsContent value="processus" className="mt-0">
                    <ProcessTab recruitment={jobOffer.company.recruitment} />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <ApplicationCard />
            <JobInfoCard createdAt={jobOffer.createdAt} expirationDate={jobOffer.expirationDate} jobId={jobOffer.id} />
           
          </div>
        </div>
      </div>
    </div>
  )
}
 /*<ShareCard /><StatisticsCard />*/
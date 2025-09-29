"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Ship as Skip, CheckCircle } from "lucide-react"
import { OnboardingStep } from "@/components/onboarding/onboarding-step"
import { PersonalInfoForm } from "@/components/onboarding/personal-info-form"
import { DynamicListForm } from "@/components/onboarding/dynamic-list-form"
import { DynamicFormRenderer } from "@/components/onboarding/dynamic-form-renderer"
import { getProfileConfig } from "@/lib/profile-config"

interface OnboardingData {
  personalInfo: Record<string, any>
  experiences: any[]
  education: any[]
  skills: any[]
  languages: any[]
  competences: any[]
  jobPreferences: Record<string, any>
}

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [userRole, setUserRole] = useState<"candidate" | "company">("candidate")

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {},
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    competences: [],
    jobPreferences: {},
  })

  const config = getProfileConfig(userRole)
  const steps = config.sections

  useEffect(() => {
    const loadProfileData = async () => {
      if (status === "loading") return
       if(userRole !== "candidate"){
         router.push(`dashboard/${userRole}/profile`)
      }
      if (!session?.user?.email) {
        router.push("/auth/signin")
        return
      }
     
      if (session.user.onboardingCompleted == true) {
        router.push(`dashboard/${session.user.role}/profile`)
      }

      try {
        setIsLoadingData(true)
        const response = await fetch("/api/onboarding")

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Loaded profile data:", data)

          if (data.profileData) {
            setOnboardingData({
              personalInfo: {
                fullName: data.profileData.personalInfo?.fullName || session.user.name || "",
                email: data.profileData.personalInfo?.email || session.user.email || "",
                phone: data.profileData.personalInfo?.phone || "",
                location: data.profileData.personalInfo?.location || "",
                professionalTitle: data.profileData.personalInfo?.professionalTitle || "",
                presentation: data.profileData.personalInfo?.presentation || "",
                ...data.profileData.personalInfo,
              },
              experiences: data.profileData.experiences || [],
              education: data.profileData.education || [],
              skills: data.profileData.skills || [],
              languages: data.profileData.languages || [],
              competences: data.profileData.competences || [],
              jobPreferences: data.profileData.preferences || {},
            })
          } else {
            setOnboardingData((prev) => ({
              ...prev,
              personalInfo: {
                fullName: session.user.name || "",
                email: session.user.email || "",
                phone: "",
                location: "",
                professionalTitle: "",
                presentation: "",
              },
            }))
          }
        }
      } catch (error) {
        console.error("[v0] Error loading profile data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadProfileData()
  }, [session, status, router])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Starting onboarding completion...")
      const response = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileData: onboardingData,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] API response:", result)

        const redirectUrl = result.redirectTo || "/dashboard"
        console.log("[v0] Redirecting to:", redirectUrl)

        window.location.href = redirectUrl
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] API error response:", errorData)
        throw new Error(errorData.error || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      console.error("[v0] Error completing onboarding:", error)
      alert("Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSectionChange = (sectionId: string, data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      [sectionId]: data,
    }))
  }

  const handleFieldChange = (field: string, value: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }))
  }

  if (status === "loading" || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de vos données...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const currentSection = steps[currentStep]

  const renderStepContent = () => {
    if (currentSection.id === "personalInfo" || currentSection.id === "companyInfo") {
      return (
        <PersonalInfoForm
          data={onboardingData.personalInfo}
          onChange={(data) =>
            setOnboardingData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }))
          }
          userType={userRole}
        />
      )
    }

    if (currentSection.isArray) {
      const arrayType = currentSection.id as "experiences" | "education" | "languages" | "competences" 

      return (
        <DynamicListForm
          items={(onboardingData[arrayType as keyof OnboardingData] as any[]) || []}
          onItemsChange={(items) => handleSectionChange(arrayType, items)}
          type={arrayType}
          addButtonText={currentSection.addButtonText || `Ajouter ${currentSection.itemTitle?.toLowerCase()}`}
        />
      )
    }

    return (
      <DynamicFormRenderer
        fields={currentSection.fields}
        data={onboardingData.jobPreferences}
        onChange={(field, value) =>
          handleSectionChange("jobPreferences", { ...onboardingData.jobPreferences, [field]: value })
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complétez votre profil</h1>
          <p className="text-muted-foreground">Aidez-nous à mieux vous connaître pour personnaliser votre expérience</p>
        </div>

        <OnboardingStep
          title={currentSection.title}
          description={`Complétez les informations de ${currentSection.title.toLowerCase()}`}
          currentStep={currentStep}
          totalSteps={steps.length}
          stepName={currentSection.title}
        >
          <div className="space-y-6">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrevious} disabled={isLoading}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Skip className="w-4 h-4 mr-2" />
                  Ignorer
                </Button>

                <Button onClick={handleNext} disabled={isLoading} className="min-w-[120px]">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Terminer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </OnboardingStep>

        {/* Progress Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <Badge
                  key={step.id}
                  variant={index <= currentStep ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  <span>{step.icon}</span>
                  {step.title}
                  {index < currentStep && <CheckCircle className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

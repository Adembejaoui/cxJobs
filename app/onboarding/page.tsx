"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react" // Added signIn import for session refresh
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"

import { OnboardingStep } from "@/components/onboarding/onboarding-step"
import { PersonalInfoForm } from "@/components/onboarding/personal-info-form"
import { DynamicListForm } from "@/components/onboarding/dynamic-list-form"

interface Experience {
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  isCurrentPosition: boolean
  description: string
}

interface Education {
  diploma: string
  institution: string
  startYear: string
  endYear: string
}

interface Skill {
  name: string
  level: string
}

interface Language {
  name: string
  level: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    professionalTitle: "",
    presentation: "",
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [languages, setLanguages] = useState<Language[]>([])

  const steps = [
    { key: "personalInfo", name: "Informations personnelles" },
    { key: "experiences", name: "Expériences" },
    { key: "education", name: "Formation" },
    { key: "skills", name: "Compétences" },
    { key: "languages", name: "Langues" },
  ]

  const currentStepKey = steps[currentStep]?.key

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const profileData = {
        personalInfo,
        experiences,
        education,
        skills,
        languages,
      }

      console.log("[v0] Submitting onboarding data")

      const response = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileData }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("[v0] Onboarding completed successfully")

      

        console.log("[v0] Refreshing session to update JWT token")
        await signIn("credentials", {
          email: personalInfo.email,
          redirect: false,
        })

        setTimeout(() => {
          console.log("[v0] Redirecting to dashboard")
          window.location.href = "/"
        }, 500)
      } else {
        throw new Error(data.error || "Erreur lors de la création du profil")
      }
    } catch (error) {
      console.error("[v0] Onboarding error:", error)
     
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStepKey) {
      case "personalInfo":
        return (
          <OnboardingStep
            title="Informations personnelles"
            description="Complétez vos informations de base"
            currentStep={currentStep}
            totalSteps={steps.length}
            stepName={steps[currentStep].name}
          >
            <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} userType="candidate" />
          </OnboardingStep>
        )

      case "experiences":
        return (
          <OnboardingStep
            title="Expériences professionnelles"
            description="Ajoutez vos expériences professionnelles"
            currentStep={currentStep}
            totalSteps={steps.length}
            stepName={steps[currentStep].name}
          >
            <DynamicListForm
              items={experiences}
              onItemsChange={setExperiences}
              type="experiences"
              addButtonText="Ajouter une expérience"
            />
          </OnboardingStep>
        )

      case "education":
        return (
          <OnboardingStep
            title="Formation"
            description="Ajoutez vos formations et diplômes"
            currentStep={currentStep}
            totalSteps={steps.length}
            stepName={steps[currentStep].name}
          >
            <DynamicListForm
              items={education}
              onItemsChange={setEducation}
              type="education"
              addButtonText="Ajouter une formation"
            />
          </OnboardingStep>
        )

      case "skills":
        return (
          <OnboardingStep
            title="Compétences"
            description="Ajoutez vos compétences techniques et professionnelles"
            currentStep={currentStep}
            totalSteps={steps.length}
            stepName={steps[currentStep].name}
          >
            <DynamicListForm
              items={skills}
              onItemsChange={setSkills}
              type="skills"
              addButtonText="Ajouter une compétence"
            />
          </OnboardingStep>
        )

      case "languages":
        return (
          <OnboardingStep
            title="Langues"
            description="Ajoutez les langues que vous maîtrisez"
            currentStep={currentStep}
            totalSteps={steps.length}
            stepName={steps[currentStep].name}
          >
            <DynamicListForm
              items={languages}
              onItemsChange={setLanguages}
              type="languages"
              addButtonText="Ajouter une langue"
            />
          </OnboardingStep>
        )

      default:
        return <div>Étape non implémentée</div>
    }
  }

  const canProceed = () => {
    switch (currentStepKey) {
      case "personalInfo":
        return (
          personalInfo.fullName &&
          personalInfo.email &&
          personalInfo.phone &&
          personalInfo.location &&
          personalInfo.presentation
        )
      case "experiences":
        return experiences.length > 0
      case "education":
        return education.length > 0
      case "skills":
        return skills.length > 0
      case "languages":
        return languages.length > 0
      default:
        return true
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          {isLastStep ? (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? "Création..." : "Terminer"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={!canProceed()}
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

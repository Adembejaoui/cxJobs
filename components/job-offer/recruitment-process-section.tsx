"use client"

import { FormSection } from "./form-section"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Plus, Lightbulb } from "lucide-react"
import { JobOfferFormData, RecruitmentStep } from "@/types/jobOffer"
import { defaultRecruitmentStep } from "@/lib/jobOfferConfig"


interface RecruitmentProcessSectionProps {
  formData: JobOfferFormData
  onChange: (field: string, value: any) => void
}

export function RecruitmentProcessSection({ formData, onChange }: RecruitmentProcessSectionProps) {
  const handleStepChange = (index: number, field: keyof RecruitmentStep, value: string) => {
    const newSteps = [...formData.recruitment]
    newSteps[index] = { ...newSteps[index], [field]: value }
    onChange("recruitment", newSteps)
  }

  const addStep = () => {
    onChange("recruitment", [...formData.recruitment, { ...defaultRecruitmentStep }])
  }

  const removeStep = (index: number) => {
    const newSteps = formData.recruitment.filter((_, i) => i !== index)
    onChange("recruitment", newSteps)
  }

  return (
    <FormSection title="Processus de recrutement" description="Définissez les étapes du processus de recrutement">
      <div className="space-y-6">
        {formData.recruitment.map((step, index) => (
          <div key={index} className="relative p-6 border rounded-lg bg-card space-y-4">
            {/* Step Number Badge */}
            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>

            {/* Remove Button */}
            {formData.recruitment.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                onClick={() => removeStep(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Step Title and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor={`step-title-${index}`} className="flex items-center gap-1">
                  Titre de l'étape <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`step-title-${index}`}
                  placeholder="Ex: Entretien téléphonique"
                  value={step.title}
                  onChange={(e) => handleStepChange(index, "title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`step-duration-${index}`}>Durée estimée</Label>
                <Input
                  id={`step-duration-${index}`}
                  placeholder="Ex: 2-3 jours"
                  value={step.duration}
                  onChange={(e) => handleStepChange(index, "duration", e.target.value)}
                />
              </div>
            </div>

            {/* Step Description */}
            <div className="space-y-2">
              <Label htmlFor={`step-description-${index}`}>Description</Label>
              <Textarea
                id={`step-description-${index}`}
                placeholder="Décrivez cette étape du processus..."
                value={step.description}
                onChange={(e) => handleStepChange(index, "description", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        ))}

        {/* Add Step Button */}
        <Button type="button" variant="outline" className="w-full bg-transparent" onClick={addStep}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une étape
        </Button>

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            <strong>Conseil :</strong> Un processus clair et transparent améliore l'expérience candidat et augmente le
            taux de conversion.
          </AlertDescription>
        </Alert>
      </div>
    </FormSection>
  )
}

"use client"

import { FormSection } from "./form-section"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { JobOfferFormData } from "@/types/jobOffer"
import { languages } from "@/lib/jobOfferConfig"

interface RequirementsSectionProps {
  formData: JobOfferFormData
  onChange: (field: string, value: any) => void
}

export function RequirementsSection({ formData, onChange }: RequirementsSectionProps) {
  const handleLanguageToggle = (language: string, checked: boolean) => {
    const currentLanguages = formData.requirements.languages || []
    const newLanguages = checked ? [...currentLanguages, language] : currentLanguages.filter((l) => l !== language)
    onChange("requirements", {
      ...formData.requirements,
      languages: newLanguages,
    })
  }

  return (
    <FormSection title="Exigences et compétences" description="Définissez les compétences et qualifications requises">
      <div className="space-y-6">
        {/* Required Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills" className="flex items-center gap-1">
            <span className="text-red-500">🎯</span> Compétences requises <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="skills"
            placeholder="Listez les compétences nécessaires pour ce poste"
            value={formData.requirements.skills.join("\n")}
            onChange={(e) =>
              onChange("requirements", {
                ...formData.requirements,
                skills: e.target.value.split("\n").filter((s) => s.trim()),
              })
            }
            rows={4}
          />
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1">
            <span className="text-blue-500">👥</span> Langues requises <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={formData.requirements.languages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageToggle(language, checked as boolean)}
                />
                <Label htmlFor={language} className="text-sm font-normal cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </div>


      </div>
    </FormSection>
  )
}

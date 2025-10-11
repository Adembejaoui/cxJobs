"use client"

import { FormSection } from "./form-section"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { JobOfferFormData } from "@/types/jobOffer"
import { contractTypes, locations, workModes } from "@/lib/jobOfferConfig"

interface MainInformationSectionProps {
  formData: JobOfferFormData
  onChange: (field: string, value: any) => void
}

export function MainInformationSection({ formData, onChange }: MainInformationSectionProps) {
  return (
    <FormSection title="Informations principales" description="Les informations essentielles de votre offre d'emploi">
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-1">
            Titre du poste <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Ex: Téléconseiller Français"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            required
          />
        </div>

        {/* Location and Contract Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1">
              <span className="text-blue-500">📍</span> Localisation <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.location} onValueChange={(value) => onChange("location", value)}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType" className="flex items-center gap-1">
              Type de contrat <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.contractType} onValueChange={(value) => onChange("contractType", value)}>
              <SelectTrigger id="contractType">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Salary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="displaySalary"
              checked={formData.displaySalary}
              onCheckedChange={(checked) => onChange("displaySalary", checked)}
            />
            <Label htmlFor="displaySalary" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <span className="text-yellow-500">💰</span> Afficher le salaire dans l'offre
            </Label>
          </div>

          {formData.displaySalary && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={formData.salaryMin || ""}
                onChange={(e) => onChange("salaryMin", e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={formData.salaryMax || ""}
                onChange={(e) => onChange("salaryMax", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          )}
        </div>

        {/* Work Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="displayWorkMode"
              checked={formData.displayWorkMode}
              onCheckedChange={(checked) => onChange("displayWorkMode", checked)}
            />
            <Label htmlFor="displayWorkMode" className="text-sm font-normal cursor-pointer">
              Mode de travail
            </Label>
          </div>

          {formData.displayWorkMode && (
            <RadioGroup
              value={formData.workMode}
              onValueChange={(value) => onChange("workMode", value)}
              className="grid grid-cols-3 gap-4"
            >
              {workModes.map((mode) => (
                <div key={mode.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={mode.value} id={mode.value} />
                  <Label htmlFor={mode.value} className="flex items-center gap-2 cursor-pointer font-normal">
                    <span>{mode.icon}</span>
                    <span>{mode.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-1">
            <span className="text-gray-500">📝</span> Description du poste <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Décrivez le poste, les responsabilités, etc."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={6}
            required
          />
        </div>
      </div>
    </FormSection>
  )
}

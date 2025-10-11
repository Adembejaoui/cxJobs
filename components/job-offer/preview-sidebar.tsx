"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, FileText, Briefcase, CheckCircle2, Languages } from "lucide-react"
import type { JobOfferFormData } from "@/types/jobOffer"

interface PreviewSidebarProps {
  formData: JobOfferFormData
}

export function PreviewSidebar({ formData }: PreviewSidebarProps) {
  return (
    <div className="space-y-6 pr-2">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Aperçu</h3>

        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <h4 className="font-semibold text-base">{formData.title || "Titre du poste"}</h4>
            <p className="text-sm text-muted-foreground">Votre Entreprise</p>
          </div>

          {/* Job Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {formData.contractType || "Type de contrat"}
              </Badge>
              {formData.displaySalary && formData.salaryMin && formData.salaryMax ? (
                <Badge variant="outline" className="text-xs">
                  {formData.salaryMin}€ - {formData.salaryMax}€
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Salaire à négocier
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{formData.location || "Localisation"}</span>
            </div>

            {formData.displayWorkMode && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{formData.workMode}</span>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {formData.description && (
            <div>
              <p className="text-sm text-muted-foreground line-clamp-3">{formData.description}</p>
            </div>
          )}

          <Separator />

          {/* Skills */}
          {formData.requirements.skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h5 className="font-medium text-sm">Compétences requises</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {formData.requirements.languages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-blue-600" />
                <h5 className="font-medium text-sm">Langues requises</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.languages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />
          {/* </CHANGE> */}

          {/* Application Mode */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">
                {formData.applicationMode.viaCxJobs ? "Candidature CXJobs" : "Redirection ATS"}
              </span>
            </div>
          </div>

          <Separator />
        </div>
      </Card>
    </div>
  )
}

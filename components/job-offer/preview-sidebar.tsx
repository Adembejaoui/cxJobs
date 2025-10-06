"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, FileText, Briefcase, AlertCircle } from "lucide-react"
import type { JobOfferFormData } from "@/types/jobOffer"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PreviewSidebarProps {
  formData: JobOfferFormData
  onChange: (field: string, value: any) => void
  onPublish: () => void
  onSaveDraft: () => void
  isSubmitting?: boolean
  isExpired?: boolean
}

export function PreviewSidebar({
  formData,
  onChange,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  isExpired = false,
}: PreviewSidebarProps) {
  return (
    <div className="space-y-6 pr-2">
      {/* Preview Card */}
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
              {formData.displaySalary && formData.salaryMin && (
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

          {/* Recruitment Process Preview */}
          {formData.recruitment.length > 0 && (
            <div>
              <h5 className="font-medium text-sm mb-3">Processus de recrutement</h5>
              <div className="space-y-2">
                {formData.recruitment.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{step.title || `Étape ${index + 1}`}</p>
                      {step.duration && <p className="text-xs text-muted-foreground">{step.duration}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Publication Settings */}
      <Card className="p-6">
        <h3 className="font-semibold text-base mb-4">Publication</h3>
        <div className="space-y-6">
          {/* Visibility */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Visibilité</Label>
            <RadioGroup
              value={formData.visibility}
              onValueChange={(value) => onChange("visibility", value as "public" | "private")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="text-sm font-normal cursor-pointer">
                  Publique
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="text-sm font-normal cursor-pointer">
                  Privée
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expirationDate" className="text-sm font-medium">
              Date d'expiration
            </Label>
            <div className="relative">
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate || ""}
                onChange={(e) => onChange("expirationDate", e.target.value)}
                className="pl-10"
                min={new Date().toISOString().split("T")[0]}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {isExpired && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                La date d'expiration est dépassée. Veuillez choisir une date future.
              </AlertDescription>
            </Alert>
          )}

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publishNow"
                checked={formData.publishNow}
                onCheckedChange={(checked) => onChange("publishNow", checked)}
              />
              <Label htmlFor="publishNow" className="text-sm font-normal cursor-pointer">
                Mettre en avant cette offre
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifyOnApplication"
                checked={formData.notifyOnApplication}
                onCheckedChange={(checked) => onChange("notifyOnApplication", checked)}
              />
              <Label htmlFor="notifyOnApplication" className="text-sm font-normal cursor-pointer">
                Recevoir des notifications
              </Label>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onPublish}
              disabled={isExpired || isSubmitting}
            >
              {isSubmitting ? "Publication en cours..." : "Publier l'offre"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={onSaveDraft}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer comme brouillon"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

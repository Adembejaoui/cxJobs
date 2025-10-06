"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JobOfferFormData } from "@/types/jobOffer"
import { FormSection } from "./form-section"



interface ApplicationModeSectionProps {
  formData: JobOfferFormData
  onChange: (field: string, value: any) => void
}

export function ApplicationModeSection({ formData, onChange }: ApplicationModeSectionProps) {
  const handleModeChange = (mode: "cxjobs" | "ats") => {
    onChange("applicationMode", {
      viaCxJobs: mode === "cxjobs",
      atsUrl: mode === "ats" ? formData.applicationMode.atsUrl : undefined,
    })
  }

  return (
    <FormSection title="Mode de candidature" description="Choisissez comment les candidats peuvent postuler">
      <div className="space-y-6">
        <RadioGroup
          value={formData.applicationMode.viaCxJobs ? "cxjobs" : "ats"}
          onValueChange={(value: string) => handleModeChange(value as "cxjobs" | "ats")}
          className="space-y-4"
        >
          {/* CXJobs Option */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="cxjobs" id="cxjobs" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="cxjobs" className="flex items-center gap-2 cursor-pointer font-medium">
                <span className="text-lg">📄</span>
                Candidature via CXJobs{" "}
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Recommandé
                </Badge>
              </Label>
              <p className="text-sm text-muted-foreground mt-2">
                Les candidats postulent directement sur CXJobs. Vous recevez toutes les candidatures dans votre tableau
                de bord avec des outils de gestion intégrés.
              </p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                <span>✓ Gestion centralisée</span>
                <span>✓ Outils de tri</span>
                <span>✓ Communication intégrée</span>
                <span>✓ Statistiques détaillées</span>
              </div>
            </div>
          </div>

          {/* ATS Redirect Option */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="ats" id="ats" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="ats" className="flex items-center gap-2 cursor-pointer font-medium">
                <span className="text-lg">🔗</span>
                Redirection vers votre ATS
              </Label>
              <p className="text-sm text-muted-foreground mt-2">
                Les candidats sont redirigés vers votre système de candidature externe (ATS). Idéal si vous utilisez
                déjà un système comme Workday, BambooHR, etc.
              </p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                <span>✓ Intégration avec votre ATS</span>
                <span>✓ Processus unifié</span>
                <span>✓ Données centralisées</span>
              </div>

              {!formData.applicationMode.viaCxJobs && (
                <div className="mt-4">
                  <Input
                    type="url"
                    placeholder="https://votre-ats.com/apply"
                    value={formData.applicationMode.atsUrl || ""}
                    onChange={(e) =>
                      onChange("applicationMode", {
                        ...formData.applicationMode,
                        atsUrl: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
    </FormSection>
  )
}

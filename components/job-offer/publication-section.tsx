"use client"

import { FormSection } from "./form-section"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, AlertCircle } from "lucide-react"
import type { JobOfferFormData } from "@/types/jobOffer"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PublicationSectionProps {
  formData: JobOfferFormData
  onChange: (field: string, value: any) => void
  onPublish: () => void
  onSaveDraft: () => void
  isSubmitting?: boolean
  isExpired?: boolean
}

export function PublicationSection({
  formData,
  onChange,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  isExpired = false,
}: PublicationSectionProps) {
  return (
    <FormSection title="Publication" description="Configurez les paramètres de publication de votre offre">
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
    </FormSection>
  )
}

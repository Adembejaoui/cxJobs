"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { JobOfferFormData } from "@/types/jobOffer"
import { ApiError, apiRequest } from "@/lib/api"
import { useSession } from "next-auth/react"

export function useJobOfferForm(initialData: JobOfferFormData) {
  const [formData, setFormData] = useState<JobOfferFormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: sessionData } = useSession()

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isExpired = () => {
    if (!formData.expirationDate) return false
    const expirationDate = new Date(formData.expirationDate)
    const now = new Date()
    return expirationDate < now
  }

  const validateForm = () => {
    if (!formData.title || !formData.location || !formData.contractType) {
      toast.error("Champs requis manquants", {
        description: "Veuillez remplir tous les champs obligatoires.",
      })
      return false
    }

    if (isExpired()) {
      toast.error("Date d'expiration invalide", {
        description: "La date d'expiration ne peut pas être dans le passé.",
      })
      return false
    }

    return true
  }

  const submitJobOffer = async (publishNow: boolean) => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await apiRequest<{ message: string; jobOffer: any }>("/api/job-offers", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          publishNow,
          userId: sessionData?.user?.id,
        }),
      })

      toast.success(publishNow ? "Offre publiée !" : "Brouillon enregistré", {
        description: response.message,
      })

      console.log("[v0] Job offer created:", response.jobOffer)
      return response.jobOffer
    } catch (error) {
      console.error("[v0] Error submitting job offer:", error)

      if (error instanceof ApiError) {
        toast.error("Erreur", { description: error.message })
      } else {
        toast.error("Erreur", {
          description: "Une erreur inattendue est survenue.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = () => submitJobOffer(true)
  const handleSaveDraft = () => submitJobOffer(false)

  return {
    formData,
    isSubmitting,
    isExpired: isExpired(),
    handleChange,
    handlePublish,
    handleSaveDraft,
  }
}

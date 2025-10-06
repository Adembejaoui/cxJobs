"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Building2, AlertCircle } from "lucide-react"
import type { ProfileConfig, ProfileSection } from "@/lib/profile-config"
import { cn } from "@/lib/utils"
import { PersonalInfoForm } from "./personal-info-form"
import { DynamicListForm } from "./dynamic-list-form"
import { SimpleImageUpload } from "./image-upload-field"
import { DynamicFormRenderer } from "./dynamic-form-renderer"

interface ProfileEditProps {
  config: ProfileConfig
  initialData?: any
  onSave: (data: any) => Promise<void>
  role: "candidate" | "company"
  className?: string
}

function createValidationSchema(config: ProfileConfig) {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  config.sections.forEach((section) => {
    if (section.isArray) {
      const itemSchema: Record<string, z.ZodTypeAny> = {}
      section.fields.forEach((field) => {
        let fieldSchema: z.ZodTypeAny

        switch (field.type) {
          case "email":
            fieldSchema = field.required
              ? z.string().min(1, "Ce champ est requis").email("Email invalide")
              : z.string().email("Email invalide").optional().or(z.literal(""))
            break
          case "text":
          case "textarea":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            if (field.maxLength) {
              fieldSchema = (fieldSchema as z.ZodString).max(field.maxLength, `Maximum ${field.maxLength} caractères`)
            }
            break
          case "number":
            fieldSchema = field.required
              ? z.number().or(
                  z
                    .string()
                    .min(1, "Ce champ est requis")
                    .transform((val) => Number(val)),
                )
              : z
                  .number()
                  .optional()
                  .or(z.string().transform((val) => (val ? Number(val) : undefined)))
            break
          case "date":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            break
          case "checkbox":
            fieldSchema = z.boolean().optional()
            break
          case "file":
            fieldSchema = field.required
              ? z.any().refine((val) => val !== null && val !== undefined && val !== "", {
                  message: "Ce champ est requis",
                })
              : z.any().optional()
            break
          case "multiselect":
            fieldSchema = field.required
              ? z.array(z.string()).min(1, "Sélectionnez au moins une option")
              : z.array(z.string()).optional()
            break
          case "select":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            break
          default:
            fieldSchema = z.any()
        }

        itemSchema[field.name] = fieldSchema
      })
      schemaFields[section.id] = z.array(z.object(itemSchema)).optional()
    } else {
      section.fields.forEach((field) => {
        let fieldSchema: z.ZodTypeAny

        switch (field.type) {
          case "email":
            fieldSchema = field.required
              ? z.string().min(1, "Ce champ est requis").email("Email invalide")
              : z.string().email("Email invalide").optional().or(z.literal(""))
            break
          case "text":
          case "textarea":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            if (field.maxLength) {
              fieldSchema = (fieldSchema as z.ZodString).max(field.maxLength, `Maximum ${field.maxLength} caractères`)
            }
            break
          case "tel":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            break
          case "number":
            fieldSchema = field.required
              ? z.number().or(
                  z
                    .string()
                    .min(1, "Ce champ est requis")
                    .transform((val) => Number(val)),
                )
              : z
                  .number()
                  .optional()
                  .or(z.string().transform((val) => (val ? Number(val) : undefined)))
            break
          case "date":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            break
          case "checkbox":
            fieldSchema = z.boolean().optional()
            break
          case "file":
            fieldSchema = field.required
              ? z.any().refine((val) => val !== null && val !== undefined && val !== "", {
                  message: "Ce champ est requis",
                })
              : z.any().optional()
            break
          case "multiselect":
            fieldSchema = field.required
              ? z.array(z.string()).min(1, "Sélectionnez au moins une option")
              : z.array(z.string()).optional()
            break
          case "select":
            fieldSchema = field.required ? z.string().min(1, "Ce champ est requis") : z.string().optional()
            break
          default:
            fieldSchema = z.any()
        }

        schemaFields[field.name] = fieldSchema
      })
    }
  })

  return z.object(schemaFields)
}

function ProfilePreview({ data, role }: { data: any; role: "candidate" | "company" }) {
  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    )
  }

  if (role === "candidate") {
    return (
      <Card className="sticky top-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg">Aperçu du profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={data.logo || "/placeholder.svg"} />
              <AvatarFallback className="bg-green-500 text-white text-lg">
                {getInitials(data.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{data.name || "Nom complet"}</h3>
              <p className="text-sm text-muted-foreground">{data.jobTitle || "Titre professionnel"}</p>
              <p className="text-sm text-muted-foreground">{data.location || "Localisation"}</p>
            </div>
          </div>

          {data.presentation && (
            <div>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">{data.presentation}</p>
            </div>
          )}

          {data.experiences?.length > 0 && (
            <div>
              <Separator className="my-3" />
              <h4 className="font-medium text-sm mb-2">Dernière expérience</h4>
              <div className="text-sm">
                <p className="font-medium">{data.experiences[0]?.title}</p>
                <p className="text-muted-foreground">{data.experiences[0]?.company}</p>
              </div>
            </div>
          )}

          {data.competences?.length > 0 && (
            <div>
              <Separator className="my-3" />
              <h4 className="font-medium text-sm mb-2">Compétences</h4>
              <div className="flex flex-wrap gap-1">
                {data.competences.slice(0, 3).map((skill: any, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill.name}
                  </Badge>
                ))}
                {data.competences.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.competences.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg">Aperçu public</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={data.logo || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-white text-lg">{getInitials(data.name || "")}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{data.name || "CallCenter Pro"}</h3>
            <p className="text-sm text-muted-foreground">{data.sector || "Services"}</p>
            <p className="text-sm text-muted-foreground">📍 {data.address || "Avenue Habib Bourguiba"}</p>
            <p className="text-sm text-muted-foreground">👥 {data.size || "50-100 employés"}</p>
          </div>
        </div>

        {data.description && (
          <div>
            <Separator className="my-3" />
            <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ProfileEdit({ config, initialData = {}, onSave, role, className }: ProfileEditProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialData)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showValidationAlert, setShowValidationAlert] = useState(false)

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSectionChange = (sectionId: string, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [sectionId]: data,
    }))
  }

  const handleArrayChange = (sectionId: string, items: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [sectionId]: items,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowValidationAlert(false)
    setValidationErrors({})

    const schema = createValidationSchema(config)

    try {
      // Validate the form data
      schema.parse(formData)

      setIsLoading(true)
      await onSave(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const path = issue.path.join(".")
          errors[path] = issue.message
        })
        setValidationErrors(errors)
        setShowValidationAlert(true)

        // Scroll to first error
        const firstErrorElement = document.querySelector('[class*="border-red-500"]')
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      } else {
        console.error("Error saving profile:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderSection = (section: ProfileSection) => {
    // Handle personal info sections with specialized component
    if (section.id === "personalInfo" || section.id === "companyInfo") {
      return (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(validationErrors).some((key) => section.fields.some((field) => field.name === key)) && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Veuillez remplir tous les champs obligatoires</AlertDescription>
              </Alert>
            )}
            <PersonalInfoForm
              data={formData}
              onChange={(data) => setFormData((prev: any) => ({ ...prev, ...data }))}
              userType={role === "candidate" ? "candidate" : "company"}
              errors={validationErrors}
            />
          </CardContent>
        </Card>
      )
    }

    // Handle array sections with DynamicListForm
    if (section.isArray) {
      const arrayType = section.id as "experiences" | "education" | "competences" | "languages"

      return (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicListForm
              items={formData[section.id] || []}
              onItemsChange={(items) => handleArrayChange(section.id, items)}
              type={arrayType}
              addButtonText={section.addButtonText || `Ajouter ${section.itemTitle?.toLowerCase()}`}
            />
          </CardContent>
        </Card>
      )
    }

    // Handle media sections with image upload fields
    if (section.id === "mediaAndPhotos") {
      return (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {section.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                <SimpleImageUpload
                  value={formData[field.name] || ""}
                  onChange={(value) => handleFieldChange(field.name, value)}
                />
                {validationErrors[field.name] && <p className="text-sm text-red-500">{validationErrors[field.name]}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )
    }

    // Handle other sections with DynamicFormRenderer
    return (
      <Card key={section.id}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-xl">{section.icon}</span>
            {section.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFormRenderer
            fields={section.fields}
            data={formData}
            onChange={handleFieldChange}
            errors={validationErrors}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("container mx-auto px-4 py-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {role === "candidate" ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                <h1 className="text-2xl font-bold">{role === "candidate" ? "Mon Profil" : "Profil de l'entreprise"}</h1>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>

            {showValidationAlert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Veuillez corriger les erreurs dans le formulaire avant de continuer</AlertDescription>
              </Alert>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
              {config.sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span>{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </div>

            {/* Form Sections */}
            {config.sections.map(renderSection)}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>

        {/* Profile Preview */}
        <div className="lg:col-span-1">
          <ProfilePreview data={formData} role={role} />
        </div>
      </div>
    </div>
  )
}

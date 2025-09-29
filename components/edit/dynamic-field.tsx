"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { ProfileField } from "@/lib/profile-config"
import { SimpleImageUpload } from "../onboarding/image-upload-field"

interface DynamicFieldProps {
  field: ProfileField
  value: any
  onChange: (value: any) => void
  error?: string
}

export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  const [fileName, setFileName] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (newValue: any) => {
    onChange(newValue)
  }

  const handleUploadComplete = (res: any) => {
    if (res && res[0]) {
      const uploadedFile = res[0]
      setFileName(uploadedFile.name)
      onChange(uploadedFile.url) // Store the URL instead of File object
      setIsUploading(false)
    }
  }

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error)
    setIsUploading(false)
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          /* Enhanced input styling with better focus states */
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            maxLength={field.maxLength}
            className="h-11 bg-input border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(Number.parseInt(e.target.value) || "")}
            className="h-11 bg-input border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        )

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="h-11 bg-input border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            rows={field.rows || 4}
            maxLength={field.maxLength}
            className="min-h-[100px] bg-input border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={handleChange}>
            <SelectTrigger className="h-11 bg-input border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
              <SelectValue placeholder={field.placeholder || `Sélectionner ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/50 shadow-lg">
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-accent/50 focus:bg-accent/50 transition-colors duration-150"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect":
        const normalizeValue = (val: any): string[] => {
          if (!Array.isArray(val)) return []
          return val.map((item: any) => {
            if (typeof item === "string") return item
            if (typeof item === "object" && item.name) return item.name
            return String(item)
          })
        }

        const normalizedValue = normalizeValue(value)
        console.log(
          "[v0] Multiselect field:",
          field.name,
          "normalized value:",
          normalizedValue,
          "from original:",
          value,
        )

        return (
          /* Better multiselect design with improved spacing */
          <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    checked={normalizedValue.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleChange([...normalizedValue, option.value])
                      } else {
                        handleChange(normalizedValue.filter((v: string) => v !== option.value))
                      }
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm font-medium cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg border border-border/50">
            <Checkbox
              id={field.name}
              checked={!!value}
              onCheckedChange={handleChange}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor={field.name} className="text-sm font-medium cursor-pointer">
              {field.label}
            </Label>
          </div>
        )

      case "file":
        const isImageUrl = (url: string) => {
          return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
        }

        return (
          /* Enhanced file upload with UploadThing integration */
          <div className="space-y-4">
            <SimpleImageUpload value={value} onChange={(url) => handleChange(url)} />
          </div>
        )

      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="h-11 bg-input border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">{error}</p>
      )}
      {field.description && field.type !== "file" && (
        <p className="text-xs text-muted-foreground bg-muted/20 p-2 rounded border border-border/30">
          {field.description}
        </p>
      )}
    </div>
  )
}

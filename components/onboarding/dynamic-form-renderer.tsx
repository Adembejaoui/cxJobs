"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { ProfileField } from "@/lib/profile-config"

interface DynamicFormRendererProps {
  fields: ProfileField[]
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  errors?: Record<string, string>
}

export function DynamicFormRenderer({ fields, data, onChange, errors = {} }: DynamicFormRendererProps) {
  const handleMultiselectChange = (field: string, value: string, currentValues: string[] = []) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    onChange(field, newValues)
  }

  const removeMultiselectValue = (field: string, valueToRemove: string, currentValues: string[] = []) => {
    const newValues = currentValues.filter((v) => v !== valueToRemove)
    onChange(field, newValues)
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {field.type === "text" && (
            <>
              <Input
                id={field.name}
                value={data[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.type === "email" && (
            <>
              <Input
                id={field.name}
                type="email"
                value={data[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.type === "tel" && (
            <>
              <Input
                id={field.name}
                type="tel"
                value={data[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.type === "number" && (
            <>
              <Input
                id={field.name}
                type="number"
                value={data[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value ? Number(e.target.value) : "")}
                placeholder={field.placeholder}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.type === "textarea" && (
            <>
              <Textarea
                id={field.name}
                value={data[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows || 4}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.type === "select" && (
            <>
              <Select value={data[field.name] || ""} onValueChange={(value) => onChange(field.name, value)}>
                <SelectTrigger className={errors[field.name] ? "border-red-500" : ""}>
                  <SelectValue placeholder={field.placeholder || `Sélectionnez ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.type === "multiselect" && (
            <div className="space-y-3">
              <Select onValueChange={(value) => handleMultiselectChange(field.name, value, data[field.name] || [])}>
                <SelectTrigger className={errors[field.name] ? "border-red-500" : ""}>
                  <SelectValue placeholder={field.placeholder || `Sélectionnez ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {data[field.name] && data[field.name].length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data[field.name].map((value: string) => {
                    const option = field.options?.find((opt) => opt.value === value)
                    return (
                      <Badge key={value} variant="secondary" className="flex items-center gap-1">
                        {option?.label || value}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeMultiselectValue(field.name, value, data[field.name])}
                        />
                      </Badge>
                    )
                  })}
                </div>
              )}

              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </div>
          )}

          {field.type === "checkbox" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={data[field.name] || false}
                onCheckedChange={(checked) => onChange(field.name, checked)}
              />
              <Label htmlFor={field.name} className="text-sm font-normal cursor-pointer">
                {field.label}
              </Label>
            </div>
          )}

          {field.type === "file" && (
            <>
              <Input
                id={field.name}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    onChange(field.name, file)
                  }
                }}
                accept={field.accept || "image/*"}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
            </>
          )}

          {field.description && !errors[field.name] && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}

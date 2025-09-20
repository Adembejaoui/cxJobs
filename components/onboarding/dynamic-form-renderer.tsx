"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { FieldConfig } from "@/lib/profile-config"

interface DynamicFormRendererProps {
  fields: FieldConfig[]
  data: Record<string, any>
  onChange: (field: string, value: any) => void
}

export function DynamicFormRenderer({ fields, data, onChange }: DynamicFormRendererProps) {
  const renderField = (field: FieldConfig) => {
    const value = data[field.name] || ""
    const gridClass = field.gridCols === 1 ? "md:col-span-1" : "md:col-span-2"

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div key={field.name} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={field.name} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              required={field.required}
            />
          </div>
        )

      case "select":
        return (
          <div key={field.name} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => onChange(field.name, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "multiselect":
        return (
          <div key={field.name} className={`space-y-2 ${gridClass}`}>
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : []
                      if (checked) {
                        onChange(field.name, [...currentValues, option.value])
                      } else {
                        onChange(
                          field.name,
                          currentValues.filter((v: string) => v !== option.value),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div key={field.name} className={`flex items-center space-x-2 ${gridClass}`}>
            <Checkbox id={field.name} checked={!!value} onCheckedChange={(checked) => onChange(field.name, checked)} />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        )

      case "date":
        return (
          <div key={field.name} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="month"
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        )

      default:
        return null
    }
  }

  return <div className="grid md:grid-cols-2 gap-4">{fields.map(renderField)}</div>
}

"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PredefinedInput from "../PredefinedInput"

interface DynamicListFormProps {
  items: any[]
  onItemsChange: (items: any[]) => void
  type: "experiences" | "formations" | "languages" | "competences" | "education"
  addButtonText: string
}

export function DynamicListForm({ items, onItemsChange, type, addButtonText }: DynamicListFormProps) {
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({})

  const addItem = () => {
    const newItem = getEmptyItem(type)
    onItemsChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onItemsChange(newItems)
    const newErrors = { ...errors }
    delete newErrors[index]
    setErrors(newErrors)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onItemsChange(newItems)

    if (errors[index]?.[field]) {
      const newErrors = { ...errors }
      delete newErrors[index][field]
      setErrors(newErrors)
    }
  }

  const validateItem = (item: any, index: number): boolean => {
    const requiredFields = getRequiredFields(type)
    const itemErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (!item[field] || item[field].toString().trim() === "") {
        itemErrors[field] = "Ce champ est requis"
      }
    })

    if (Object.keys(itemErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [index]: itemErrors }))
      return false
    }

    return true
  }

  const getRequiredFields = (type: string): string[] => {
    switch (type) {
      case "experiences":
        return ["title", "company", "startDate"]
      case "education":
        return ["degree", "school"]
      case "languages":
        return ["name", "level"]
      case "competences":
        return ["name", "level"]
      default:
        return []
    }
  }

  const getEmptyItem = (type: string) => {
    switch (type) {
      case "experiences":
        return { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }
      case "education":
        return { degree: "", school: "", startDate: "", endDate: "", description: "" }
      case "languages":
        return { language: "", level: "" }
      case "competences":
        return { name: "", level: "" }
      default:
        return {}
    }
  }

  const renderItemForm = (item: any, index: number) => {
    const itemErrors = errors[index] || {}

    switch (type) {
      case "experiences":
        return (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Expérience {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(itemErrors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Veuillez remplir tous les champs obligatoires</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Poste <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={item.title || ""}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="Agent de support client"
                    className={itemErrors.title ? "border-red-500" : ""}
                  />
                  {itemErrors.title && <p className="text-sm text-red-500">{itemErrors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label>
                    Entreprise <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={item.company || ""}
                    onChange={(e) => updateItem(index, "company", e.target.value)}
                    placeholder="CallCenter Pro"
                    className={itemErrors.company ? "border-red-500" : ""}
                  />
                  {itemErrors.company && <p className="text-sm text-red-500">{itemErrors.company}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Input
                    value={item.location || ""}
                    onChange={(e) => updateItem(index, "location", e.target.value)}
                    placeholder="Tunis, Tunisie"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Date de début <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={item.startDate || ""}
                    onChange={(e) => updateItem(index, "startDate", e.target.value)}
                    className={itemErrors.startDate ? "border-red-500" : ""}
                  />
                  {itemErrors.startDate && <p className="text-sm text-red-500">{itemErrors.startDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    value={item.endDate || ""}
                    onChange={(e) => updateItem(index, "endDate", e.target.value)}
                    disabled={item.current}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={item.current || false}
                  onChange={(e) => updateItem(index, "current", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-${index}`} className="font-normal cursor-pointer">
                  Poste actuel
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Décrivez vos responsabilités et réalisations..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )

      case "formations":
        return (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Formation {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(itemErrors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Veuillez remplir tous les champs obligatoires</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Diplôme <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={item.degree || ""}
                    onChange={(e) => updateItem(index, "degree", e.target.value)}
                    placeholder="Licence en Informatique"
                    className={itemErrors.degree ? "border-red-500" : ""}
                  />
                  {itemErrors.degree && <p className="text-sm text-red-500">{itemErrors.degree}</p>}
                </div>
                <div className="space-y-2">
                  <Label>
                    École/Université <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={item.school || ""}
                    onChange={(e) => updateItem(index, "school", e.target.value)}
                    placeholder="Université de Tunis"
                    className={itemErrors.school ? "border-red-500" : ""}
                  />
                  {itemErrors.school && <p className="text-sm text-red-500">{itemErrors.school}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input
                    type="date"
                    value={item.startDate || ""}
                    onChange={(e) => updateItem(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    value={item.endDate || ""}
                    onChange={(e) => updateItem(index, "endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Détails sur la formation..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

  case "competences":
  return (
     <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Competence {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(itemErrors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Veuillez remplir tous les champs obligatoires</AlertDescription>
                </Alert>
              )}
                <div className="space-y-2">
                  <Label>
                    Competence <span className="text-red-500">*</span>
                  </Label>
                  <PredefinedInput
                    category="competences"
                    value={item.name || ""}
                    onChange={(val) => updateItem(index, "name", val)}
                  />

          {/* Niveau */}
          <div className="space-y-2">
            <Label>
              Niveau <span className="text-red-500">*</span>
            </Label>
            <Select
              value={item.level || ""}
              onValueChange={(value) => updateItem(index, "level", value)}
            >
              <SelectTrigger
                className={itemErrors.level ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionnez le niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="advanced">Avancé</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            {itemErrors.level && (
              <p className="text-sm text-red-500">{itemErrors.level}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );


    case "languages":
        return (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Langue {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(itemErrors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Veuillez remplir tous les champs obligatoires</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Langue <span className="text-red-500">*</span>
                  </Label>
                  <PredefinedInput
                    category="languages"
                    value={item.language || ""}
                    onChange={(val) => updateItem(index, "language", val)}
                  />
                  {itemErrors.language && <p className="text-sm text-red-500">{itemErrors.language}</p>}
                </div>
                <div className="space-y-2">
                  <Label>
                    Niveau <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={item.level || ""}
                    onValueChange={(value) => updateItem(index, "level", value)}
                  >
                    <SelectTrigger className={itemErrors.level ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionnez le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Débutant</SelectItem>
                      <SelectItem value="A2">A2 - Élémentaire</SelectItem>
                      <SelectItem value="B1">B1 - Intermédiaire</SelectItem>
                      <SelectItem value="B2">B2 - Intermédiaire avancé</SelectItem>
                      <SelectItem value="C1">C1 - Avancé</SelectItem>
                      <SelectItem value="C2">C2 - Maîtrise</SelectItem>
                      <SelectItem value="native">Langue maternelle</SelectItem>
                    </SelectContent>
                  </Select>
                  {itemErrors.level && <p className="text-sm text-red-500">{itemErrors.level}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => renderItemForm(item, index))}

      <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  )
}
  
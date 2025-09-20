"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"

interface BaseItem {
  id?: string
}

interface Experience extends BaseItem {
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  isCurrentPosition: boolean
  description: string
}

interface Education extends BaseItem {
  diploma: string
  institution: string
  startYear: string
  endYear: string
}

interface Skill extends BaseItem {
  name: string
  level: string
}

interface Language extends BaseItem {
  name: string
  level: string
}

type ListItem = Experience | Education | Skill | Language

interface DynamicListFormProps<T extends ListItem> {
  items: T[]
  onItemsChange: (items: T[]) => void
  type: "experiences" | "education" | "skills" | "languages"
  addButtonText: string
}

export function DynamicListForm<T extends ListItem>({
  items,
  onItemsChange,
  type,
  addButtonText,
}: DynamicListFormProps<T>) {
  const addItem = () => {
    let newItem: any
    switch (type) {
      case "experiences":
        newItem = {
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          isCurrentPosition: false,
          description: "",
        }
        break
      case "education":
        newItem = {
          diploma: "",
          institution: "",
          startYear: "",
          endYear: "",
        }
        break
      case "skills":
        newItem = { name: "", level: "Intermédiaire" }
        break
      case "languages":
        newItem = { name: "", level: "Intermédiaire" }
        break
    }
    onItemsChange([...items, newItem as T])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    ;(newItems[index] as any)[field] = value
    onItemsChange(newItems)
  }

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index))
  }

  const renderItemForm = (item: T, index: number) => {
    switch (type) {
      case "experiences":
        const exp = item as Experience
        return (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre du poste</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) => updateItem(index, "jobTitle", e.target.value)}
                    placeholder="Développeur Full Stack"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateItem(index, "company", e.target.value)}
                    placeholder="Mon Entreprise"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateItem(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateItem(index, "endDate", e.target.value)}
                    disabled={exp.isCurrentPosition}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${index}`}
                  checked={exp.isCurrentPosition}
                  onCheckedChange={(checked) => {
                    updateItem(index, "isCurrentPosition", checked)
                    if (checked) updateItem(index, "endDate", "")
                  }}
                />
                <Label htmlFor={`current-${index}`}>Poste actuel</Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Décrivez vos responsabilités et réalisations..."
                  rows={3}
                />
              </div>

              <Button variant="outline" size="sm" onClick={() => removeItem(index)} className="w-fit">
                <X className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </Card>
        )

      case "education":
        const edu = item as Education
        return (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Diplôme</Label>
                  <Input
                    value={edu.diploma}
                    onChange={(e) => updateItem(index, "diploma", e.target.value)}
                    placeholder="Master en Informatique"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Établissement</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateItem(index, "institution", e.target.value)}
                    placeholder="Université de Paris"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Année de début</Label>
                  <Input
                    value={edu.startYear}
                    onChange={(e) => updateItem(index, "startYear", e.target.value)}
                    placeholder="2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Année de fin</Label>
                  <Input
                    value={edu.endYear}
                    onChange={(e) => updateItem(index, "endYear", e.target.value)}
                    placeholder="2022"
                  />
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => removeItem(index)} className="w-fit">
                <X className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </Card>
        )

      case "skills":
      case "languages":
        const skillOrLang = item as Skill | Language
        const levels =
          type === "skills"
            ? ["Débutant", "Intermédiaire", "Avancé", "Expert"]
            : ["Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"]

        return (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>{type === "skills" ? "Compétence" : "Langue"}</Label>
              <Input
                value={skillOrLang.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder={type === "skills" ? "React, JavaScript, etc." : "Français, Anglais, etc."}
              />
            </div>
            <div className="w-40 space-y-2">
              <Label>Niveau</Label>
              <Select value={skillOrLang.level} onValueChange={(value: any) => updateItem(index, "level", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={() => removeItem(index)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => renderItemForm(item, index))}
      <Button variant="outline" onClick={addItem} className="w-full bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  )
}

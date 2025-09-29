"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

interface DynamicListFormProps {
  items: any[]
  onItemsChange: (items: any[]) => void
  type: "experiences" | "education" | "languages" | "competences"
  addButtonText: string
}

export function DynamicListForm({ items, onItemsChange, type, addButtonText }: DynamicListFormProps) {
  const addItem = () => {
    const newItem = getEmptyItem(type)
    onItemsChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onItemsChange(newItems)
  }

  const getEmptyItem = (type: string) => {
    switch (type) {
      case "experiences":
        return { title: "", company: "", startDate: "", endDate: "", description: "" }
      case "education":
        return { degree: "", school: "", year: "", description: "" }
      case "languages":
        return { name: "", level: "" }
      case "competences":
        return { name: "", level: "" }
      default:
        return {}
    }
  }

  const renderItemForm = (item: any, index: number) => {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input
                    value={item.title || ""}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="Agent de support client"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input
                    value={item.company || ""}
                    onChange={(e) => updateItem(index, "company", e.target.value)}
                    placeholder="CallCenter Pro"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input
                    value={item.startDate || ""}
                    onChange={(e) => updateItem(index, "startDate", e.target.value)}
                    placeholder="Janvier 2021"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    value={item.endDate || ""}
                    onChange={(e) => updateItem(index, "endDate", e.target.value)}
                    placeholder="Présent"
                  />
                </div>
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

      case "education":
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Diplôme</Label>
                  <Input
                    value={item.degree || ""}
                    onChange={(e) => updateItem(index, "degree", e.target.value)}
                    placeholder="Licence en Informatique"
                  />
                </div>
                <div className="space-y-2">
                  <Label>École/Université</Label>
                  <Input
                    value={item.school || ""}
                    onChange={(e) => updateItem(index, "school", e.target.value)}
                    placeholder="Université de Tunis"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Année</Label>
                <Input
                  value={item.year || ""}
                  onChange={(e) => updateItem(index, "year", e.target.value)}
                  placeholder="2020"
                />
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
                <CardTitle className="text-lg">Compétence {index + 1}</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Compétence</Label>
                  <Input
                    value={item.name || ""}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Communication client"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <Select value={item.level || ""} onValueChange={(value) => updateItem(index, "level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Input
                    value={item.name || ""}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Français"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <Select value={item.level || ""} onValueChange={(value) => updateItem(index, "level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                      <SelectItem value="native">Natif</SelectItem>
                    </SelectContent>
                  </Select>
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProfileSection } from "@/lib/profile-config"
import { DynamicField } from "./dynamic-field"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ArraySectionProps {
  section: ProfileSection
  values: any[]
  onChange: (values: any[]) => void
}

export function ArraySection({ section, values, onChange }: ArraySectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]))

  const addItem = () => {
    const newItem: any = {}
    section.fields.forEach((field) => {
      if (field.type === "multiselect") {
        newItem[field.name] = []
      } else if (field.type === "checkbox") {
        newItem[field.name] = false
      } else {
        newItem[field.name] = ""
      }
    })

    const newValues = [...values, newItem]
    onChange(newValues)
    setExpandedItems((prev) => new Set([...prev, values.length]))
  }

  const removeItem = (index: number) => {
    const newValues = values.filter((_, i) => i !== index)
    onChange(newValues)
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      const adjustedSet = new Set<number>()
      newSet.forEach((i) => {
        if (i < index) adjustedSet.add(i)
        else if (i > index) adjustedSet.add(i - 1)
      })
      return adjustedSet
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newValues = [...values]
    newValues[index] = { ...newValues[index], [field]: value }
    onChange(newValues)
  }

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const getItemTitle = (item: any, index: number) => {
    if (item.title) return item.title
    if (item.name) return item.name
    if (item.degree) return item.degree
    if (item.company) return item.company
    if (item.language) return item.language
    if (item.competence) return item.competence
    return `${section.itemTitle} ${index + 1}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={addItem}
          size="sm"
          className="flex items-center gap-2 px-4 py-2 font-medium bg-primary hover:bg-primary/90"
        >
          <span>➕</span>
          <span className="hidden sm:inline">{section.addButtonText}</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </div>

      {values.length === 0 ? (
        /* Better empty state design */
        <Card className="border-dashed border-2 border-border/50 bg-muted/20">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-3">
              <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto">
                <span className="text-2xl opacity-50">{section.icon}</span>
              </div>
              <p className="text-muted-foreground">
                Aucun élément ajouté. Cliquez sur "{section.addButtonText}" pour commencer.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Enhanced card design with better spacing */
        <div className="space-y-4">
          {values.map((item, index) => (
            <Card key={index} className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
              <Collapsible open={expandedItems.has(index)} onOpenChange={() => toggleExpanded(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-all duration-200 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="truncate">{getItemTitle(item, index)}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(index)
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                        >
                          🗑️
                        </Button>
                        <div className="p-2 text-muted-foreground">
                          {expandedItems.has(index) ? <span>▲</span> : <span>▼</span>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6">
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {section.fields.map((field) => (
                        <div
                          key={field.name}
                          className={`${field.type === "textarea" ? "md:col-span-2" : ""} space-y-2`}
                        >
                          <DynamicField
                            field={field}
                            value={item[field.name]}
                            onChange={(value) => updateItem(index, field.name, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

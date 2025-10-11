"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfileConfig } from "@/lib/profile-config"
import { DynamicField } from "./dynamic-field"
import { ArraySection } from "./array-section"
import { DynamicButton } from "../dynamicComponent/dynamic-button"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileEditFormProps {
  role: "candidate" | "company"
  initialData?: any
  onSave?: (data: any) => void
}

export function ProfileEditForm({ role, initialData, onSave }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const hasInitialized = useRef(false)
  const stableRole = useRef<"candidate" | "company">("candidate")
  const router = useRouter()
  console.log("[v0] ProfileEditForm - Render with:", {
    role,
    initialData,
    hasInitialData: !!initialData,
    initialDataKeys: initialData ? Object.keys(initialData) : [],
    formData,
    hasInitialized: hasInitialized.current,
  })

  const config = useMemo(() => {
    const cfg = getProfileConfig(role)
    console.log("[v0] ProfileEditForm - Config loaded:", {
      role,
      sectionsCount: cfg.sections.length,
      sections: cfg.sections.map((s) => ({ id: s.id, title: s.title, fieldsCount: s.fields.length })),
    })
    return cfg
  }, [role])

  useEffect(() => {
    if (role === "candidate" || role === "company") {
      stableRole.current = role
    }
  }, [role])

  useEffect(() => {
    if (hasInitialized.current || config.sections.length === 0) {
      return
    }

    const initData: any = {}

    config.sections.forEach((section) => {
      if (section.isArray) {
        initData[section.id] = initialData?.[section.id] || []
      } else {
        section.fields.forEach((field) => {
          if (field.type === "multiselect") {
            initData[field.name] = initialData?.[field.name] || []
          } else if (field.type === "checkbox") {
            initData[field.name] = initialData?.[field.name] || false
          } else {
            initData[field.name] = initialData?.[field.name] || ""
          }
        })
      }
    })

    console.log("[v0] Initialized form data:", initData)
    setFormData(initData)
    hasInitialized.current = true

    if (config.sections.length > 0) {
      const firstTabId = config.sections[0].id
      setActiveTab(firstTabId)
    }
  }, [config.sections.length, initialData])

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      hasInitialized.current = false
    }
  }, [initialData])

  const handleFieldChange = (fieldName: string, value: any) => {
    console.log("[v0] Field changed:", fieldName, "=", value)
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleArraySectionChange = (sectionId: string, values: any[]) => {
    console.log("[v0] Array section changed:", sectionId, "=", values)
    setFormData((prev: any) => ({
      ...prev,
      [sectionId]: values,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    console.log("[v0] Saving form data:", formData)

    try {
      if (onSave) {
        await onSave(formData)
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const getGridCols = (sectionsCount: number) => {
    if (sectionsCount <= 2) return "grid-cols-1 sm:grid-cols-2"
    if (sectionsCount <= 3) return "grid-cols-2 sm:grid-cols-3"
    if (sectionsCount <= 4) return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
    if (sectionsCount <= 5) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
    if (sectionsCount <= 6) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
    // For more than 6 sections, use a responsive layout that wraps
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
  }

  const dynamicGridCols = useMemo(() => getGridCols(config.sections.length), [config.sections.length])

  if (config.sections.length === 0) {
    console.log("[v0] ProfileEditForm - No sections found for role:", role)
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No profile sections found for role: {role}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Debug: Config sections length = {config.sections.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  console.log("[v0] ProfileEditForm - About to render with activeTab:", activeTab)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Profile</h1>
              <p className="text-muted-foreground text-lg">
                Update your {role === "candidate" ? "candidate" : "company"} profile information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicButton
                label="Preview"
                variant="outline"
                size="lg"
                iconLeft={<Eye />}
                onClick={() => router.push(`/dashboard/${role}/profile`)}
              />
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="lg"
                className="flex items-center gap-2 px-6 py-3 text-base font-medium"
              >
                {isSaving ? <span className="animate-spin">⏳</span> : <span>💾</span>}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-sm pb-6">
              <TabsList
                className={`grid w-full h-auto p-1 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm ${dynamicGridCols} gap-1`}
              >
                {config.sections.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 p-2 sm:p-3 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 min-h-[60px] sm:min-h-[50px]"
                  >
                    <span className="text-base sm:text-sm">{section.icon}</span>
                    <span className="text-xs sm:text-xs font-medium text-center sm:text-left leading-tight line-clamp-2">
                      {section.title}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {config.sections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-8 focus:outline-none">
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-card-foreground">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <span className="text-lg">{section.icon}</span>
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {section.isArray ? (
                      <ArraySection
                        section={section}
                        values={formData[section.id] || []}
                        onChange={(values) => handleArraySectionChange(section.id, values)}
                      />
                    ) : (
                      <div className="space-y-8">
                        {section.id === "jobPreferences" ? (
                          <div className="space-y-8">
                            {/* Contract Types */}
                            <div className="space-y-2">
                              <DynamicField
                                field={section.fields.find((f) => f.name === "contractTypes")!}
                                value={formData["contractTypes"]}
                                onChange={(value) => handleFieldChange("contractTypes", value)}
                              />
                            </div>

                            {/* Salary Range - Side by side */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                Fourchette de salaire souhaitée
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DynamicField
                                  field={section.fields.find((f) => f.name === "salaryExpectationMin")!}
                                  value={formData["salaryExpectationMin"]}
                                  onChange={(value) => handleFieldChange("salaryExpectationMin", value)}
                                />
                                <DynamicField
                                  field={section.fields.find((f) => f.name === "salaryExpectationMax")!}
                                  value={formData["salaryExpectationMax"]}
                                  onChange={(value) => handleFieldChange("salaryExpectationMax", value)}
                                />
                              </div>
                            </div>

                            {/* Work Hours */}
                            <div className="space-y-2">
                              <DynamicField
                                field={section.fields.find((f) => f.name === "workHours")!}
                                value={formData["workHours"]}
                                onChange={(value) => handleFieldChange("workHours", value)}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                            {section.fields.map((field) => (
                              <div
                                key={field.name}
                                className={`${field.type === "textarea" ? "md:col-span-2" : ""} space-y-2`}
                              >
                                <DynamicField
                                  field={field}
                                  value={formData[field.name]}
                                  onChange={(value) => handleFieldChange(field.name, value)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

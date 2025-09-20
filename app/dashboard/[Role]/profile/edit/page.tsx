"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "@/components/onboarding/personal-info-form"
import { DynamicListForm } from "@/components/onboarding/dynamic-list-form"
import { DynamicFormRenderer } from "@/components/onboarding/dynamic-form-renderer"

import type { JSX } from "react/jsx-runtime"
import { getProfileConfig } from "@/lib/profile-config"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProfileEditPage() {
  const params = useParams()
  const role = (params.Role as string)?.toLowerCase()
  const config = getProfileConfig(role)
  const { data: session, status } = useSession()

  const [profileData, setProfileData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {}
    config.sections.forEach((section) => {
      if (section.isArray) {
        initialData[section.id] = []
      } else {
        const sectionData: Record<string, any> = {}
        section.fields.forEach((field) => {
          if (field.type === "multiselect") {
            sectionData[field.name] = []
          } else if (field.type === "checkbox") {
            sectionData[field.name] = false
          } else {
            sectionData[field.name] = ""
          }
        })
        initialData[section.id] = sectionData
      }
    })
    return initialData
  })

  const [activeTab, setActiveTab] = useState(config.sections[0]?.id || "")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set([config.sections[0]?.id || ""]))

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/onboarding")
        if (response.ok) {
          const data = await response.json()
          if (data.profileData) {
            setProfileData(data.profileData)
          }
        } else if (response.status !== 404) {
          console.error("Failed to fetch profile data")
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const updateSectionData = (sectionId: string, data: any) => {
    setProfileData((prev) => ({
      ...prev,
      [sectionId]: data,
    }))
  }

  const updateFieldData = (sectionId: string, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileData }),
      })

      if (response.ok) {
        const result = await response.json()
        // Show success message or redirect
      } else {
        const error = await response.json()
        console.error("Error saving profile:", error)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setVisitedTabs((prev) => new Set([...prev, tabId]))
  }

  const renderSection = (section: any) => {
    if (section.id === "personalInfo" && role === "candidat") {
      return (
        <PersonalInfoForm
          data={profileData[section.id] || {}}
          onChange={(data) => updateSectionData(section.id, data)}
          userType="candidate"
        />
      )
    }

    if (section.isArray) {
      const arrayTypes = ["experiences", "education", "skills", "languages"] as const
      const sectionType = arrayTypes.find((type) => section.id === type)

      if (sectionType) {
        return (
          <DynamicListForm
            items={profileData[section.id] || []}
            onItemsChange={(items) => updateSectionData(section.id, items)}
            type={sectionType}
            addButtonText={section.addButtonText || `Ajouter ${section.title.toLowerCase()}`}
          />
        )
      }
    }

    return (
      <DynamicFormRenderer
        fields={section.fields}
        data={profileData[section.id] || {}}
        onChange={(field, value) => updateFieldData(section.id, field, value)}
      />
    )
  }

  const memoizedSections = useMemo(() => {
    const sections: Record<string, JSX.Element> = {}

    visitedTabs.forEach((tabId) => {
      const section = config.sections.find((s) => s.id === tabId)
      if (section) {
        sections[tabId] = renderSection(section)
      }
    })

    return sections
  }, [visitedTabs, profileData, role])

  const renderProfilePreview = () => {
    if (status === "loading") {
      return (
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Aperçu du profil</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mx-auto" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
            </div>
          </CardContent>
        </Card>
      )
    }

    const personalInfo = profileData.personalInfo || {}
    const sessionUser = session?.user

    const displayName = personalInfo.fullName || sessionUser?.name || ""
    const displayTitle = personalInfo.professionalTitle || ""
    const displayLocation = personalInfo.location || ""

    const initials = displayName
      ? displayName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
      : sessionUser?.name
        ? sessionUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : ""

    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Aperçu du profil</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{displayName || "Nom non renseigné"}</h3>
            <p className="text-muted-foreground">{displayTitle || "Titre non renseigné"}</p>
            <p className="text-muted-foreground text-sm">{displayLocation || "Localisation non renseignée"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Chargement du profil...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/${role}profile/`}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au profil
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Modifier mon profil</h1>
                <p className="text-sm text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="bg-background rounded-lg border">
            <TabsList className="flex w-full bg-transparent p-1 overflow-x-auto">
              {config.sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex-shrink-0 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-muted rounded-md py-2 px-4 whitespace-nowrap"
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              {config.sections.map((section) => (
                <TabsContent key={section.id} value={section.id} className="mt-0">
                  {visitedTabs.has(section.id) ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="text-lg">{section.icon}</span>
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">{memoizedSections[section.id]}</CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="text-lg">{section.icon}</span>
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Chargement...</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">{renderProfilePreview()}</div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

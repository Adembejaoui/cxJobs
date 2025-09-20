"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfileConfig } from "@/lib/profile-config"
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Edit,
  Calendar,
  Building,
  GraduationCap,
  Languages,
  Award,
  DollarSign,
  Briefcase,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const params = useParams()
  const role = (params.Role as string)?.toLowerCase()
  const config = getProfileConfig(role)
  const { data: session, status } = useSession()

  const [profileData, setProfileData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/onboarding")
        if (response.ok) {
          const data = await response.json()
          if (data.profileData) {
            setProfileData(data.profileData)
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

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

  const personalInfo = profileData.personalInfo || {}
  const experiences = profileData.experiences || []
  const education = profileData.education || []
  const skills = profileData.skills || []
  const languages = profileData.languages || []
  const preferences = profileData.preferences || {}
  const sessionUser = session?.user

  const displayName = personalInfo.fullName || sessionUser?.name || "Nom non renseigné"
  const displayTitle = personalInfo.professionalTitle || "Titre non renseigné"
  const displayLocation = personalInfo.location || "Localisation non renseignée"
  const displayEmail = personalInfo.email || sessionUser?.email || ""
  const displayPhone = personalInfo.phone || ""
  const displayAbout = personalInfo.about || ""

  const initials =
    displayName !== "Nom non renseigné"
      ? displayName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
      : ""

  const calculateCompletion = () => {
    let completed = 0
    let total = 0

    // Personal info fields
    if (personalInfo.fullName) completed++
    if (personalInfo.professionalTitle) completed++
    if (personalInfo.location) completed++
    if (personalInfo.about) completed++
    total += 4

    // Experience
    if (experiences.length > 0) completed++
    total++

    // Education
    if (education.length > 0) completed++
    total++

    // Skills
    if (skills.length > 0) completed++
    total++

    // Languages
    if (languages.length > 0) completed++
    total++

    return Math.round((completed / total) * 100)
  }

  const completionPercentage = calculateCompletion()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
            <Link href={`/profile/${role}/edit`}>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24 bg-emerald-500">
                  <AvatarImage src={personalInfo.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-white text-2xl font-bold bg-emerald-500">{initials}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{displayName}</h1>
                    <p className="text-xl text-emerald-600 font-medium mb-3">{displayTitle}</p>

                    <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                      {displayLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{displayLocation}</span>
                        </div>
                      )}
                      {displayEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{displayEmail}</span>
                        </div>
                      )}
                      {displayPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{displayPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-center">
                      <div className="text-2xl font-bold">{completionPercentage}%</div>
                      <div className="text-sm">Profil complété</div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Disponible
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {displayAbout && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-500" />À propos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{displayAbout}</p>
                </CardContent>
              </Card>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                    Expériences professionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-emerald-600 font-medium">{exp.company}</p>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {exp.startDate} - {exp.endDate || "Présent"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-500" />
                    Formation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{edu.degree}</h3>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Languages */}
            {languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-emerald-500" />
                    Langues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {languages.map((lang: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{lang.language || lang.name || `Langue ${index + 1}`}</span>
                      <Badge
                        variant={
                          lang.level === "Natif" ? "default" : lang.level === "Courant" ? "secondary" : "outline"
                        }
                        className={
                          lang.level === "Natif"
                            ? "bg-blue-500 text-white"
                            : lang.level === "Courant"
                              ? "bg-emerald-500 text-white"
                              : lang.level === "Avancé"
                                ? "bg-orange-500 text-white"
                                : ""
                        }
                      >
                        {lang.level || lang.proficiency || "Non spécifié"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-500" />
                    Compétences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skills.map((skill: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{skill.name || skill.skill || skill}</span>
                        {(skill.level || skill.proficiency) && (
                          <Badge
                            variant="outline"
                            className={
                              skill.level === "Expert" || skill.proficiency === "Expert"
                                ? "border-emerald-500 text-emerald-700"
                                : skill.level === "Avancé" || skill.proficiency === "Avancé"
                                  ? "border-blue-500 text-blue-700"
                                  : skill.level === "Intermédiaire" || skill.proficiency === "Intermédiaire"
                                    ? "border-orange-500 text-orange-700"
                                    : "border-gray-500 text-gray-700"
                            }
                          >
                            {skill.level || skill.proficiency}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Preferences */}
            {Object.keys(preferences).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                    Préférences d'emploi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(preferences.contractType || preferences.contractTypes) && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Type de contrat</h4>
                      <div className="flex flex-wrap gap-2">
                        {(preferences.contractType || preferences.contractTypes || []).map(
                          (type: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                              {type}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {(preferences.salaryRange || preferences.salary) && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Salaire souhaité</h4>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{preferences.salaryRange || preferences.salary}</span>
                      </div>
                    </div>
                  )}

                  {(preferences.workSchedule || preferences.schedule || preferences.workingHours) && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Horaires préférés</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(preferences.workSchedule || preferences.schedule || preferences.workingHours) ? (
                          (preferences.workSchedule || preferences.schedule || preferences.workingHours).map(
                            (schedule: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-green-50 border-green-200 text-green-700"
                              >
                                {schedule}
                              </Badge>
                            ),
                          )
                        ) : (
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            {preferences.workSchedule || preferences.schedule || preferences.workingHours}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {(preferences.location || preferences.workLocation) && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Lieu de travail</h4>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{preferences.location || preferences.workLocation}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{displayEmail}</span>
                  </div>
                )}
                {displayPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{displayPhone}</span>
                  </div>
                )}
                {displayLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{displayLocation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

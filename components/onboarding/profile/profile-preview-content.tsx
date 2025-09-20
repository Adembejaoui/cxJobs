"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Mail, Phone, Star, Briefcase, GraduationCap, Languages, Award, Clock } from "lucide-react"
import { useSession } from "next-auth/react"

interface ProfilePreviewContentProps {
  profileData: any
}

export function ProfilePreviewContent({ profileData }: ProfilePreviewContentProps) {
  const { data: session, status } = useSession()

  const calculateCompletionPercentage = () => {
    if (!profileData) return 0

    let completed = 0
    const total = 8

    if (profileData.personalInfo?.fullName) completed++
    if (profileData.personalInfo?.email) completed++
    if (profileData.personalInfo?.phone) completed++
    if (profileData.personalInfo?.location) completed++
    if (profileData.personalInfo?.professionalTitle) completed++
    if (profileData.experiences?.length > 0) completed++
    if (profileData.education?.length > 0) completed++
    if (profileData.skills?.length > 0) completed++

    return Math.round((completed / total) * 100)
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || ""
    )
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Non spécifié"
    if (min && max) return `${min}-${max} DT`
    if (min) return `À partir de ${min} DT`
    if (max) return `Jusqu'à ${max} DT`
    return "Non spécifié"
  }

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune donnée de profil disponible</p>
      </div>
    )
  }

  const completionPercentage = calculateCompletionPercentage()
  const sessionUser = session?.user

  const displayName = profileData.personalInfo?.fullName || sessionUser?.name || "Nom non renseigné"
  const displayEmail = profileData.personalInfo?.email || sessionUser?.email || ""
  const displayTitle = profileData.personalInfo?.professionalTitle || "Titre non renseigné"

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 bg-emerald-500 text-white text-lg font-bold">
                <AvatarFallback className="bg-emerald-500 text-white text-lg">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{displayName}</h1>
                <p className="text-lg text-emerald-600 font-medium mb-3">{displayTitle}</p>
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                  {profileData.personalInfo?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.personalInfo.location}</span>
                    </div>
                  )}
                  {displayEmail && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{displayEmail}</span>
                    </div>
                  )}
                  {profileData.personalInfo?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{profileData.personalInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg mb-2">
                <div className="text-xl font-bold">{completionPercentage}%</div>
                <div className="text-xs">Profil complété</div>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Disponible
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-600" />À propos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {profileData.personalInfo?.presentation ||
                  `Professionnel du service client avec ${
                    profileData.experiences?.length > 0
                      ? `${profileData.experiences.length} expérience${profileData.experiences.length > 1 ? "s" : ""}`
                      : "une expérience"
                  } dans les centres d'appel.${
                    profileData.languages?.length > 0 &&
                    ` Trilingue (${profileData.languages.map((l: any) => l.language).join(", ")})`
                  } avec d'excellentes compétences en communication et résolution de problèmes.`}
              </p>
            </CardContent>
          </Card>

          {/* Professional Experience */}
          {profileData.experiences?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Expériences professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.experiences.map((experience: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{experience.title}</h3>
                      <p className="text-emerald-600 font-medium">{experience.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {experience.startDate} - {experience.endDate}
                      </p>
                      {experience.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{experience.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {profileData.education?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileData.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Languages */}
          {profileData.languages?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-emerald-600" />
                  Langues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profileData.languages.map((language: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-foreground">{language.language}</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {language.level}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {profileData.skills?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Compétences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill: any, index: number) => (
                    <Badge key={index} variant="secondary">
                      {typeof skill === "string" ? skill : skill.name || skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'emploi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profileData.personalInfo?.contractTypes?.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Type de contrat</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.personalInfo.contractTypes.map((type: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(profileData.personalInfo?.salaryExpectationMin || profileData.personalInfo?.salaryExpectationMax) && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Salaire souhaité</h4>
                  <p className="text-muted-foreground">
                    {formatSalary(
                      profileData.personalInfo.salaryExpectationMin,
                      profileData.personalInfo.salaryExpectationMax,
                    )}
                  </p>
                </div>
              )}

              {profileData.personalInfo?.workHours && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Horaires préférés</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profileData.personalInfo.workHours}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

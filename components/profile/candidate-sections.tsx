import type { CandidateProfile } from "@/types/profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Building, GraduationCap, Languages } from "lucide-react"
import { formatDateRange } from "@/lib/profile-utils"

interface CandidateSectionsProps {
  profile: CandidateProfile
}

export function CandidateSections({ profile }: CandidateSectionsProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Experience Section */}
        {profile.experiences && profile.experiences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Professional Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experiences.map((exp, index) => {
                if (!exp.title?.trim() && !exp.company?.trim()) return null

                return (
                  <div key={exp.id || index} className="border-l-2 border-primary/20 pl-4 pb-4 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{exp.title?.trim() || "Poste"}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                      </div>
                    </div>
                    <p className="text-primary font-medium">{exp.company?.trim() || "Entreprise"}</p>
                    {exp.description?.trim() && (
                      <p className="text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {profile.formations && profile.formations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.formations.map((edu, index) => {
                if (!edu.degree?.trim() && !edu.school?.trim()) return null

                return (
                  <div key={edu.id || index} className="border-l-2 border-secondary/20 pl-4 pb-4 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{edu.degree?.trim() || "Diplôme"}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
                      </div>
                    </div>
                    <p className="text-primary font-medium">{edu.school?.trim() || "École"}</p>
                    {edu.description?.trim() && (
                      <p className="text-muted-foreground mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {/* Skills Section */}
        {profile.competences && profile.competences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>competences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.competences.map((skill, index) => {
                if (!skill.name?.trim()) return null

                const levelPercentage =
                  skill.level === "beginner"
                    ? 25
                    : skill.level === "intermediate"
                      ? 50
                      : skill.level === "advanced"
                        ? 75
                        : 100

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-muted-foreground capitalize">{skill.level || "débutant"}</span>
                    </div>
                    <Progress value={levelPercentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Languages Section */}
        {profile.languages && profile.languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.languages.map((lang, index) => {
                  if (!lang.language?.trim()) return null

                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{lang.language}</span>
                      <Badge variant="secondary">{lang.level || "débutant"}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contract Types */}
        {profile.contractTypes && profile.contractTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Contract Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.contractTypes.map((type, index) => {
                  if (!type?.trim()) return null

                  return (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Expectations */}
        {(profile.salaryExpectationMin || profile.salaryExpectationMax) && (
          <Card>
            <CardHeader>
              <CardTitle>Salary Expectations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {profile.salaryExpectationMin && profile.salaryExpectationMax
                    ? `${profile.salaryExpectationMin.toLocaleString()}DT - ${profile.salaryExpectationMax.toLocaleString()}DT`
                    : profile.salaryExpectationMin
                      ? `From €${profile.salaryExpectationMin.toLocaleString()}`
                      : `Up to €${profile.salaryExpectationMax?.toLocaleString()}`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

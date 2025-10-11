import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { InfoItem } from "./info-item"
import { JobTags } from "./job-tags"

interface JobHeaderProps {
  title: string
  companyName: string
  companyLogo?: string
  status: string
  salaryMin?: number
  salaryMax?: number
  experienceLevel: string
  expirationDate?: string
  location: string
  contractType: string
  workMode: string
  languages: string[]
  skills: string[]
}

export function JobHeader({
  title,
  companyName,
  companyLogo,
  status,
  salaryMin,
  salaryMax,
  experienceLevel,
  expirationDate,
  location,
  contractType,
  workMode,
  languages,
  skills,
}: JobHeaderProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée"
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage src={companyLogo || "/placeholder.svg?height=64&width=64"} alt={companyName} />
            <AvatarFallback className="rounded-lg">{companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-balance">{title}</h2>
                  <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {status === "published" ? "Vacante" : "Brouillon"}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-medium">{companyName}</p>
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <InfoItem
                label="Salaire"
                value={salaryMin && salaryMax ? `${salaryMin}-${salaryMax} TND` : "A négocier"}
              />
              <InfoItem label="Date limite" value={formatDate(expirationDate)} valueClassName="text-orange-600" />
            </div>

            {/* Tags */}
            <JobTags
              location={location}
              contractType={contractType}
              workMode={workMode}
              languages={languages}
              skills={skills}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

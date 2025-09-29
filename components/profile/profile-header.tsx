"use client"
import type { ProfileData, CandidateProfile, CompanyProfile } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Globe, Calendar, ArrowLeft, Edit2 } from "lucide-react" // ✅ FIXED
import { getInitials } from "@/lib/profile-utils"
import { DynamicButton } from "../dynamicComponent/dynamic-button"
import { useRouter } from "next/navigation"

interface ProfileHeaderProps {
  profile: ProfileData
  role: "candidate" | "company"
}

export function ProfileHeader({ profile, role }: ProfileHeaderProps) {
  const router = useRouter()
  const displayName = role === "candidate" ? profile.name : (profile as CompanyProfile).name

  const logo = role === "candidate" ? (profile as CandidateProfile).logo : (profile as CompanyProfile).logo

  const jobTitle = role === "candidate" ? (profile as CandidateProfile).jobTitle : undefined

  const location = role === "candidate" ? (profile as CandidateProfile).location : (profile as CompanyProfile).address

  const phone = profile.phone
  const website = role === "company" ? (profile as CompanyProfile).website : undefined
  const presentation =
    role === "candidate" ? (profile as CandidateProfile).presentation : (profile as CompanyProfile).description

  const workHours = role === "candidate" ? (profile as CandidateProfile).workHours : undefined

  if (role === "company") {
    const companyProfile = profile as CompanyProfile
    return (
      <div className="relative">
        {/* Banner Background */}
        <div
          className="h-90 bg-gradient-to-r from-primary to-accent relative"
          style={
            companyProfile.coverPhoto
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${companyProfile.coverPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 text-white hover:bg-white/20 border-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* Company Info Card */}
        <div className="container mx-auto px-4 pt-4 relative z-10">
          <Card className="bg-white shadow-xl border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Small Logo */}
                  <Avatar className="w-20 h-20 border-2 border-primary/20">
                    <AvatarImage src={logo || undefined} alt={displayName} />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-3xl font-bold text-primary">{displayName}</h1>
                    <p className="text-lg text-accent font-medium">{companyProfile.sector || "Services"}</p>

                    <div className="flex items-center gap-4 mt-2 text-base text-muted-foreground">
                      {location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                        </div>
                      )}
                      {companyProfile.size && (
                        <div className="flex items-center gap-1">
                          <span>{companyProfile.size}</span>
                        </div>
                      )}
                      {companyProfile.foundedYear && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Fondée en {companyProfile.foundedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Button aligned right */}
                <DynamicButton
                  label="Modifier"
                  variant="outline"
                  size="sm"
                  iconLeft={<Edit2 />}
                  onClick={() => router.push(`/dashboard/${role}/profile/edit`)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={logo || undefined} alt={displayName} />
                  <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Info + Button row */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">{displayName}</h1>
                    {jobTitle && <p className="text-2xl text-muted-foreground mt-1">{jobTitle}</p>}
                  </div>

                  {/* Edit Button on right */}
                  <DynamicButton
                    label="Modifier"
                    variant="outline"
                    size="sm"
                    iconLeft={<Edit2 />}
                    onClick={() => router.push(`/dashboard/${role}/profile/edit`)}
                  />
                </div>

                {/* Contact details */}
                <div className="flex flex-wrap gap-4 text-base text-muted-foreground">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        {website}
                      </a>
                    </div>
                  )}
                </div>

                {presentation && <p className="text-lg text-foreground leading-relaxed">{presentation}</p>}

                {workHours && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="secondary">{workHours}</Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

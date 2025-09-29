import type { ProfileData } from "@/types/profile"
import { ProfileHeader } from "./profile-header"
import { CandidateSections } from "./candidate-sections"
import { CompanySections } from "./company-sections"
import type { CandidateProfile, CompanyProfile } from "@/types/profile"

interface ProfileViewProps {
  profile: ProfileData
  role: "candidate" | "company"
}

export function ProfileView({ profile, role }: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} role={role} />

      <div className="container mx-auto px-4 py-8">
        {role === "candidate" ? (
          <CandidateSections profile={profile as CandidateProfile} />
        ) : (
          <CompanySections profile={profile as CompanyProfile} />
        )}
      </div>
    </div>
  )
}

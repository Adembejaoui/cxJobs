// TypeScript interfaces for profile data
export interface User {
  id: string
  name: string
  email: string
  role: "CANDIDATE" | "COMPANY" | "ADMIN"
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id?: string
  title: string
  company: string
  startDate: string
  endDate?: string
  description: string
  current?: boolean
}

export interface Education {
  id?: string
  degree: string
  school: string
  startDate: string
  endDate?: string
  description?: string
}
export type RecruitmentStep = {
  title: string
  duration: string
  description: string
}
export interface Competences {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface Language {
  language: string
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native"
}

export interface CompanyValue {
  title: string
  description: string
}

export interface CompanyAdvantage {
  title: string
  description: string
}

export interface CompanyLang {
  name: string
}

export interface CompanyPhoto {
  imageUrl: string
  caption?: string
}

export interface CandidateProfile {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  logo?: string
  location?: string
  jobTitle?: string
  presentation?: string
  salaryExpectationMin?: number
  salaryExpectationMax?: number
  contractTypes?: string[]
  workHours?: string
  competences?: Competences[]
  languages?: Language[]
  experiences?: Experience[]
  formations?: Education[]
  createdAt: string
  updatedAt: string
  user: User
}

export interface CompanyProfile {
  id: string
  userId: string
  name: string
  sector?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  size?: string
  foundedYear?: number
  description?: string
  logo?: string
  coverPhoto?: string
  values?: CompanyValue[]
  advantages?: CompanyAdvantage[]
  langage?: CompanyLang[]
  photos?: CompanyPhoto[]
  recruitment: RecruitmentStep[]
  createdAt: string
  updatedAt: string
  user: User
}

export interface ProfileResponse {
  success: boolean
  message?: string
  user: User
  profile: any // This will be either CandidateProfile or CompanyProfile data
}

export type ProfileData = CandidateProfile | CompanyProfile

export interface ProfileComponentProps {
  role: "candidate" | "company"
  profileData?: ProfileData
  isEditable?: boolean
  onEdit?: () => void
}

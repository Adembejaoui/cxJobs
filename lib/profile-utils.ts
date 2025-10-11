// Utility functions for profile data processing and formatting
import type { CandidateProfile, CompanyProfile, ProfileData } from "@/types/profile"

export function getRoleFromUrl(roleParam: string): "candidate" | "company" {
  const normalized = roleParam.toLowerCase()
  return normalized === "candidat" || normalized === "candidate" ? "candidate" : "company"
}

export function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  })

  if (!endDate) return `${start} - Présent`

  const end = new Date(endDate).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  })

  return `${start} - ${end}`
}

export function formatSalaryRange(min?: number, max?: number): string {
  if (!min && !max) return "Non spécifié"
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} DT`
  if (min) return `À partir de ${min.toLocaleString()} DT`
  if (max) return `Jusqu'à ${max.toLocaleString()} DT`
  return "Non spécifié"
}

export function getSkillLevelLabel(level: string): string {
  const labels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    expert: "Expert",
  }
  return labels[level as keyof typeof labels] || level
}

export function getLanguageLevelLabel(level: string): string {
  const labels = {
    basic: "Basique",
    conversational: "Conversationnel",
    fluent: "Courant",
    native: "Natif",
    A1: "A1 - Débutant",
    A2: "A2 - Élémentaire",
    B1: "B1 - Intermédiaire",
    B2: "B2 - Intermédiaire avancé",
    C1: "C1 - Avancé",
    C2: "C2 - Maîtrise",
  }
  return labels[level as keyof typeof labels] || level
}

export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "U"

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getCompletionPercentage(profile: ProfileData, role: "candidate" | "company"): number {
  if (role === "candidate") {
    const candidateProfile = profile as CandidateProfile
    const fields = [
      candidateProfile.phone,
      candidateProfile.location,
      candidateProfile.jobTitle,
      candidateProfile.presentation,
      candidateProfile.experiences?.length,
      candidateProfile.formations?.length,
      candidateProfile.competences?.length,
      candidateProfile.languages?.length,
    ]
    const filledFields = fields.filter((field) => field && (Array.isArray(field) ? field.length > 0 : true))
    return Math.round((filledFields.length / fields.length) * 100)
  } else {
    const companyProfile = profile as CompanyProfile
    const fields = [
      companyProfile.phone,
      companyProfile.address,
      companyProfile.website,
      companyProfile.sector,
      companyProfile.description,
      companyProfile.values?.length,
      companyProfile.advantages?.length,
    ]
    const filledFields = fields.filter((field) => field && (Array.isArray(field) ? field.length > 0 : true))
    return Math.round((filledFields.length / fields.length) * 100)
  }
}

export function getSkillLevelProgress(level: string): number {
  const levels = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 }
  return levels[level as keyof typeof levels] || 0
}

export function validateProfileData(data: any, role: "candidate" | "company"): boolean {
  if (!data) return false

  if (role === "candidate") {
    return !!(data.user?.name || data.user?.email)
  } else {
    return !!(data.name || data.user?.name)
  }
}

export function safeParseJSON<T>(value: any, fallback: T): T {
  if (Array.isArray(value)) return value as T
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return value || fallback
}

export type PredefinedCategory = "languages" | "competences"

const predefinedOptions: Record<PredefinedCategory, string[]> = {
  languages: [
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Italien",
    "Portugais",
    "Arabe",
    "Chinois",
    "Japonais",
    "Russe",
    "Néerlandais",
    "Turc",
    "Coréen",
  ],
  competences: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Git",
    "Agile",
    "Scrum",
    "Communication",
    "Leadership",
    "Travail d'équipe",
    "Résolution de problèmes",
    "Gestion du temps",
    "Créativité",
    "Adaptabilité",
  ],
}

export function getPredefinedOptions(category: PredefinedCategory): string[] {
  return predefinedOptions[category] || []
}

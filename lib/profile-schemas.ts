import { z } from "zod"

// Base schemas for reusable field types
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  location: z.string().min(2, "Localisation requise"),
  professionalTitle: z.string().min(2, "Titre professionnel requis"),
  presentation: z.string().min(50, "La présentation doit contenir au moins 50 caractères"),
  contractTypes: z.array(z.string()).optional(),
})

export const experienceSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(2, "Titre du poste requis"),
  company: z.string().min(2, "Nom de l'entreprise requis"),
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().optional(),
  isCurrentPosition: z.boolean().default(false),
  description: z.string().min(20, "Description requise (minimum 20 caractères)"),
})

export const educationSchema = z.object({
  id: z.string().optional(),
  diploma: z.string().min(2, "Diplôme requis"),
  institution: z.string().min(2, "Établissement requis"),
  startYear: z.string().min(4, "Année de début requise"),
  endYear: z.string().min(4, "Année de fin requise"),
})

export const skillSchema = z.object({
  name: z.string().min(2, "Nom de la compétence requis"),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé", "Expert"]).optional(),
})

export const languageSchema = z.object({
  name: z.string().min(2, "Nom de la langue requis"),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé", "Natif", "Courant"]),
})

export const preferencesSchema = z.object({
  contractTypes: z.array(z.string()).min(1, "Au moins un type de contrat requis"),
  salaryRange: z.string().optional(),
  workingHours: z.array(z.string()).optional(),
  remoteWork: z.boolean().default(false),
  availability: z.string().optional(),
})

// Complete profile schemas for different roles
export const candidateProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  preferences: preferencesSchema,
})

export const companyProfileSchema = z.object({
  personalInfo: personalInfoSchema.omit({ professionalTitle: true }).extend({
    companyName: z.string().min(2, "Nom de l'entreprise requis"),
    industry: z.string().min(2, "Secteur d'activité requis"),
    companySize: z.string().min(1, "Taille de l'entreprise requise"),
  }),
  experiences: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  preferences: preferencesSchema.optional(),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Skill = z.infer<typeof skillSchema>
export type Language = z.infer<typeof languageSchema>
export type Preferences = z.infer<typeof preferencesSchema>
export type CandidateProfile = z.infer<typeof candidateProfileSchema>
export type CompanyProfile = z.infer<typeof companyProfileSchema>

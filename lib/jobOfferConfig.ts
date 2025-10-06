import { z } from "zod"

export const locations = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
  "Télétravail",
]

export const jobOfferConfig = [
  {
    id: "informations_principales",
    title: "Informations principales",
    fields: [
      { name: "title", label: "Titre du poste", type: "text", required: true },
      {
        name: "location",
        label: "Localisation",
        type: "select",
        options: locations,
        required: true,
      },
      {
        name: "contractType",
        label: "Type de contrat",
        type: "select",
        options: ["CDI", "CDD", "Stage", "Freelance"],
        required: true,
      },
      { name: "salaryMin", label: "Salaire minimum (€)", type: "number" },
      { name: "salaryMax", label: "Salaire maximum (€)", type: "number" },
      {
        name: "workMode",
        label: "Mode de travail",
        type: "select",
        options: ["sur site", "hybride", "télétravail"],
        required: true,
      },
      { name: "description", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    id: "mode_candidature",
    title: "Mode de candidature",
    fields: [
      {
        name: "applicationMode.viaCxJobs",
        label: "Candidature via CXJobs (recommandé)",
        type: "checkbox",
      },
      {
        name: "applicationMode.atsUrl",
        label: "Redirection vers votre ATS",
        type: "url",
      },
    ],
  },
  {
    id: "exigences_competences",
    title: "Exigences et compétences",
    fields: [
      { name: "requirements.skills", label: "Compétences requises", type: "tags" },
      { name: "requirements.languages", label: "Langues requises", type: "tags" },
      { name: "requirements.benefits", label: "Avantages", type: "tags" },
    ],
  },
  {
    id: "processus_recrutement",
    title: "Processus de recrutement",
    repeatable: true,
    fields: [
      { name: "title", label: "Titre de l'étape", type: "text", required: true },
      { name: "duration", label: "Durée estimée", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
]

// optional Zod validation if you’re using it
export const jobOfferSchema = z.object({
  title: z.string(),
  location: z.string(),
  contractType: z.string(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  workMode: z.enum(["sur site", "hybride", "télétravail"]),
  description: z.string(),
  applicationMode: z.object({
    viaCxJobs: z.boolean().optional(),
    atsUrl: z.string().url().optional(),
  }),
  requirements: z.object({
    skills: z.array(z.string()),
    languages: z.array(z.string()),
    benefits: z.array(z.string()).optional(),
  }),
  recruitment: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      description: z.string(),
    }),
  ),
})
export const workModes = [
  { value: "sur site", label: "Sur site", icon: "🏢" },
  { value: "hybride", label: "Hybride", icon: "🔄" },
  { value: "télétravail", label: "Télétravail", icon: "📡" },
] as const

export const languages = ["Français", "Anglais", "Arabe", "Allemand", "Italien", "Espagnol"]

export const defaultRecruitmentStep = {
  title: "",
  duration: "",
  description: "",
}
export const contractTypes = ["CDI", "CDD", "Stage", "Freelance"]
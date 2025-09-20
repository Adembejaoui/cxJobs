export interface FieldConfig {
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "date" | "multiselect"
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
  gridCols?: number
  rows?: number
}

export interface SectionConfig {
  id: string
  title: string
  icon: string
  fields: FieldConfig[]
  isArray?: boolean
  addButtonText?: string
  canDelete?: boolean
}

export interface ProfileConfig {
  sections: SectionConfig[]
}

// Configuration for candidate profiles
export const candidateConfig: ProfileConfig = {
  sections: [
    {
      id: "personalInfo",
      title: "Informations personnelles",
      icon: "👤",
      fields: [
        { name: "fullName", label: "Nom complet", type: "text", required: true, gridCols: 1 },
        { name: "professionalTitle", label: "Titre professionnel", type: "text", required: true, gridCols: 1 },
        { name: "email", label: "Email", type: "email", required: true, gridCols: 1 },
        { name: "phone", label: "Téléphone", type: "tel", required: true, gridCols: 1 },
        {
          name: "location",
          label: "Localisation",
          type: "select",
          required: true,
          gridCols: 2,
          options: [
            { value: "tunis", label: "Tunis" },
            { value: "sfax", label: "Sfax" },
            { value: "sousse", label: "Sousse" },
            { value: "gabes", label: "Gabès" },
            { value: "bizerte", label: "Bizerte" },
          ],
        },
        { name: "presentation", label: "Présentation", type: "textarea", required: true, gridCols: 2, rows: 4 },
      ],
    },
    {
      id: "experiences",
      title: "Expériences professionnelles",
      icon: "💼",
      isArray: true,
      addButtonText: "Ajouter une expérience",
      canDelete: true,
      fields: [
        { name: "jobTitle", label: "Titre du poste", type: "text", required: true, gridCols: 1 },
        { name: "company", label: "Entreprise", type: "text", required: true, gridCols: 1 },
        { name: "startDate", label: "Date de début", type: "date", required: true, gridCols: 1 },
        { name: "endDate", label: "Date de fin", type: "date", gridCols: 1, placeholder: "Ex: Décembre 2023" },
        { name: "isCurrentPosition", label: "Poste actuel", type: "checkbox", gridCols: 2 },
        { name: "description", label: "Description", type: "textarea", required: true, gridCols: 2, rows: 3 },
      ],
    },
    {
      id: "education",
      title: "Formation",
      icon: "🎓",
      isArray: true,
      addButtonText: "Ajouter une formation",
      canDelete: true,
      fields: [
        { name: "diploma", label: "Diplôme", type: "text", required: true, gridCols: 1 },
        { name: "institution", label: "Établissement", type: "text", required: true, gridCols: 1 },
        { name: "startYear", label: "Année de début", type: "text", required: true, gridCols: 1, placeholder: "2016" },
        { name: "endYear", label: "Année de fin", type: "text", required: true, gridCols: 1, placeholder: "2019" },
      ],
    },
    {
      id: "skills",
      title: "Compétences",
      icon: "⭐",
      isArray: true,
      addButtonText: "Ajouter une compétence",
      canDelete: true,
      fields: [{ name: "name", label: "Compétence", type: "text", required: true, gridCols: 2 }],
    },
    {
      id: "languages",
      title: "Langues",
      icon: "🌐",
      isArray: true,
      addButtonText: "Ajouter une langue",
      canDelete: true,
      fields: [
        { name: "name", label: "Langue", type: "text", required: true, gridCols: 1 },
        {
          name: "level",
          label: "Niveau",
          type: "select",
          required: true,
          gridCols: 1,
          options: [
            { value: "Débutant", label: "Débutant" },
            { value: "Intermédiaire", label: "Intermédiaire" },
            { value: "Avancé", label: "Avancé" },
            { value: "Courant", label: "Courant" },
            { value: "Natif", label: "Natif" },
          ],
        },
      ],
    },
    {
      id: "preferences",
      title: "Préférences d'emploi",
      icon: "⚙️",
      fields: [
        {
          name: "contractTypes",
          label: "Types de contrat recherchés",
          type: "multiselect",
          required: true,
          gridCols: 2,
          options: [
            { value: "CDI", label: "CDI" },
            { value: "CDD", label: "CDD" },
            { value: "Stage", label: "Stage" },
            { value: "Freelance", label: "Freelance" },
            { value: "Temps plein", label: "Temps plein" },
            { value: "Temps partiel", label: "Temps partiel" },
          ],
        },
        {
          name: "salaryRange",
          label: "Fourchette de salaire souhaitée",
          type: "text",
          gridCols: 2,
          placeholder: "1000-1500 DT",
        },
        {
          name: "workingHours",
          label: "Horaires de travail préférés",
          type: "multiselect",
          gridCols: 2,
          options: [
            { value: "Matin", label: "Matin" },
            { value: "Après-midi", label: "Après-midi" },
            { value: "Soir", label: "Soir" },
            { value: "Nuit", label: "Nuit" },
            { value: "Horaires flexibles", label: "Horaires flexibles" },
            { value: "Weekend", label: "Weekend" },
          ],
        },
      ],
    },
  ],
}

// Configuration for company profiles
export const companyConfig: ProfileConfig = {
  sections: [
    {
      id: "personalInfo",
      title: "Informations de l'entreprise",
      icon: "🏢",
      fields: [
        { name: "companyName", label: "Nom de l'entreprise", type: "text", required: true, gridCols: 1 },
        { name: "industry", label: "Secteur d'activité", type: "text", required: true, gridCols: 1 },
        { name: "email", label: "Email", type: "email", required: true, gridCols: 1 },
        { name: "phone", label: "Téléphone", type: "tel", required: true, gridCols: 1 },
        {
          name: "location",
          label: "Localisation",
          type: "select",
          required: true,
          gridCols: 1,
          options: [
            { value: "tunis", label: "Tunis" },
            { value: "sfax", label: "Sfax" },
            { value: "sousse", label: "Sousse" },
            { value: "gabes", label: "Gabès" },
            { value: "bizerte", label: "Bizerte" },
          ],
        },
        {
          name: "companySize",
          label: "Taille de l'entreprise",
          type: "select",
          required: true,
          gridCols: 1,
          options: [
            { value: "1-10", label: "1-10 employés" },
            { value: "11-50", label: "11-50 employés" },
            { value: "51-200", label: "51-200 employés" },
            { value: "201-500", label: "201-500 employés" },
            { value: "500+", label: "500+ employés" },
          ],
        },
        {
          name: "presentation",
          label: "Description de l'entreprise",
          type: "textarea",
          required: true,
          gridCols: 2,
          rows: 4,
        },
      ],
    },
  ],
}

export function getProfileConfig(role: string): ProfileConfig {
  return role === "entreprise" ? companyConfig : candidateConfig
}

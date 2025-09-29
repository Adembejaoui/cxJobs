export interface ProfileField {
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select" | "multiselect" | "checkbox" | "file" | "number" | "date"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  description?: string
  accept?: string // for file inputs
  maxLength?: number
  rows?: number // for textarea
}

export interface ProfileSection {
  id: string
  title: string
  icon: string
  fields: ProfileField[]
  isArray?: boolean
  addButtonText?: string
  itemTitle?: string
}

export interface ProfileConfig {
  sections: ProfileSection[]
}

export function getProfileConfig(role: string): ProfileConfig {
  const baseConfig: ProfileConfig = {
    sections: [],
  }

  if (role === "candidate") {
    baseConfig.sections = [
      {
        id: "personalInfo",
        title: "Informations personnelles",
        icon: "👤",
        fields: [
          { name: "name", label: "Nom complet", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Téléphone", type: "tel" },
          { name: "location", label: "Localisation", type: "text" },
          { name: "jobTitle", label: "Titre professionnel", type: "text" },
          { name: "presentation", label: "Présentation", type: "textarea", rows: 4 },
          {
            name: "logo",
            label: "Photo de profil",
            type: "file",
            accept: "image/*",
            description: "Recommandé: format carré, 400x400 pixels minimum",
          },
        ],
      },
      {
        id: "experiences",
        title: "Expériences",
        icon: "💼",
        isArray: true,
        addButtonText: "Ajouter une expérience",
        itemTitle: "Expérience",
        fields: [
          { name: "title", label: "Poste", type: "text", required: true },
          { name: "company", label: "Entreprise", type: "text", required: true },
          { name: "location", label: "Lieu", type: "text" },
          { name: "startDate", label: "Date de début", type: "date", required: true },
          { name: "endDate", label: "Date de fin", type: "date" },
          { name: "current", label: "Poste actuel", type: "checkbox" },
          { name: "description", label: "Description", type: "textarea", rows: 3 },
        ],
      },
      {
        id: "education",
        title: "Formation",
        icon: "🎓",
        isArray: true,
        addButtonText: "Ajouter une formation",
        itemTitle: "Formation",
        fields: [
          { name: "degree", label: "Diplôme", type: "text", required: true },
          { name: "school", label: "École/Université", type: "text", required: true },
          { name: "startDate", label: "Date de début", type: "date" },
          { name: "endDate", label: "Date de fin", type: "date" },
          { name: "description", label: "Description", type: "textarea", rows: 2 },
        ],
      },
      {
        id: "languages",
        title: "Langues",
        icon: "🌍",
        isArray: true,
        addButtonText: "Ajouter une langue",
        itemTitle: "Langue",
        fields: [
          { name: "language", label: "Langue", type: "text", required: true },
          {
            name: "level",
            label: "Niveau",
            type: "select",
            required: true,
            options: [
              { value: "A1", label: "A1 - Débutant" },
              { value: "A2", label: "A2 - Élémentaire" },
              { value: "B1", label: "B1 - Intermédiaire" },
              { value: "B2", label: "B2 - Intermédiaire avancé" },
              { value: "C1", label: "C1 - Avancé" },
              { value: "C2", label: "C2 - Maîtrise" },
              { value: "native", label: "Langue maternelle" },
            ],
          },
        ],
      },
      {
        id: "competences",
        title: "Compétences",
        icon: "⚡",
        isArray: true,
        addButtonText: "Ajouter une compétence",
        itemTitle: "Compétence",
        fields: [
          { name: "name", label: "Nom de la compétence", type: "text", required: true },
          {
            name: "level",
            label: "Niveau",
            type: "select",
            required: true,
            options: [
              { value: "beginner", label: "Débutant" },
              { value: "intermediate", label: "Intermédiaire" },
              { value: "advanced", label: "Avancé" },
              { value: "expert", label: "Expert" },
            ],
          },
        ],
      },
      {
        id: "jobPreferences",
        title: "Préférences d'emploi",
        icon: "💼",
        fields: [
          {
            name: "contractTypes",
            label: "Types de contrat recherchés",
            type: "multiselect",
            description: "Sélectionnez tous les types de contrats qui vous intéressent",
            options: [
              { value: "CDI", label: "CDI" },
              { value: "CDD", label: "CDD" },
              { value: "Stage", label: "Stage" },
              { value: "Freelance", label: "Freelance" },
              { value: "Temps partiel", label: "Temps partiel" },
            ],
          },
          {
            name: "salaryExpectationMin",
            label: "Salaire minimum souhaité (DT)",
            type: "number",
            placeholder: "Ex: 1000",
            description: "Montant minimum en dinars tunisiens",
          },
          {
            name: "salaryExpectationMax",
            label: "Salaire maximum souhaité (DT)",
            type: "number",
            placeholder: "Ex: 2000",
            description: "Montant maximum en dinars tunisiens",
          },
          {
            name: "workHours",
            label: "Horaires de travail préférés",
            type: "select",
            description: "Choisissez votre créneau horaire préféré",
            options: [
              { value: "full-time", label: "Temps plein" },
              { value: "part-time", label: "Temps partiel" },
              { value: "flexible", label: "Horaires flexibles" },
            ],
          },
        ],
      },
    ]
  } else if (role === "company") {
    baseConfig.sections = [
      {
        id: "companyInfo",
        title: "Informations de l'entreprise",
        icon: "🏢",
        fields: [
          { name: "name", label: "Nom de l'entreprise", type: "text", required: true },
          { name: "email", label: "Email entreprise", type: "email", required: true },
          { name: "phone", label: "Téléphone", type: "tel" },
          { name: "address", label: "Adresse complète", type: "textarea", rows: 2 },
          { name: "website", label: "Site web", type: "text" },
          {
            name: "sector",
            label: "Secteur d'activité",
            type: "select",
            options: [
              { value: "technology", label: "Technologie" },
              { value: "finance", label: "Finance" },
              { value: "healthcare", label: "Santé" },
              { value: "education", label: "Éducation" },
              { value: "retail", label: "Commerce" },
              { value: "services", label: "Services" },
              { value: "manufacturing", label: "Industrie" },
              { value: "other", label: "Autre" },
            ],
          },
          {
            name: "size",
            label: "Taille de l'entreprise",
            type: "select",
            options: [
              { value: "1-10", label: "1-10 employés" },
              { value: "11-50", label: "11-50 employés" },
              { value: "51-200", label: "51-200 employés" },
              { value: "201-500", label: "201-500 employés" },
              { value: "501-1000", label: "501-1000 employés" },
              { value: "1000+", label: "1000+ employés" },
            ],
          },
          { name: "foundedYear", label: "Année de création", type: "number" },
          {
            name: "langage",
            label: "Langues de communication",
            type: "multiselect",
            description: "Choisissez les langues de communication de votre entreprise",
            options: [
              { value: "Francais", label: "Francais" },
              { value: "Anglais", label: "Anglais" },
              { value: "Arabe", label: "Arabe" },
              { value: "Allemand", label: "Allemand" },
              { value: "Italien", label: "Italien" },
              { value: "Espagnol", label: "Espagnol" },
            ],
          },
          { name: "description", label: "Description de l'entreprise", type: "textarea", rows: 4 },
        ],
      },
      {
        id: "values",
        title: "Valeurs de l'entreprise",
        icon: "💎",
        isArray: true,
        addButtonText: "Ajouter d'autre valeur",
        itemTitle: "Valeur",
        fields: [
          { name: "title", label: "Titre de la valeur", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
        ],
      },
      {
        id: "advantages",
        title: "Avantages et bénéfices",
        icon: "🎁",
        isArray: true,
        addButtonText: "Ajouter autre avantage et benefice",
        itemTitle: "Avantage",
        fields: [
          { name: "title", label: "Titre de l'avantage", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
        ],
      },
      {
        id: "mediaAndPhotos",
        title: "Médias et Photos de l'entreprise",
        icon: "📸",
        fields: [
          { name: "logo", label: "Logo de l'entreprise", type: "file", accept: "image/*" },
          {
            name: "coverPhoto",
            label: "Photo de couverture",
            type: "file",
            accept: "image/*",
            description: "Recommandé: 1200x300 pixels",
          },
        ],
      },
      {
        id: "photos",
        title: "Photos supplémentaires",
        icon: "🖼️",
        isArray: true,
        addButtonText: "Ajouter une image",
        itemTitle: "Photo",
        fields: [
          { name: "imageUrl", label: "Image", type: "file", accept: "image/*", required: true },
          { name: "caption", label: "Légende", type: "text" },
        ],
      },
    ]
  }

  return baseConfig
}

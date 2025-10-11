

export type ApplicationMode = {
  viaCxJobs: boolean
  atsUrl?: string
}

export type Requirements = {
  skills: string[]
  languages: string[]
}



export interface JobOffer {
  status(status: any): import("react").ReactNode
  id: string
  title: string
  location: string
  contractType: string
  salaryMin?: number
  salaryMax?: number
  workMode: "sur site" | "hybride" | "télétravail"
  description: string
  applicationMode: ApplicationMode
  requirements: Requirements
  companyId: string
  visibility: "public" | "private"
  expirationDate?: string
  notifyOnApplication: boolean
  publishNow: boolean
  createdAt: string
  updatedAt: string
}

export interface JobOfferFormData {
  title: string
  location: string
  contractType: string
  salaryMin?: number
  salaryMax?: number
  displaySalary: boolean
  workMode: "sur site" | "hybride" | "télétravail"
  displayWorkMode: boolean
  description: string
  status? : string
  applicationMode: ApplicationMode
  requirements: Requirements
  visibility: "public" | "private"
  expirationDate?: string
  notifyOnApplication: boolean
  publishNow: boolean

}

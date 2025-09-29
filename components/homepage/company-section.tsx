import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Star, Building2 } from "lucide-react"
import { DynamicCard, type CardConfig } from "@/components/dynamicComponent/dynamic-card"

const companies = [
  {
    id: 1,
    name: "CallCenter Pro Office",
    jobs: 35,
    logo: "",
    description: "Leader dans les services de centre d'appel en Tunisie avec plus de 10 ans d'expérience",
    location: "Tunis, Tunisie",
    industry: "Centre d'appel",
    employees: "500-1000",
    rating: 4.5,
    founded: 2012,
    specialties: ["Support client", "Vente", "Télémaketing"],
    isHiring: true,
 
  },
  {
    id: 2,
    name: "TechSupport Tunisia Office",
    jobs: 42,
    logo: "",
    description: "Spécialiste du support technique multilingue pour les entreprises internationales",
    location: "Sfax, Tunisie",
    industry: "Support technique",
    employees: "200-500",
    rating: 4.3,
    founded: 2015,
    specialties: ["Support IT", "Assistance technique", "Help desk"],
    isHiring: true,

  },
  {
    id: 3,
    name: "CallCenter Pro",
    jobs: 28,
    description: "Solutions complètes de centre d'appel avec technologie de pointe",
    logo: "",
    location: "Sousse, Tunisie",
    industry: "Centre d'appel",
    employees: "100-200",
    rating: 4.2,
    founded: 2018,
    specialties: ["Service client", "Prospection", "Enquêtes"],
    isHiring: true,

  },
  {
    id: 4,
    name: "TechSupport Tunisia",
    jobs: 35,
    description: "Expertise en support technique et maintenance informatique",
    logo: "",
    location: "Monastir, Tunisie",
    industry: "Support technique",
    employees: "50-100",
    rating: 4.4,
    founded: 2016,
    specialties: ["Maintenance IT", "Support réseau", "Cybersécurité"],
    isHiring: false,

  },
  {
    id: 5,
    name: "Digital Solutions Hub",
    jobs: 18,
    description: "Agence digitale spécialisée dans les solutions de communication client",
    logo: "",
    location: "Ariana, Tunisie",
    industry: "Services digitaux",
    employees: "20-50",
    rating: 4.6,
    founded: 2020,
    specialties: ["Marketing digital", "CRM", "Chatbots"],
    isHiring: true,

  },
  {
    id: 6,
    name: "Global Connect Services",
    jobs: 67,
    description: "Plateforme internationale de services client multicanaux",
    logo: "",
    location: "La Marsa, Tunisie",
    industry: "Services client",
    employees: "1000+",
    rating: 4.7,
    founded: 2008,
    specialties: ["Omnichannel", "Support 24/7", "Formation"],
    isHiring: true,

  },
]

export function CompanySection() {
  const companyConfig: CardConfig = {
    showImage: true,
    imageKey: "logo",
    titleKey: "name",
    descriptionKey: "description",
    showBadges: true,
    showRating: true,
    ratingKey: "rating",
    fields: [
      {
        key: "founded",
        render: (value: number, item: any) => (
          <div className="flex items-center gap-2 mb-2">
             <span className="text-sm text-gray-500">Fondée en {value}</span>
          </div>
        ),
      },
      {
        key: "location",
        icon: MapPin,
        className: "mb-1",
      },
      {
        key: "employees",
        render: (value: string) => (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{value} employés</span>
          </div>
        ),
      },
    ],
    primaryAction: {
      label: "Voir Plus",
      variant: "outline",
      className: "bg-transparent",
    },
 
    customSections: [
      {
        key: "jobs-info",
        position: "before-actions",
        render: (item: any) => (
          <div className="flex items-center gap-2 mt-4">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-600">{item.jobs} postes ouverts</span>
          </div>
        ),
      },
      {
        key: "specialties",
        position: "after-description",
        render: (item: any) => (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.specialties?.slice(0, 2).map((specialty: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {item.specialties?.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{item.specialties.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
    ],
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explorez les entreprises</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les leaders du secteur et trouvez l'entreprise qui correspond à vos ambitions professionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => (
            <DynamicCard key={company.id} item={company} config={companyConfig} />
          ))}
        </div>

    
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DynamicCard, type CardConfig } from "@/components/dynamicComponent/dynamic-card"
import { MapPin, Clock, Building2, Users, DollarSign, Calendar } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Téléopérateur Français/Anglais",
    company: "CallCenter Pro",
    location: "Tunis, Tunisie",
    type: "CDI - Temps plein",
    salary: "800-1200 TND",
    candidates: 15,
    isNew: true,
    logo: "",
    description:
      "Rejoignez notre équipe dynamique en tant que téléopérateur bilingue. Excellente opportunité de développement professionnel.",
    requirements: ["Français courant", "Anglais intermédiaire", "Expérience client"],
    benefits: ["Formation payée", "Primes mensuelles", "Assurance santé"],
    postedDate: "Il y a 2 jours",
    department: "Service Client",
    experience: "1-2 ans",
  },
  {
    id: 2,
    title: "Superviseur Centre d'Appel",
    company: "TechSupport Tunisia",
    location: "Tunis, Tunisie",
    type: "CDI - Temps plein",
    salary: "1500-2000 TND",
    candidates: 12,
    isNew: false,
    logo: "",
    description:
      "Encadrez une équipe de téléopérateurs et assurez la qualité du service client. Poste à responsabilités avec évolution possible.",
    requirements: ["Management d'équipe", "Français/Anglais", "Expérience call center"],
    benefits: ["Salaire attractif", "Voiture de fonction", "Formation continue"],
    postedDate: "Il y a 5 jours",
    department: "Management",
    experience: "3-5 ans",
  },
  {
    id: 3,
    title: "Développeur Full Stack",
    company: "Digital Solutions",
    location: "Tunis, Tunisie",
    type: "CDI - Temps plein",
    salary: "2000-3000 TND",
    candidates: 8,
    isNew: true,
    logo: "",
    description:
      "Développez des applications web modernes avec les dernières technologies. Environnement startup dynamique.",
    requirements: ["React/Node.js", "TypeScript", "Base de données"],
    benefits: ["Télétravail partiel", "Équipement fourni", "Projets innovants"],
    postedDate: "Il y a 1 jour",
    department: "Développement",
    experience: "2-4 ans",
  },
  {
    id: 4,
    title: "Responsable Marketing Digital",
    company: "Global Connect Services",
    location: "Tunis, Tunisie",
    type: "CDI - Temps plein",
    salary: "1800-2500 TND",
    candidates: 20,
    isNew: false,
    logo: "",
    description: "Pilotez la stratégie marketing digital et développez la présence en ligne de l'entreprise.",
    requirements: ["Marketing digital", "SEO/SEM", "Réseaux sociaux"],
    benefits: ["Budget marketing", "Formation certifiante", "Bonus objectifs"],
    postedDate: "Il y a 3 jours",
    department: "Marketing",
    experience: "3-5 ans",
  },
]

export function JobsSection() {
  const jobConfig: CardConfig = {
    showImage: true,
    imageKey: "logo",
    titleKey: "title",
    descriptionKey: "description",
    showBadges: true,
    showRating: false,
    fields: [
      {
        key: "company",
        icon: Building2,
        className: "mb-1",
      },
      {
        key: "location",
        icon: MapPin,
        className: "mb-1",
      },
      {
        key: "type",
        icon: Clock,
        className: "mb-1",
      },
      {
        key: "salary",
        icon: DollarSign,
        render: (value: string) => (
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
            <DollarSign className="w-4 h-4" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        key: "experience",
        icon: Users,
        render: (value: string) => (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Expérience: {value}</span>
          </div>
        ),
      },
      {
        key: "postedDate",
        icon: Calendar,
        render: (value: string) => (
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4" />
            <span>{value}</span>
          </div>
        ),
      },
    ],
    primaryAction: {
      label: "Postuler",
      variant: "outline",
      className: " bg-transparent ",
    },
 
    customSections: [
      {
        key: "requirements",
        position: "after-description",
        render: (item: any) => (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.requirements?.slice(0, 3).map((req: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
            {item.requirements?.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{item.requirements.length - 3}
              </Badge>
            )}
          </div>
        ),
      },
    ],
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trouvez un emploi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités de carrière exceptionnelles dans les meilleures entreprises de Tunisie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <DynamicCard key={job.id} item={job} config={jobConfig} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
            Voir toutes les offres d'emploi
          </Button>
        </div>
      </div>
    </section>
  )
}

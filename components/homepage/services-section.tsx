import { Phone, Target, Users } from "lucide-react"

const services = [
  {
    icon: Phone,
    title: "Spécialiste centres d'appel",
    description: "Expertise dédiée exclusivement aux métiers des centres d'appel et du service client professionnel",
  },
  {
    icon: Target,
    title: "Matching intelligent",
    description: "Algorithme de correspondance basé sur une connaissance approfondie de votre profil professionnel",
  },
  {
    icon: Users,
    title: "Suivi personnalisé",
    description: "Accompagnement dans votre recherche avec des outils de suivi et d'analyse avancés",
  },
]

export function ServicesSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Repensez le travail avec notre expertise</h2>
          <p className="text-gray-600">Des outils et services conçus pour votre réussite</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

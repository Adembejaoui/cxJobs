import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"

const articles = [
  "Comment réussir son entretien en centre d'appel",
  "Les compétences les plus recherchées en 2024",
  "Télétravail et présentiel : que préfèrent les candidats ?",
  "Salaire moyen dans les centres d'appel en Tunisie",
  "Comment négocier son salaire efficacement",
]

export function ResourcesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos conseils</h2>
          <p className="text-gray-600">Conseils, astuces et tendances pour réussir votre carrière</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Derniers articles</h3>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Comment réussir son entretien en centre d'appel
                    </h4>
                    <p className="text-sm text-gray-600">
                      Découvrez les clés pour impressionner les recruteurs et décrocher le poste de vos rêves.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-teal-600">
                      Lire l'article
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Tendances</h3>
            <ul className="space-y-4">
              {articles.map((article, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">{article}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

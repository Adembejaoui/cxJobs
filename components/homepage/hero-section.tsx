import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-teal-500 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">L'EMPLOI EST À VOUS</h1>
        <p className="text-lg md:text-xl mb-8 text-teal-100">Des milliers d'opportunités qui n'attendent que vous</p>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto mb-8">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="h-5 w-5 text-gray-400" />
            <Input placeholder="Rechercher un poste" className="border-0 focus-visible:ring-0 text-gray-900" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 border-l border-gray-200">
            <MapPin className="h-5 w-5 text-gray-400" />
            <Input placeholder="Ville" className="border-0 focus-visible:ring-0 text-gray-900" />
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8">Rechercher</Button>
        </div>

        <p className="text-sm text-teal-100 mb-6">
          Découvrez plus de 100 offres d'emploi dans les centres d'appel en Tunisie
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-teal-500"
          >
            Créer mon compte
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-teal-500"
          >
            Découvrir les offres
          </Button>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  "CX Jobs": ["La plateforme spécialisée pour les métiers du centre d'appel en Tunisie"],
  Candidats: ["Créer son compte", "Rechercher un emploi", "Explorer les entreprises", "Conseils carrière"],
  Entreprises: ["Publier une annonce", "Rechercher des candidats", "Solutions RH"],
  Newsletter: ["Recevez les dernières offres d'emploi"],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              {title === "Newsletter" ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">{links[0]}</p>
                  <div className="flex gap-2">
                    <Input placeholder="Votre email" className="bg-gray-800 border-gray-700 text-white" />
                    <Button className="bg-teal-500 hover:bg-teal-600">S'abonner</Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">© 2024 CX Jobs. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

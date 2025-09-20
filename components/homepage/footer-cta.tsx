import { Button } from "@/components/ui/button"

export function FooterCTA() {
  return (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          CHOISISSEZ L'ENTREPRISE QUI VOUS CORRESPOND
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Rejoignez des milliers de candidats qui ont trouvé leur emploi idéal
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-teal-500 hover:bg-teal-600">Commencer</Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
          >
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
  )
}

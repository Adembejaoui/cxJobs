import { SectionHeader } from "./section-header"

interface CompanyTabProps {
  companyName: string
  description?: string
  sector?: string
  size?: string
  foundedYear?: number
  website?: string
  values?: Array<{ title: string; description: string }>
}

export function CompanyTab({ companyName, description, sector, size, foundedYear, website, values }: CompanyTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title={`À propos de ${companyName}`} />
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description || "Description de l'entreprise non disponible."}
        </p>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {sector && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Secteur</p>
              <p className="font-semibold">{sector}</p>
            </div>
          )}
          {size && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Taille</p>
              <p className="font-semibold">{size}</p>
            </div>
          )}
          {foundedYear && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Année de création</p>
              <p className="font-semibold">{foundedYear}</p>
            </div>
          )}
          {website && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Site web</p>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Visiter le site
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Company Values */}
      {values && values.length > 0 && (
        <div>
          <SectionHeader title="Nos valeurs" />
          <div className="grid gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="border-l-4 border-primary pl-6 py-2">
                <h4 className="font-semibold mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { RequirementsList } from "./requirements-list"
import { SectionHeader } from "./section-header"
import { CheckCircle2 } from "lucide-react"

interface DescriptionTabProps {
  description: string
  skills: string[]
  languages: string[]
  advantages?: Array<{ title: string; description: string }>
}

export function DescriptionTab({ description, skills, languages, advantages }: DescriptionTabProps) {
  return (
    <div className="space-y-8">
      {/* Description du poste */}
      <div>
        <SectionHeader title="Description du poste" />
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Responsabilités */}
      {skills.length > 0 && (
        <div>
          <SectionHeader title="Responsabilités" />
          <RequirementsList items={skills} variant="check" />
        </div>
      )}

      {/* Exigences */}
      {languages.length > 0 && (
        <div>
          <SectionHeader title="Exigences" />
          <RequirementsList
            items={[
              ...languages.map((lang) => `Niveau de ${lang} courant (écrit et oral)`),
              "Bonnes compétences en communication",
              "Capacité à travailler en équipe",
            ]}
            variant="bullet"
          />
        </div>
      )}

      {/* Avantages */}
      {advantages && advantages.length > 0 && (
        <div>
          <SectionHeader title="Avantages" />
          <ul className="space-y-3">
            {advantages.map((advantage, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{advantage.title}</span>
                  {advantage.description && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{advantage.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

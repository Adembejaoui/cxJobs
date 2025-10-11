import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "./section-header"

interface ProcessTabProps {
  recruitment?: Array<{ title: string; duration: string; description: string }>
}

export function ProcessTab({ recruitment }: ProcessTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title="Processus de recrutement" />
        <p className="text-muted-foreground mb-8 leading-relaxed">Voici les étapes de notre processus de recrutement</p>

        {recruitment && recruitment.length > 0 ? (
          <div className="space-y-6">
            {recruitment.map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {idx + 1}
                  </div>
                  {idx < recruitment.length - 1 && <div className="w-0.5 h-full bg-border mt-3" />}
                </div>
                <div className="flex-1 pb-10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{step.title}</h4>
                    <Badge variant="secondary" className="text-sm">
                      {step.duration}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            Les informations sur le processus de recrutement ne sont pas encore disponibles.
          </p>
        )}
      </div>
    </div>
  )
}

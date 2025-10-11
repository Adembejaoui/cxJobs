import { CheckCircle2 } from "lucide-react"

interface RequirementsListProps {
  items: string[]
  variant?: "check" | "bullet"
}

export function RequirementsList({ items, variant = "check" }: RequirementsListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          {variant === "check" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
          )}
          <span className="text-muted-foreground leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

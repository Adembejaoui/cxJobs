import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className = "" }: FormSectionProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </Card>
  )
}

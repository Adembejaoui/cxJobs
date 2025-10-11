import { Card, CardContent } from "@/components/ui/card"

interface JobInfoCardProps {
  createdAt: string
  expirationDate?: string
  jobId: string
}

export function JobInfoCard({ createdAt, expirationDate, jobId }: JobInfoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée"
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold mb-4">Informations sur l'offre</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Publiée:</span>
            <span className="font-medium">{formatDate(createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date limite:</span>
            <span className="font-medium">{formatDate(expirationDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Référence:</span>
            <span className="font-medium">{jobId.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Catégorie:</span>
            <span className="font-medium">Centre d'appel</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

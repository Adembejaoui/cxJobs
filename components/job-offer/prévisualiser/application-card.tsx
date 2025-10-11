import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ApplicationCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold mb-4">Postuler à cette offre</h3>
        <p className="text-sm text-muted-foreground mb-4">Postulez rapidement en quelques clics</p>

        <div className="flex items-center gap-3 mb-4 p-3 bg-muted rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">CV</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
              Modifier
            </Button>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Postuler maintenant
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-3">
          En postulant, vous acceptez nos{" "}
          <a href="#" className="text-primary hover:underline">
            conditions
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-primary hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </CardContent>
    </Card>
  )
}

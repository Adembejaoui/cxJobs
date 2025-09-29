"use client"

import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()
  const role = params.role as string

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "candidat":
        return "candidat"
      case "COMPANY":
        return "COMPANY"
      default:
        return "candidat"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full system access with user management and configuration capabilities"
      case "candidat":
        return "Accès candidat avec gestion du profil et suivi des candidatures"
      case "COMPANY":
        return "Accès entreprise avec gestion des offres et statistiques"
      default:
        return "Standard user access"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const
      case "candidat":
        return "default" as const
      case "entreprise":
        return "secondary" as const
      default:
        return "secondary" as const
    }
  }

  console.log("[v0] Current role from params:", role)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-16 lg:pt-4 lg:pl-4">
      <div className="bg-muted/50 min-h-[200vh] flex-1 rounded-xl flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant={getRoleBadgeVariant(role)} className="text-sm px-3 py-1">
              {getRoleDisplayName(role)}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-foreground">Welcome to your {getRoleDisplayName(role)} Dashboard</h1>

          <p className="text-muted-foreground text-lg leading-relaxed">{getRoleDescription(role)}</p>

          <div className="mt-8 p-4 bg-background/50 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Current Role: <span className="font-medium text-foreground">{role}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              The sidebar navigation and available features are customized based on your role permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

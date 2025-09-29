"use client"

import { useProfile } from "@/hooks/use-profile"
import { ProfileView } from "./profile-view"
import { ProfileSkeleton } from "./profile-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ProfileContainerProps {
  role: "candidate" | "company"
}

export function ProfileContainer({ role }: ProfileContainerProps) {
  console.log("[v0] ProfileContainer rendered with role:", role)

  const { profile, loading, error } = useProfile(role)

  console.log("[v0] ProfileContainer state:", { profile, loading, error })

  if (loading) {
    console.log("[v0] ProfileContainer: Showing loading skeleton")
    return <ProfileSkeleton />
  }

  if (error) {
    console.log("[v0] ProfileContainer: Showing error state:", error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-destructive mb-2">Erreur de chargement</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-xs text-muted-foreground mb-4">Vérifiez la console pour plus de détails</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    console.log("[v0] ProfileContainer: No profile data available, showing skeleton")
    return <ProfileSkeleton />
  }

  console.log("[v0] ProfileContainer: Rendering ProfileView with profile data")
  return <ProfileView profile={profile} role={role} />
}

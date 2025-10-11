"use client"

import { useParams } from "next/navigation"
import { ProfileEditForm } from "@/components/edit/profile-edit-form"
import { useEffect, useState } from "react"

export default function ProfileEditPage() {
  const params = useParams()
  const roleParam = params.role as string
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)


  // Convert URL role to config role format - never throw errors
  const getConfigRole = (urlRole: string): "candidate" | "company" => {
    // Handle undefined, null, or invalid parameters
    if (!urlRole || urlRole === "[role]" || urlRole === "undefined") {
      console.log("[v0] Invalid or missing role parameter, defaulting to candidate")
      return "candidate"
    }

    const normalizedRole = urlRole.toLowerCase().trim()
    console.log("[v0] Normalized role:", normalizedRole)

    // Support multiple variations
    if (normalizedRole === "candidat" || normalizedRole === "candidate") {
      return "candidate"
    }

    if (normalizedRole === "company" || normalizedRole === "entreprise") {
      return "company"
    }

    // Default fallback - never throw
    console.log("[v0] Unrecognized role:", urlRole, "- defaulting to candidate")
    return "candidate"
  }

  const role = getConfigRole(roleParam)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/profile?role=${role}`)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Loaded profile data:", data)
          setProfileData(data.profile || {})
        } else if (response.status === 404) {
          // Profile doesn't exist yet, start with empty data
          console.log("[v0] No existing profile found, starting fresh")
          setProfileData({})
        } else {
          console.error("[v0] Failed to load profile:", response.status)
          setProfileData({})
        }
      } catch (error) {
        console.error("[v0] Error loading profile:", error)
        setProfileData({})
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [roleParam])

  const handleSave = async (data: any) => {
    console.log("[v0] Profile edit page - Save handler called:", {
      originalRoleParam: roleParam,
      resolvedRole: role,
      data,
      timestamp: new Date().toISOString(),
    })

    try {
      const response = await fetch(`/api/profile?role=${role}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileData: data }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Profile saved successfully:", result)
        alert(`Profile ${role} saved successfully!`)
        setProfileData(result.profile)
      } else {
        const error = await response.json()
        console.error("[v0] Failed to save profile:", error)
        alert(`Failed to save profile: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProfileEditForm role={role} initialData={profileData} onSave={handleSave} />
    </div>
  )
}

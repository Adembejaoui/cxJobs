"use client"

import { useState, useEffect } from "react"
import type { ProfileData } from "@/types/profile"

interface UseProfileReturn {
  profile: ProfileData | null
  loading: boolean
  error: string | null
}

export function useProfile(role: "candidate" | "company"): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] useProfile: Starting fetch for role:", role)

        const url = `/api/profile?role=${role}`
        console.log("[v0] useProfile: Constructed URL:", url)
        console.log("[v0] useProfile: Current window.location:", window.location.href)
        console.log("[v0] useProfile: Full fetch URL:", new URL(url, window.location.origin).href)

        const response = await fetch(url)

        console.log("[v0] useProfile: Response status:", response.status)
        console.log("[v0] useProfile: Response ok:", response.ok)
        console.log("[v0] useProfile: Response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorText = await response.text()
          console.log("[v0] useProfile: Error response text:", errorText)
          throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[v0] useProfile: Raw response data:", data)

        if (data.success && data.profile) {
          console.log("[v0] useProfile: Setting profile data:", data.profile)
          setProfile(data.profile)
        } else {
          console.log("[v0] useProfile: No profile data in response")
          setProfile(null)
        }
      } catch (err) {
        console.error("[v0] useProfile: Error fetching profile:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchProfile()
    }, 100)

    return () => clearTimeout(timer)
  }, [role])

  return { profile, loading, error }
}

import { notFound } from "next/navigation"
import { ProfileContainer } from "@/components/profile/profile-container"
import { use } from "react";

interface ProfilePageProps {
 params: Promise<{ role: string }>;
}

export default   function ProfilePage({ params }: ProfilePageProps) {
  const { role } = use(params);

  console.log("[v0] ProfilePage rendered with role:", role)
  console.log("[v0] ProfilePage params:", params)

  const normalizedRole = role.toLowerCase()

  if (normalizedRole !== "candidate" && normalizedRole !== "company") {
    console.log("[v0] ProfilePage: Invalid role, calling notFound()")
    notFound()
  }

  console.log("[v0] ProfilePage: Valid role, rendering ProfileContainer")
  return <ProfileContainer role={normalizedRole as "candidate" | "company"} />
}

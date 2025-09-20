"use client"
import { Suspense } from "react"
import type React from "react"

import { Toaster } from "sonner"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { DynamicNavbar } from "@/components/dynamicComponent/dynamic-navbar"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = pathname.startsWith("/dashboard")
  const { data: session, status } = useSession()

  return (
    <>
      <Suspense fallback={null}>
        {!hideNavbar && (
          <DynamicNavbar user={session?.user} session={session} sessionStatus={status} variant="default" />
        )}
        {children}
        <Toaster richColors position="bottom-right" />
      </Suspense>
    </>
  )
}

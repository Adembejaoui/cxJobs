"use client"

import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileSidebarTrigger } from "@/components/mobile-sidebar-trigger"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useParams } from "next/navigation"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const role = params.role as string

  console.log("[v0] Dashboard layout - Current role:", role)

  return (
    <SidebarProvider>
      <MobileSidebarTrigger />
      <AppSidebar Role={role} />
      <SidebarInset>{children}</SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}

"use client"

import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { DynamicButton } from "./dynamicComponent/dynamic-button"


export function MobileSidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <DynamicButton
      label=""
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-40 lg:hidden h-10 w-10 bg-white shadow-md border border-gray-200 hover:bg-gray-50"
      iconLeft={<Menu className="h-5 w-5" />}
    />
  )
}

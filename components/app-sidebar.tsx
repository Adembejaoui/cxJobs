"use client"

import type React from "react"

import { useState } from "react"
import { Home, User, FileText, Building2, Settings, Briefcase, Heart, LogOut, ChartNoAxesCombined } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DynamicButton } from "@/components/dynamicComponent/dynamic-button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

type NavItem = {
  id: string
  title: string
  url: string
  icon: React.ComponentType<any>
}

interface AppSidebarProps {
  className?: string
  Role?: string
  user?: any | null
  session?: any
  onLogout?: () => void
}

export function AppSidebar({ Role, className, user, session, onLogout, ...props }: AppSidebarProps) {
  const [activeItem, setActiveItem] = useState("profile")
  const route = useRouter()
  const { data: sessionData, status } = useSession()

  const currentUser = sessionData?.user || session?.user || user

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const userInitials = currentUser?.initials || (currentUser?.name ? getInitials(currentUser.name) : "")

  const userRole = sessionData?.user?.role || session?.user?.role || user?.role || Role
  const navItems = roleNavigation[userRole as keyof typeof roleNavigation] || roleNavigation.candidat

  const handleNavClick = (itemId: string, url: string) => {
    route.push(url)
    setActiveItem(itemId)
  }

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
    } else {
      await signOut({ callbackUrl: "/auth" })
    }
  }

  if (status === "loading") {
    return (
      <Sidebar collapsible="icon" className={cn("border-r border-gray-200", className)} {...props}>
        <SidebarHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex flex-col min-w-0 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4 flex-1">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <Sidebar collapsible="icon" className={cn("border-r border-gray-200", className)} {...props}>
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-green-100">
            <AvatarImage src={currentUser.image || currentUser.avatar || ""} alt={currentUser.name || "User"} />
            <AvatarFallback
              className="font-semibold text-sm"
              style={{
                backgroundColor: "#22c55e",
                color: "#ffffff",
              }}
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-gray-900 text-sm truncate">{currentUser.name}</span>
            <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 flex-1 overflow-y-auto">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={activeItem === item.id} className="p-0 hover:bg-transparent">
                <DynamicButton
                  variant="ghost"
                  fullWidth
                  isActive={activeItem === item.id}
                  iconLeft={<item.icon className="h-4 w-4" />}
                  label={item.title}
                  onClick={() => handleNavClick(item.id, item.url)}
                  className={cn(
                    "justify-start px-3 py-2.5 h-auto font-medium text-sm rounded-lg transition-all duration-200",
                    activeItem === item.id
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-gray-100">
        <div className="space-y-2">
          {bottomActions.map((item) => (
            <DynamicButton
              key={item.title}
              label={item.title}
              variant="ghost"
              fullWidth
              className="justify-start px-3 py-2.5 h-auto text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
              iconLeft={<item.icon className="h-4 w-4" />}
              onClick={() => console.log(`Clicked: ${item.title}`)}
            />
          ))}

          <SidebarSeparator className="my-3" />

          <DynamicButton
            label="Se déconnecter"
            variant="ghost"
            fullWidth
            className="justify-start px-3 py-2.5 h-auto text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            iconLeft={<LogOut className="h-4 w-4" />}
            onClick={handleLogout}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

const roleNavigation = {
  candidat: [
    {
      id: "dashboard",
      title: "Tableau de bord",
      url: "/dashboard/candidat",
      icon: Home,
    },
    {
      id: "profile",
      title: "Mon profil",
      url: "/dashboard/candidat/profile",
      icon: User,
    },
    {
      id: "applications",
      title: "Mes candidatures",
      url: "/dashboard/candidat/applications",
      icon: FileText,
    },
    {
      id: "companies",
      title: "Entreprises suivies",
      url: "/dashboard/candidat/companies",
      icon: Building2,
    },
    {
      id: "settings",
      title: "Paramètres",
      url: "/dashboard/candidat/settings",
      icon: Settings,
    },
  ],
  COMPANY: [
    {
      id: "dashboard",
      title: "Tableau de bord",
      url: "/dashboard/entreprise",
      icon: Home,
    },
    {
      id: "offres",
      title: "Mes Offres",
      url: "/dashboard/entreprise/profile",
      icon: User,
    },
    {
      id: "statistique",
      title: "Statistique",
      url: "/dashboard/entreprise/stats",
      icon: ChartNoAxesCombined ,
    },
     {
      id: "Profile",
      title: "Profil Entreprise",
      url: "/dashboard/COMPANY/profile",
      icon: Building2,
    },
    {
      id: "settings",
      title: "Paramètres",
      url: "/dashboard/entreprise/settings",
      icon: Settings,
    },
  ],
}

const bottomActions = [
  {
    title: "Parcourir les offres",
    url: "#",
    icon: Briefcase,
  },
  {
    title: "Découvrir des entreprises",
    url: "#",
    icon: Heart,
  },
]

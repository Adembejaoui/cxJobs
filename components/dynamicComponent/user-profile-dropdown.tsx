"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart3, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Profiler } from "react"

interface UserProfileDropdownProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string // 👈 Add role for dashboard path
  }
  className?: string
  variant?: "default" | "solid"
}

export function UserProfileDropdown({ user, className, variant = "default" }: UserProfileDropdownProps) {
  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth" }) // 👈 Redirect to home after logout
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500",
            variant === "solid" && "hover:bg-white/10",
            className,
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-teal-500 text-white text-sm">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Dashboard link */}
        <Link href={`/dashboard/${user.role || "user"}`} passHref>
          <DropdownMenuItem asChild className="cursor-pointer">
            <div>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </div>
          </DropdownMenuItem>
        </Link>

        <Link href={`/dashboard/${user.role || "user"}/profile`} passHref>
          <DropdownMenuItem asChild className="cursor-pointer">
            <div>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </div>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

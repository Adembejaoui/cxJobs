"use client"

import * as React from "react"
import { DynamicButton } from "@/components/dynamicComponent/dynamic-button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserProfileDropdown } from "./user-profile-dropdown"

interface NavItem {
  label: string
  href?: string
  items?: { label: string; href: string; description?: string }[]
}

interface ActionButton {
  label: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  href?: string
  onClick?: () => void
}

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  onboardingCompleted?: boolean
}

interface DynamicNavbarProps {
  logo?: {
    text?: string
    image?: string
    href?: string
  }
  navItems?: NavItem[]
  actionButtons?: ActionButton[]
  className?: string
  variant?: "default" | "transparent" | "solid"
  onSidebarToggle?: () => void
  isSidebarOpen?: boolean
  user?: User | null
  session?: any
  sessionStatus?: "loading" | "authenticated" | "unauthenticated"
}

export function DynamicNavbar({
  logo = {
    text: "CX jobs",
    href: "/",
    image: "https://7oj7bcuug3.ufs.sh/f/94oYByNNHJpidP3C22xZvf6soUkcD7yaKVBCqGJ5pOPMzXW8",
  },
  navItems = [
    { label: "Trouver un emploi", href: "/jobs" },
    { label: "Trouver une entreprise", href: "/companies" },
    { label: "Média", href: "/media" },
  ],
  actionButtons = [
    { label: "Pour employeurs", variant: "outline", href: "/employers" },
    { label: "Se connecter", variant: "default", href: "/auth" },
  ],
  className,
  variant = "default",
  onSidebarToggle,
  isSidebarOpen = false,
  user,
  session,
  sessionStatus = "loading",
}: DynamicNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const currentUser = session?.user

  const variantStyles = {
    default: "bg-white border-b border-gray-200 shadow-sm",
    transparent: "bg-transparent",
    solid: "bg-teal-500 text-white shadow-md",
  }

  const handleButtonClick = (button: ActionButton) => {
    if (button.href) {
      window.location.href = button.href
    } else if (button.onClick) {
      button.onClick()
    }
  }

  return (
    <nav className={cn("sticky top-0 z-50 w-full transition-all duration-200", variantStyles[variant], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-18">
          {onSidebarToggle && (
            <div className="lg:hidden mr-3">
              <DynamicButton
                label=""
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10 p-2", variant === "solid" && "text-white hover:bg-white/10")}
                onClick={onSidebarToggle}
                iconLeft={<Menu className="h-5 w-5" />}
              />
            </div>
          )}

          {/* Logo */}
          <div className="flex-shrink-0 mr-8 lg:mr-12">
            <a href={logo.href} className="flex items-center">
              {logo.image ? (
                <img
                  src={logo.image || "/placeholder.svg"}
                  alt="Logo"
                  className="h-10 lg:h-12 w-auto"
                  width={1000}
                  height={200}
                />
              ) : (
                <span className={cn("text-xl font-bold", variant === "solid" ? "text-white" : "text-teal-600")}>
                  {logo.text}
                </span>
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {!onSidebarToggle && (
              <NavigationMenu>
                <NavigationMenuList className="gap-6">
                  {navItems.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger
                            className={cn(
                              "bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100",
                              variant === "solid" && "text-white hover:bg-white/10 data-[state=open]:bg-white/10",
                            )}
                          >
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid gap-3 p-4 w-[400px]">
                              {item.items.map((subItem, subIndex) => (
                                <NavigationMenuLink
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                                >
                                  <div className="text-sm font-medium leading-none">{subItem.label}</div>
                                  {subItem.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {subItem.description}
                                    </p>
                                  )}
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          href={item.href}
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                            variant === "solid" &&
                              "text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Action Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            {!onSidebarToggle && (
              <>
                {sessionStatus === "loading" ? (
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ) : currentUser ? (
                  <UserProfileDropdown user={currentUser} variant={variant === "solid" ? "solid" : "default"} />
                ) : (
                  actionButtons.map((button, index) => (
                    <DynamicButton
                      key={index}
                      label={button.label}
                      variant={button.variant}
                      size="sm"
                      className={cn(
                        button.variant === "outline" &&
                          variant === "solid" &&
                          "border-white text-white hover:bg-white hover:text-teal-500",
                        button.variant === "default" &&
                          variant === "solid" &&
                          "bg-white text-teal-500 hover:bg-gray-100",
                        button.label === "Se connecter" &&
                          "bg-green-600 hover:bg-green-700 text-white border-green-600",
                      )}
                      onClick={() => handleButtonClick(button)}
                    />
                  ))
                )}
              </>
            )}
          </div>

          {/* Mobile menu button - only show when no sidebar */}
          {!onSidebarToggle && (
            <div className="md:hidden ml-auto">
              <DynamicButton
                label=""
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10 p-2", variant === "solid" && "text-white hover:bg-white/10")}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                iconLeft={isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              />
            </div>
          )}
        </div>

        {/* Mobile Navigation - only show when no sidebar */}
        {!onSidebarToggle && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Nav Items */}
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.items ? (
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "block px-3 py-2 text-base font-medium",
                          variant === "solid" ? "text-white" : "text-gray-900",
                        )}
                      >
                        {item.label}
                      </div>
                      {item.items.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "block px-6 py-2 text-sm hover:bg-gray-100 rounded-md",
                            variant === "solid" ? "text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900",
                          )}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md",
                        variant === "solid" ? "text-white hover:bg-white/10" : "text-gray-900",
                      )}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}

              <div className="px-3 py-2 space-y-2">
                {sessionStatus === "loading" ? (
                  <div className="flex items-center space-x-3 p-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : currentUser ? (
                  <div className="flex items-center space-x-3 p-2">
                    <UserProfileDropdown user={currentUser} variant={variant === "solid" ? "solid" : "default"} />
                    <span className={cn("text-sm font-medium", variant === "solid" ? "text-white" : "text-gray-900")}>
                      {currentUser.name}
                    </span>
                  </div>
                ) : (
                  <>
                    {actionButtons.map((button, index) => (
                      <DynamicButton
                        key={index}
                        label={button.label}
                        variant={button.variant}
                        size="sm"
                        fullWidth
                        className={cn(
                          button.label === "Se connecter" &&
                            "bg-green-600 hover:bg-green-700 text-white border-green-600",
                        )}
                        onClick={() => handleButtonClick(button)}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

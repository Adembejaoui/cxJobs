"use client"

// components/ui/dynamic-button.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface DynamicButtonProps {
  label: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  className?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  isActive?: boolean
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function DynamicButton({
  label,
  variant = "default",
  size = "default",
  onClick,
  className,
  iconLeft,
  iconRight,
  disabled = false,
  fullWidth = false,
  isActive = false,
  type = "button",
}: DynamicButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        fullWidth && "w-full justify-start",
        isActive && "bg-green-500 text-white hover:bg-green-600 border-green-500",
        className,
        
      )}
    >
      {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      <span className={cn("truncate", !label && "sr-only")}>{label}</span>
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </Button>
  )
}

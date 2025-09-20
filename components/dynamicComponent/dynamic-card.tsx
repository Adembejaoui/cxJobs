"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { ReactNode } from "react"

export interface BaseItem {
  id?: string | number
  [key: string]: any
}

export interface CardField {
  key: string
  label?: string
  icon?: any
  render?: (value: any, item: BaseItem) => ReactNode
  className?: string
  show?: (item: BaseItem) => boolean
  wrapper?: string // CSS classes for field wrapper
}

export interface CardAction {
  label: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onClick?: (item: BaseItem) => void
}

export interface CardConfig {
  showImage?: boolean
  imageKey?: string // Which property contains the image URL
  titleKey?: string // Which property contains the title
  descriptionKey?: string // Which property contains the description
  showBadges?: boolean
  badgeConfig?: {
    key: string
    condition?: (item: BaseItem) => boolean
    className?: string
    text?: string | ((item: BaseItem) => string)
  }[]
  showRating?: boolean
  ratingKey?: string
  fields?: CardField[]
  primaryAction?: CardAction
  secondaryAction?: CardAction
  customSections?: {
    key: string
    render: (item: BaseItem) => ReactNode
    position: "before-description" | "after-description" | "before-actions"
  }[]
  cardClassName?: string
  contentClassName?: string
}

export interface DynamicCardProps {
  item: BaseItem
  config: CardConfig
  onAction?: (action: string, item: BaseItem) => void
  className?: string
}

export function DynamicCard({ item = {}, config = {}, onAction, className = "" }: DynamicCardProps) {
  if (!item || typeof item !== "object") {
    return null
  }

  const {
    showImage = false,
    imageKey = "logo",
    titleKey = "title",
    descriptionKey = "description",
    showBadges = true,
    badgeConfig = [],
    showRating = false,
    ratingKey = "rating",
    fields = [],
    primaryAction,
    secondaryAction,
    customSections = [],
    cardClassName = "",
    contentClassName = "",
  } = config

  const renderField = (field: CardField): ReactNode => {
    if (field.show && !field.show(item)) return null

    const value = item[field.key]
    if (!value && value !== 0) return null

    if (field.render) {
      return <div className={field.wrapper || ""}>{field.render(value, item)}</div>
    }

    const IconComponent = field.icon
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-600 ${field.className || ""} ${field.wrapper || ""}`}>
        {IconComponent && <IconComponent className="w-4 h-4" />}
        {field.label && <span className="font-medium">{field.label}:</span>}
        <span>{value}</span>
      </div>
    )
  }

  const getBadges = () => {
    const badges = []

    // Default badges based on common properties
    if (item?.featured) badges.push({ text: "Featured", className: "bg-teal-500 hover:bg-teal-600" })
    if (item?.isNew) badges.push({ text: "Nouveau", className: "bg-blue-500 hover:bg-blue-600" })
    if (item?.isPopular) badges.push({ text: "Populaire", className: "bg-orange-500 hover:bg-orange-600" })
    if (item?.isHiring) badges.push({ text: "Recrute", className: "bg-green-500 hover:bg-green-600" })

    // Custom badges from config
    badgeConfig.forEach((badge) => {
      if (!badge.condition || badge.condition(item)) {
        const text = typeof badge.text === "function" ? badge.text(item) : badge.text || item[badge.key]
        if (text) {
          badges.push({ text, className: badge.className || "bg-gray-500 hover:bg-gray-600" })
        }
      }
    })

    return badges
  }

  const renderCustomSection = (section: (typeof customSections)[0]) => {
    return (
      <div key={section.key} className="mb-4">
        {section.render(item)}
      </div>
    )
  }

  const title = item[titleKey] || item.name || "Untitled"
  const description = item[descriptionKey]
  const imageUrl = item[imageKey]
  const rating = showRating ? item[ratingKey] : null

  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        item?.featured ? "ring-2 ring-teal-500 ring-opacity-50" : ""
      } ${cardClassName} ${className}`}
    >
      <CardContent className={`p-6 flex flex-col h-full ${contentClassName}`}>
        <div className="flex-1">
          {/* Badges */}
          {showBadges && (
            <div className="flex flex-wrap gap-2 mb-4">
              {getBadges().map((badge, index) => (
                <Badge key={index} className={badge.className}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {/* Header with image and title */}
          <div className="flex items-start gap-4 mb-4">
            {showImage && imageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={title}
                  className="w-16 h-16 object-contain bg-white rounded-lg border border-gray-200 p-2"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rating}</span>
                </div>
              )}

              {/* Dynamic fields */}
              <div className="space-y-1">
                {fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>{renderField(field)}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom sections before description */}
          {customSections.filter((section) => section.position === "before-description").map(renderCustomSection)}

          {/* Description */}
          {description && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>}

          {/* Custom sections after description */}
          {customSections.filter((section) => section.position === "after-description").map(renderCustomSection)}
        </div>

        {/* Custom sections before actions */}
        {customSections.filter((section) => section.position === "before-actions").map(renderCustomSection)}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {primaryAction && (
            <Button
              variant={primaryAction.variant || "default"}
              size={primaryAction.size || "sm"}
              className={`flex-1 bg-teal-500 hover:bg-teal-600 ${primaryAction.className || ""}`}
              onClick={() => {
                if (primaryAction.onClick) {
                  primaryAction.onClick(item)
                } else {
                  onAction?.("primary", item)
                }
              }}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              size={secondaryAction.size || "sm"}
              className={`flex-1 ${secondaryAction.className || ""}`}
              onClick={() => {
                if (secondaryAction.onClick) {
                  secondaryAction.onClick(item)
                } else {
                  onAction?.("secondary", item)
                }
              }}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

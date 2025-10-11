"use client"

import { MapPin, Clock, Calendar, Eye, MoreVertical, Languages, EyeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { JobOffer } from "@/types/jobOffer"
import { DynamicButton } from "../dynamicComponent/dynamic-button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface JobOfferCardProps {
  offer: JobOffer
}

export function JobOfferCard({ offer }: JobOfferCardProps) {
    const router = useRouter()
    const { data: sessionData, status } = useSession()
    
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Brouillon
          </Badge>
        )
      case "published":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Publié
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

    function handleClick(){
    router.push(`/dashboard/company/jobOffer/${offer.id}`)
    }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title and Badges */}
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
           
            {offer.visibility === "public" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Public
              </Badge>
            )}
          </div>

          <p className="mb-4 text-sm text-gray-600"></p>

          {/* Details Row */}
          <div className="mb-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{offer.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{offer.contractType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{offer.expirationDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {offer.requirements.languages.map((language) => (
              <Badge key={language} variant="outline" className="border-gray-300 text-gray-700">
                <Languages className="mr-1 h-3 w-3" />
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="ml-4 flex items-center gap-2">
         <DynamicButton
                label="Prévisualiser"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                iconLeft={<EyeIcon className="h-4 w-4" />}
                onClick={handleClick}
                />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              <DropdownMenuItem>Dupliquer</DropdownMenuItem>
              <DropdownMenuItem>Archiver</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

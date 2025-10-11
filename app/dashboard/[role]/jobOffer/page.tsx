"use client"

import { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobOfferCard } from "@/components/job-offer/job-offer-card"
import type { JobOffer } from "@/types/jobOffer"
import Link from "next/link"
import { DynamicButton } from "@/components/dynamicComponent/dynamic-button"
import { useRouter } from "next/navigation"


export default function JobOffersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()

        // Add status filter if not "all"
        if (statusFilter !== "all") {
          params.append("status", statusFilter)
        }

        const response = await fetch(`/api/job-offers?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch job offers")
        }

        const data = await response.json()
        setJobOffers(data.jobOffers)
      } catch (error) {
        console.error("[v0] Error fetching job offers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobOffers()
  }, [statusFilter])

  // Filter job offers based on search
  const filteredOffers = jobOffers.filter((offer) => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Count offers by status
  const totalCount = jobOffers.length


    function handleClick(): void {
        router.push("/dashboard/company/jobOffer/create")    }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes offres d&apos;emploi</h1>
            <p className="mt-1 text-sm text-gray-600">Gérez toutes vos offres d&apos;emploi</p>
          </div>
         <DynamicButton
      label="Créer une offre"
      className="bg-emerald-600 hover:bg-emerald-700 text-white"
      iconLeft={<Plus className="h-4 w-4" />}
      onClick={handleClick}
    />
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes ({totalCount})</SelectItem>
              <SelectItem value="published">Publiées </SelectItem>
              <SelectItem value="draft">Brouillons </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Offers List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => <JobOfferCard key={offer.id} offer={offer} />)
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">Aucune offre d&apos;emploi trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

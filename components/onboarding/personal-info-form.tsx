"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalInfoFormProps {
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
  userType: "candidate" | "company"
}

export function PersonalInfoForm({ data, onChange, userType }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState(data)

  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange(newData)
  }

  if (userType === "candidate") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Mohamed Ben Ali"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professionalTitle">Titre professionnel</Label>
            <Input
              id="professionalTitle"
              value={formData.professionalTitle || ""}
              onChange={(e) => handleChange("professionalTitle", e.target.value)}
              placeholder="Agent de support client"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="mohamed.benali@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+216 55 123 456"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Select value={formData.location || ""} onValueChange={(value) => handleChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tunis">Tunis, Tunisie</SelectItem>
              <SelectItem value="sfax">Sfax, Tunisie</SelectItem>
              <SelectItem value="sousse">Sousse, Tunisie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="presentation">Présentation</Label>
          <Textarea
            id="presentation"
            value={formData.presentation || ""}
            onChange={(e) => handleChange("presentation", e.target.value)}
            placeholder="Professionnel du service client avec 3 ans d'expérience dans les centres d'appel. Trilingue (français, anglais, arabe) avec d'excellentes compétences en communication et résolution de problèmes."
            rows={4}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise</Label>
          <Input
            id="companyName"
            value={formData.companyName || ""}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="CallCenter Pro"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sector">Secteur d'activité</Label>
          <Select value={formData.sector || ""} onValueChange={(value) => handleChange("sector", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="technology">Technologie</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Santé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email entreprise</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="contact@callcenterpro.tn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+216 71 123 456"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse complète</Label>
        <Textarea
          id="address"
          value={formData.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Avenue Habib Bourguiba, Tunis"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://callcenterpro.tn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="foundedYear">Année de création</Label>
          <Input
            id="foundedYear"
            value={formData.foundedYear || ""}
            onChange={(e) => handleChange("foundedYear", e.target.value)}
            placeholder="2013"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description de l'entreprise</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Leader dans les services de centre d'appel en Tunisie avec plus de 10 ans d'expérience."
          rows={4}
        />
      </div>
    </div>
  )
}

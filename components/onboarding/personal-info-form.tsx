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
  errors?: Record<string, string>
}

export function PersonalInfoForm({ data, onChange, userType, errors = {} }: PersonalInfoFormProps) {
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
            <Label htmlFor="name">
              Nom complet <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Mohamed Ben Ali"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Titre professionnel</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle || ""}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              placeholder="Agent de support client"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="mohamed.benali@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
          <Input
            id="location"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Tunis, Tunisie"
          />
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
          <Label htmlFor="name">
            Nom de l'entreprise <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="CallCenter Pro"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sector">Secteur d'activité</Label>
          <Select value={formData.sector || ""} onValueChange={(value) => handleChange("sector", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technologie</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Santé</SelectItem>
              <SelectItem value="education">Éducation</SelectItem>
              <SelectItem value="retail">Commerce</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="manufacturing">Industrie</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email entreprise <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="contact@callcenterpro.tn"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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

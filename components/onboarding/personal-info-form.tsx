"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PersonalInfoData {
  fullName: string
  email: string
  phone: string
  location: string
  professionalTitle: string
  presentation: string
}

interface PersonalInfoFormProps {
  data: PersonalInfoData
  onChange: (data: PersonalInfoData) => void
  userType: "candidate"
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const updateField = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Votre nom complet"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+33 1 23 45 67 89"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Paris, France"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalTitle">Titre professionnel</Label>
        <Input
          id="professionalTitle"
          value={data.professionalTitle}
          onChange={(e) => updateField("professionalTitle", e.target.value)}
          placeholder="Développeur Full Stack"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="presentation">Présentation</Label>
        <Textarea
          id="presentation"
          value={data.presentation}
          onChange={(e) => updateField("presentation", e.target.value)}
          placeholder="Décrivez-vous en quelques mots..."
          rows={4}
        />
      </div>
    </div>
  )
}

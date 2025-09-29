"use client"

import type { CompanyProfile } from "@/types/profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Award, Globe, Phone, Mail, MapPin, Heart, CheckCircle, Users, Calendar, Star } from "lucide-react"

interface CompanySectionsProps {
  profile: CompanyProfile
}

export function CompanySections({ profile }: CompanySectionsProps) {
  const websiteDisplay = profile.website?.replace(/^https?:\/\//, "")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact */}
          {(profile.website || profile.phone || profile.email || profile.address) && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-primary flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-primary" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-accent transition-colors"
                    >
                      {websiteDisplay}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${profile.email}`} className="text-primary hover:text-accent">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Company Info */}
          {(profile.size || profile.foundedYear || profile.sector) && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.size && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-foreground/70" />
                      <span className="text-sm text-foreground">Taille</span>
                    </div>
                    <Badge variant="outline">{profile.size}</Badge>
                  </div>
                )}
                {profile.foundedYear && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-foreground/70" />
                      <span className="text-sm text-foreground">Fondée</span>
                    </div>
                    <Badge variant="outline">{profile.foundedYear}</Badge>
                  </div>
                )}
                {profile.sector && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-foreground/70" />
                      <span className="text-sm text-foreground">Secteur</span>
                    </div>
                    <Badge variant="secondary">{profile.sector}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {profile.langage?.length && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground">Langues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.langage.map((lang, index) => {
                    const langName = typeof lang === "string" ? lang : lang?.name || ""
                    if (!langName.trim()) return null

                    return (
                      <Badge key={index} variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                        {langName}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">À propos</TabsTrigger>
              <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
              <TabsTrigger value="company-life">Vie d'entreprise</TabsTrigger>
              <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 mt-6">
              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                    <Building className="w-5 h-5" />À propos de {profile.name}
                  </h2>
                  {profile.description && profile.description.trim() ? (
                    <p className="text-muted-foreground leading-relaxed">{profile.description}</p>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed italic">
                      Aucune description disponible pour le moment.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Values */}
              {profile.values?.length && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Heart className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Nos valeurs</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {profile.values.map((value, index) => {
                        if (!value.title?.trim() && !value.description?.trim()) return null

                        return (
                          <div key={index} className="text-center p-4 rounded-lg bg-primary/8 border border-primary/20">
                            <h4 className="font-semibold text-foreground mb-2">{value.title?.trim() || "Valeur"}</h4>
                            <p className="text-sm text-foreground/80">
                              {value.description?.trim() || "Description à venir"}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Advantages */}
              {profile.advantages?.length && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary">Avantages</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profile.advantages.map((advantage, index) => {
                        if (!advantage.title?.trim() && !advantage.description?.trim()) return null

                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10"
                          >
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-foreground">{advantage.title?.trim() || "Avantage"}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {advantage.description?.trim() || "Description à venir"}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="jobs" className="mt-6">
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune offre d'emploi disponible</h3>
                  <p className="text-muted-foreground">Les offres d'emploi seront affichées ici.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company-life" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Vie chez {profile.name}</h2>

                {profile.photos && profile.photos.length > 0 ? (
                  <div className="space-y-8">
                    {profile.photos.map((photo, index) => (
                      <div key={index} className="grid md:grid-cols-2 gap-6 items-center">
                        {index % 2 === 0 ? (
                          // Image on right, text on left
                          <div>
                            {photo.caption && <p className="text-foreground/80 leading-relaxed">{photo.caption}</p>}
                          </div>
                        ) : (
                          // Image on left, text on right
                          <div>
                            {photo.caption && <p className="text-foreground/80 leading-relaxed">{photo.caption}</p>}
                          </div>
                        )}
                        <div>
                          <img
                            src={photo.imageUrl || "/placeholder.svg"}
                            alt={photo.caption || `Photo ${index + 1}`}
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Default sections when no photos available */}
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Building className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Photo à venir</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Formation initiale</h3>
                        <p className="text-foreground/80 leading-relaxed">
                          Tous les nouveaux employés bénéficient d'une formation complète de 2 semaines.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="order-2 md:order-1">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Événements d'équipe</h3>
                        <p className="text-foreground/80 leading-relaxed">
                          Nous organisons régulièrement des événements pour renforcer l'esprit d'équipe.
                        </p>
                      </div>
                      <div className="order-1 md:order-2 aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Photo à venir</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Building className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Photo à venir</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Environnement de travail</h3>
                        <p className="text-foreground/80 leading-relaxed">
                          Nos bureaux sont conçus pour favoriser la productivité et le bien-être.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="testimonials" className="mt-6">
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun témoignage disponible</h3>
                  <p className="text-muted-foreground">Les témoignages des employés seront affichés ici.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

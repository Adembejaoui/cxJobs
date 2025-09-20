"use client"
import { CompanySection } from "@/components/homepage/company-section";
import { Footer } from "@/components/homepage/footer";
import { FooterCTA } from "@/components/homepage/footer-cta";
import { HeroSection } from "@/components/homepage/hero-section";
import { JobsSection } from "@/components/homepage/jobs-section";
import { ResourcesSection } from "@/components/homepage/resources-section";
import { ServicesSection } from "@/components/homepage/services-section";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"

export default function homepage() {
  return (
     <div className="min-h-screen">
      <HeroSection />
      <CompanySection />
      <JobsSection />
      <ServicesSection />
      <ResourcesSection />
      <FooterCTA />
      <Footer />
    </div>
  )
}  

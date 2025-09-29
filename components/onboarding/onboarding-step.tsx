"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OnboardingStepProps {
  title: string
  description: string
  children: ReactNode
  currentStep: number
  totalSteps: number
  stepName: string
}

export function OnboardingStep({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  stepName,
}: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Étape {currentStep + 1} sur {totalSteps}
          </span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-center">
          <Badge variant="outline">{stepName}</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { LoginForm } from "./login-form"
import { SignUpForm } from "./sign-up-form"

export function AuthTabs({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4", className)}
      {...props}
    >
      <Card className="w-full mt-10 p-2 sm:p-4 md:p-6">
        <CardContent className="p-0">
          <div className="flex justify-center mb-6">
            <img
              src="https://7oj7bcuug3.ufs.sh/f/94oYByNNHJpidP3C22xZvf6soUkcD7yaKVBCqGJ5pOPMzXW8"
              alt="Logo"
              className="h-25 w-auto"
            />
          </div>
          {activeTab === "login" ? (
            <LoginForm className="gap-4" onSwitchToSignup={() => setActiveTab("signup")} />
          ) : (
            <SignUpForm className="gap-4" onSwitchToLogin={() => setActiveTab("login")} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

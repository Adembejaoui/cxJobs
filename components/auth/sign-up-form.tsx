"use client"
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { DynamicButton } from "../dynamicComponent/dynamic-button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSwitchToLogin?: () => void
}

export function SignUpForm({ className, onSwitchToLogin, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const toastId = toast.loading("Creating your account...")

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match", {
    description: "Please make sure both passwords are identical.",
    })
    toast.dismiss(toastId)
    setIsLoading(false)
    return
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "CANDIDATE",
      }),
    })

    const data = await response.json()

   if (!data.success)  
{
      toast.error("Registration failed", {
      description: data.message || "Something went wrong",
  })
  return
}
    
    toast.success("Account created 🎉", {
      description: data.message,
    })
   await signIn("credentials", {
      redirect: false, // prevent NextAuth from redirecting automatically
      email: formData.email,
      password: formData.password,
    })

    // ✅ Force onboarding first
    router.push("/onboarding")

    
  } catch (error: any) {
    toast.error("Registration failed", {
      description: error.message || "Something went wrong. Please try again.",
    })
  } finally {
    toast.dismiss(toastId)
    setIsLoading(false)
  }
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Créer un compte candidat</CardTitle>
        <CardDescription>Trouvez votre prochain emploi dans le secteur CX</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="**********"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="**********"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <DynamicButton
                label={isLoading ? "Creating Account..." : "Create Account"}
                variant="outline"
                size="lg"
                iconLeft={<UserPlus size={10} />}
                type="submit"
                disabled={isLoading}
              />
            </div>
            <div className="text-center text-sm">
              <span className="inline-flex items-center gap-1">
                Already have an account?{" "}
                <DynamicButton
                  label="Sign in"
                  variant="outline"
                  onClick={onSwitchToLogin}
                  className="p-0 h-auto font-medium border-none"
                  disabled={isLoading}
                />
              </span>
            </div>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            <div className="flex flex-col gap-4">
              <DynamicButton label="Sign up with Google" variant="ghost" size="sm" disabled={isLoading} />
            </div>
          </div>
        </form>
      </CardContent>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

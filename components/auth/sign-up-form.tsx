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
import { registerUser } from "@/lib/api"

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

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match", {
          description: "Please make sure both passwords are identical.",
        })
        toast.dismiss(toastId)
        setIsLoading(false)
        return
      }

      const result = await registerUser(formData)

      if (!result) {
        toast.error("Registration failed", {
          description: "Something went wrong. Please try again.",
        })
        toast.dismiss(toastId)
        setIsLoading(false)
        return
      }

      if (!result.success) {
        if (result.fieldErrors && result.fieldErrors.length > 0) {
          const firstError = result.fieldErrors[0]
          toast.error("Validation Error", {
            description: firstError.message,
          })
        } else {
          toast.error("Registration failed", {
            description: result.message || "Please try again.",
          })
        }
        toast.dismiss(toastId)
        setIsLoading(false)
        return
      }

      toast.success("Account created successfully!", {
        description: "Signing you in...",
      })
      toast.dismiss(toastId)

      // ✅ Auto login after register
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (signInResult?.error) {
        toast.error("Sign in failed", {
          description: "Account created but couldn't sign you in. Please try signing in manually.",
        })
        setIsLoading(false)
        return
      }

      // ✅ Redirect to onboarding
      router.push("/onboarding")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again.",
      })
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

"use client"
import type React from "react"
import { useState } from "react"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { DynamicButton } from "../dynamicComponent/dynamic-button"
import { toast } from "sonner"


interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSwitchToSignup?: () => void
}

export function LoginForm({ className, onSwitchToSignup, ...props }: LoginFormProps) {
  const router = useRouter()
 
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
    toast.error("you re credentials are wrong", {
    description: "Please make sure .",
    })
      
      } else {
      const session = await getSession()
      const role = session?.user?.role || "CANDIDATE" // fallback if role missing
      router.push(`/dashboard/${role}`)
      router.refresh()
      toast.success("Welcome  my freind 🎉")
      router.refresh()
      }
    } catch (error) {
    
    } finally {
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
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Se connecter</CardTitle>
        <CardDescription>Accédez à votre espace personnel</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-6">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
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
              <DynamicButton
                label={isLoading ? "Signing in..." : "Login"}
                type="submit"
                variant="outline"
                size="lg"
                iconLeft={<Send size={10} />}
                disabled={isLoading}
              />
            </div>
            <div className="text-center text-sm">
              <span className="inline-flex items-center gap-1">
                Don&apos;t have an account?{" "}
                <DynamicButton
                  label="Sign up"
                  variant="outline"
                  onClick={onSwitchToSignup}
                  className="p-0 h-auto font-medium border-none"
                  disabled={isLoading}
                />
              </span>
            </div>
           
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
              
            </div>
             <div className="flex flex-col gap-4">
              <DynamicButton label="Login with Google" variant="ghost" size="sm" disabled={isLoading} />
            </div>
          </div>
        </form>
      </CardContent>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

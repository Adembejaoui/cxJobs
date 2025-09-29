"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Mail, CheckCircle, Clock } from "lucide-react"
import { useSession } from "next-auth/react"


interface Invitation {
  id: string
  email: string
  token: string
  used: boolean
  usedAt: Date | null
  expiresAt: Date
  createdAt: Date
}

export default function AdminDashboard() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const session = useSession()


  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/invitation")
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations)
      }
    } catch (error) {
    
    } finally {
      setIsLoading(false)
    }
  }

  const generateInvitation = async () => {
    if (!email) {
  
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/admin/invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          adminUserId:session.data?.user.id, // TODO: Replace with actual admin user ID from auth
        }),
      })

      if (response.ok) {
        const data = await response.json()
    
        setEmail("")
        fetchInvitations()
      } else {
        const error = await response.json()
  
      }
    } catch (error) {
 
    } finally {
      setIsGenerating(false)
    }
  }

  const copyInvitationLink = (token: string) => {
    const invitationUrl = `${window.location.origin}/company/signup?token=${token}`
    navigator.clipboard.writeText(invitationUrl)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage company invitation links and track registrations</p>
      </div>

      {/* Generate New Invitation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate Company Invitation
          </CardTitle>
          <CardDescription>Create a new invitation link for a company to register on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="email">Company Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={generateInvitation} disabled={isGenerating} className="px-6">
              {isGenerating ? "Generating..." : "Generate Link"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Company Invitations
          </CardTitle>
          <CardDescription>All generated invitation links and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading invitations...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invitations generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{invitation.email}</span>
                      {invitation.used ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Used
                        </Badge>
                      ) : new Date(invitation.expiresAt) < new Date() ? (
                        <Badge variant="destructive">
                          <Clock className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span>Created: {formatDate(invitation.createdAt)}</span>
                        <span>Expires: {formatDate(invitation.expiresAt)}</span>
                      </div>
                      {invitation.used && invitation.usedAt && <div>Used: {formatDate(invitation.usedAt)}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvitationLink(invitation.token)}
                      disabled={invitation.used || new Date(invitation.expiresAt) < new Date()}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

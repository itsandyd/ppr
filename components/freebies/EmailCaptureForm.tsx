"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type EmailCaptureFormProps = {
  resourceId?: string
  onComplete?: (email: string) => void
  isPreview?: boolean
}

export default function EmailCaptureForm({ 
  resourceId, 
  onComplete,
  isPreview = false 
}: EmailCaptureFormProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isPreview) {
      toast({
        title: "Preview Mode",
        description: "This is just a preview. In real usage, the email would be collected.",
      })
      return
    }

    if (!resourceId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resource ID is required.",
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/lead-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, resourceId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }
      
      toast({
        title: "Success!",
        description: "Your information has been submitted successfully.",
      })
      
      if (onComplete) {
        onComplete(email)
      }
    } catch (error) {
      console.error("Error submitting lead:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem submitting your information.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter your information to access this resource</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Get Access"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 
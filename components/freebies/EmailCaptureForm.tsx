"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface EmailCaptureFormProps {
  resourceId?: string;
  onComplete?: (email: string) => void;
  isPreview?: boolean;
}

export default function EmailCaptureForm({ resourceId, onComplete, isPreview = false }: EmailCaptureFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isPreview) {
      toast({
        title: "Preview Mode",
        description: "This is just a preview. In real usage, the email would be collected.",
      })
      return
    }
    
    if (!resourceId || !onComplete) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "This form is not properly configured.",
      })
      return
    }
    
    if (!formData.name || !formData.email) {
      toast({
        variant: "destructive",
        title: "Required fields",
        description: "Please provide both name and email.",
      })
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          name: formData.name,
          email: formData.email
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        // If the resource doesn't require lead gen but we're trying to submit anyway
        if (response.status === 400 && data.error?.includes("does not require lead generation")) {
          // Just complete the flow since this is probably just a UI state issue
          console.warn("Resource doesn't require lead gen but form was shown - completing anyway");
          if (onComplete) {
            onComplete(formData.email);
            return;
          }
        }
        
        throw new Error(data.error || "Something went wrong")
      }
      
      toast({
        title: "Thank you!",
        description: "You now have access to this resource.",
      })
      
      if (onComplete) {
        onComplete(formData.email)
      }
    } catch (error) {
      console.error("Error submitting lead:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit your information",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Get Access"}
      </Button>
    </form>
  )
} 
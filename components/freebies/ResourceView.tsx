"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import EmailCaptureForm from "./EmailCaptureForm"
import ClerkSocialAuthGate from "./ClerkSocialAuthGate"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileArchive } from "lucide-react"
import Link from "next/link"

type Resource = {
  id: string
  slug: string
  title: string
  description: string
  fileUrl: string
  fileName: string
  requiresLeadGen: boolean
  followGateRequirements?: any[]
  downloads?: number
  createdAt?: string
}

export default function ResourceView({ resource }: { resource: Resource }) {
  const { toast } = useToast()
  const [accessState, setAccessState] = useState<'none' | 'email-completed' | 'full'>(
    // If no requirements at all, set to full access immediately
    !resource.requiresLeadGen && (!resource.followGateRequirements || resource.followGateRequirements.length === 0) 
      ? 'full' 
      : 'none'
  )
  const [isDownloading, setIsDownloading] = useState(false)
  const [checkingRequirements, setCheckingRequirements] = useState(false)
  
  // Check if social requirements are completed - used for ToneDen-like auto-progression
  const checkSocialRequirementsStatus = async () => {
    if (!resource.followGateRequirements || resource.followGateRequirements.length === 0) {
      return true // No requirements to check
    }

    try {
      setCheckingRequirements(true)
      
      const response = await fetch(`/api/verify-social-action?resourceId=${resource.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch requirements status')
      }
      
      const data = await response.json()
      console.log('Checking social requirements status:', data)
      
      // Check if all required platforms are completed
      const requiredPlatforms = resource.followGateRequirements
        .filter(req => req.platform !== "leadgen")
        .map(req => req.platform)

      const allCompleted = requiredPlatforms.every(platform => 
        data.completedPlatforms?.includes(platform)
      )
      
      console.log('Social requirements check:', {
        requiredPlatforms,
        completedPlatforms: data.completedPlatforms,
        allCompleted
      })
      
      return allCompleted
    } catch (error) {
      console.error('Error checking social requirements:', error)
      return false
    } finally {
      setCheckingRequirements(false)
    }
  }

  // Auto-check for completed requirements when state changes
  useEffect(() => {
    if (accessState === 'email-completed') {
      // Initial check immediately
      checkSocialRequirementsStatus().then(allCompleted => {
        if (allCompleted) {
          setAccessState('full');
          toast({
            title: "All Requirements Completed",
            description: "You can now download this resource.",
          });
          return; // No need to set up interval if already completed
        }
      });
      
      // Periodically check if social requirements are completed - more frequently to be responsive
      const checkInterval = setInterval(async () => {
        console.log("Checking social requirements status...");
        const allCompleted = await checkSocialRequirementsStatus();
        
        if (allCompleted) {
          clearInterval(checkInterval);
          setAccessState('full');
          toast({
            title: "All Requirements Completed",
            description: "You can now download this resource.",
          });
        }
      }, 2000); // Check every 2 seconds instead of 3
      
      return () => clearInterval(checkInterval);
    }
  }, [accessState, resource.id, toast]);

  // Initial check for completed requirements
  useEffect(() => {
    // Check if we need to handle email + social or just social
    const checkInitialState = async () => {
      // If no lead gen required, check if we can skip straight to full access
      if (!resource.requiresLeadGen) {
        const socialCompleted = await checkSocialRequirementsStatus()
        if (socialCompleted) {
          setAccessState('full')
        } else if (resource.followGateRequirements && resource.followGateRequirements.length > 0) {
          setAccessState('email-completed') // Skip to social auth directly
        }
      }
    }
    
    checkInitialState()
  }, [resource.id])

  const handleEmailCaptureComplete = (email: string) => {
    if (resource.followGateRequirements && resource.followGateRequirements.length > 0) {
      setAccessState('email-completed')
      toast({
        title: "Email Verified",
        description: "Please complete the social requirements to access this resource.",
      })
      
      // Check if social requirements are already completed (for ToneDen-like experience)
      checkSocialRequirementsStatus().then(allCompleted => {
        if (allCompleted) {
          setAccessState('full')
          toast({
            title: "All Requirements Completed",
            description: "You can now download this resource.",
          })
        }
      })
    } else {
      setAccessState('full')
      toast({
        title: "Access Granted",
        description: "You can now download this resource.",
      })
    }
  }
  
  const handleSocialAuthComplete = () => {
    setAccessState('full')
    toast({
      title: "All Requirements Completed",
      description: "You can now download this resource.",
    })
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Record the download
      await fetch(`/api/resources/${resource.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      // Open the file URL in a new tab
      window.open(resource.fileUrl, '_blank')
      
      toast({
        title: "Download Started",
        description: "Your download should begin automatically.",
      })
    } catch (error) {
      console.error("Error downloading resource:", error)
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was a problem starting your download.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <div className="mr-2 p-2 bg-blue-600 rounded-full">
            <FileArchive className="w-4 h-4" />
          </div>
          <span className="text-sm text-gray-400">ZIP Archive</span>
        </div>
        <CardTitle className="text-2xl">{resource.title}</CardTitle>
        <CardDescription className="text-gray-400 mt-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {accessState === 'none' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-md">
              <h3 className="text-lg font-medium mb-2">This resource requires your information</h3>
              <p className="text-gray-400">
                To access this resource, please provide your email address below.
              </p>
            </div>
            <EmailCaptureForm 
              resourceId={resource.id} 
              onComplete={handleEmailCaptureComplete} 
            />
          </div>
        )}
        
        {accessState === 'email-completed' && resource.followGateRequirements && (
          <div className="space-y-4">
            {checkingRequirements && (
              <div className="text-center py-2 text-sm text-gray-400">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-primary rounded-full mr-2"></div>
                Checking requirement status...
              </div>
            )}
            <ClerkSocialAuthGate 
              requirements={resource.followGateRequirements}
              onComplete={handleSocialAuthComplete}
              resourceTitle={resource.title}
              resourceId={resource.id}
            />
          </div>
        )}
        
        {accessState === 'full' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-md">
              <h3 className="text-lg font-medium mb-2">Download Ready</h3>
              <p className="text-gray-400">
                Your resource is ready to download. Click the button below to get your file.
              </p>
              {resource.fileName && (
                <div className="mt-4 p-2 bg-gray-700 rounded flex items-center">
                  <FileArchive className="w-5 h-5 mr-2 text-blue-400" />
                  <span className="text-sm text-gray-300">{resource.fileName}</span>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={handleDownload} 
                size="lg" 
                className="px-8"
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Starting Download..." : "Download Now"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-400">
        <div>
          {resource.downloads !== undefined && (
            <span>Downloads: {resource.downloads}</span>
          )}
        </div>
        <div>
          <Link href="/freebies/resources" className="text-primary hover:underline">
            Back to Resources
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 
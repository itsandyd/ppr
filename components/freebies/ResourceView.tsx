"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import EmailCaptureForm from "./EmailCaptureForm"
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
  const [hasAccess, setHasAccess] = useState(!resource.requiresLeadGen)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleEmailCaptureComplete = (email: string) => {
    setHasAccess(true)
    toast({
      title: "Access Granted",
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
        {!hasAccess ? (
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
        ) : (
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
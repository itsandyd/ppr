"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import ResourceView from "@/components/freebies/ResourceView"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileArchive } from "lucide-react"

type Resource = {
  id: string
  slug: string
  title: string
  description: string
  fileName: string
  fileUrl: string
  requiresLeadGen: boolean
  followGateRequirements?: any[]
  type?: string
  downloads?: number
  imageUrl?: string
  createdAt?: string
}

export default function ResourceDetailPage() {
  const params = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResource() {
      if (!params.slug) return
      
      try {
        // Fetching by slug from our API
        const response = await fetch(`/api/resources/${params.slug}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch resource')
        }
        
        setResource(data.resource)
      } catch (err) {
        console.error('Error fetching resource:', err)
        setError('Failed to load this resource. It may have been removed or does not exist.')
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [params.slug])

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
          <div className="text-center">
            <a 
              href="/freebies/resources" 
              className="text-primary hover:underline"
            >
              Back to Resources
            </a>
          </div>
        </div>
      )}
      
      {resource && (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Resource image */}
            <div className="lg:w-1/2">
              <div className="relative w-full h-[300px] lg:h-[400px] rounded-lg overflow-hidden">
                <Image 
                  src={resource.imageUrl || "/placeholder.svg"} 
                  alt={resource.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Right side - Resource details and download functionality */}
            <div className="lg:w-1/2">
              <ResourceView resource={resource} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
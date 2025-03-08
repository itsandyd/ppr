"use client"

import { useEffect, useState } from "react"
import { ResourceCard } from "@/components/freebies/ResourceCard"

// Define the resource type
type Resource = {
  id: string;
  title: string;
  description: string;
  fileName: string; 
  fileUrl: string;
  requiresLeadGen: boolean;
  followGateRequirements?: any[];
  type?: string;
  downloads?: number;
  imageUrl?: string;
  createdAt?: string;
  slug: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch('/api/resources')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch resources')
        }
        
        setResources(data.resources || [])
      } catch (err) {
        console.error('Error fetching resources:', err)
        setError('Failed to load resources. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Production Resources</h1>
      <p className="text-muted-foreground mb-6">Download helpful resources for your music production journey.</p>
      
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {!loading && resources.length === 0 && !error && (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground">
            Be the first to share a resource with the community!
          </p>
          <a 
            href="/freebies/create-resource" 
            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Create Resource
          </a>
        </div>
      )}
      
      {resources.length > 0 && (
        <div className="masonry-grid">
          {resources.map((resource) => (
            <div key={resource.id} className="masonry-item">
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      )}
      
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Free Resources for Music Producers</h2>
        <p className="mb-4">
          Browse our complete collection of free music production resources. All resources are free to download and use in your productions.
          We regularly update our library with new content, so check back often for the latest additions.
        </p>
        <p>
          Looking for something specific? Create an account to request resources or share your own with the community.
        </p>
      </section>
    </div>
  )
}


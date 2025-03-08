import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Music, FileAudio, FileArchive } from "lucide-react"
import type React from "react" // Added import for React
import { db } from "@/lib/db"
import { ResourceCard } from "@/components/freebies/ResourceCard"
import { Resource } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

// Force this page to be dynamically rendered
export const dynamic = 'force-dynamic'

// Define metadata for this specific page
export const metadata: Metadata = {
  title: "Free Music Production Resources & Samples | MusicGate",
  description: "Download free music production resources, samples, VST plugins, and project files. High-quality tools for music producers using Ableton, FL Studio, Logic Pro and more.",
  keywords: "free music samples, free VST plugins, music production tools, Ableton resources, FL Studio resources, free project files, music producer tools, free sound packs, music production freebies",
  openGraph: {
    title: "Free Music Production Resources & Samples | MusicGate",
    description: "Download free music production resources, samples, VST plugins, and project files. High-quality tools for music producers using Ableton, FL Studio, Logic Pro and more.",
    url: "https://app.pauseplayrepeat.com/freebies",
  },
  alternates: {
    canonical: "https://app.pauseplayrepeat.com/freebies"
  }
}

// Function to get icon based on file type
const getIconForResource = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'mp3' || extension === 'wav' || extension === 'aiff') {
    return <FileAudio className="w-4 h-4" />;
  } else if (extension === 'zip') {
    return <FileArchive className="w-4 h-4" />;
  } else {
    return <Music className="w-4 h-4" />;
  }
};

export default async function Home() {
  // Fetch featured resources (limit to 6 to fill the grid better)
  const featuredResources = await db.resource.findMany({
    orderBy: {
      downloads: 'desc'
    },
    take: 6
  });

  // Transform the resources to match the expected type
  const formattedResources = featuredResources.map(resource => ({
    ...resource,
    type: resource.type || undefined,
    createdAt: resource.createdAt.toISOString()
  }));

  return (
    <div>
      <section className="py-20 text-center bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <h1 className="text-5xl font-bold mb-4">Unlock Exclusive Production Resources</h1>
        <p className="text-xl mb-8">
          Get access to premium tools, samples, and project files by following on social media
        </p>
        <Button size="lg" asChild>
          <Link href="/freebies/resources">Explore Resources</Link>
        </Button>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Resources</h2>
        
        {formattedResources.length > 0 ? (
          <div className="masonry-grid">
            {formattedResources.map((resource) => (
              <div key={resource.id} className="masonry-item">
                <ResourceCard resource={resource as any} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No featured resources available yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/freebies/create-resource">Create Resource</Link>
            </Button>
          </div>
        )}
      </section>
      
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Free Music Production Resources</h2>
            <p className="mb-4">
              MusicGate offers a curated collection of free, high-quality resources for music producers of all levels. 
              From sample packs and VST plugins to project files and presets, we&apos;ve got everything you need to take your 
              productions to the next level.
            </p>
            <p>
              All resources are carefully vetted to ensure they meet our quality standards. Many are exclusive to MusicGate 
              and can&apos;t be found anywhere else.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">For Music Producers</h2>
            <p className="mb-4">
              Whether you&apos;re using Ableton Live, FL Studio, Logic Pro, or any other DAW, our resources are designed to 
              integrate seamlessly into your workflow. We cover all genres including EDM, hip-hop, lo-fi, trap, house, 
              and more.
            </p>
            <p>
              Join thousands of music producers who use MusicGate resources in their productions every day. 
              Create an account to upload your own resources and connect with the community.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}


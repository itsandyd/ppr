import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Download, Music, FileAudio } from "lucide-react"
import type React from "react" // Added import for React

// Force this page to be dynamically rendered
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div>
      <section className="py-20 text-center bg-gradient-to-r from-purple-900 to-blue-900">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResourceCard
            title="Ultimate Mixing Cheat Sheet"
            description="Unlock the secrets to professional-sounding mixes"
            downloads={1234}
            icon={<FileAudio className="w-6 h-6" />}
            href="/freebies/resource/mixing-cheat-sheet"
          />
          <ResourceCard
            title="Lo-Fi Hip Hop Sample Pack"
            description="Get that perfect lo-fi vibe with our curated collection"
            downloads={2345}
            icon={<Music className="w-6 h-6" />}
            href="/freebies/resource/lofi-sample-pack"
          />
          <ResourceCard
            title="EDM Drop Project File"
            description="Dissect and learn from a professionally crafted EDM drop"
            downloads={3456}
            icon={<FileAudio className="w-6 h-6" />}
            href="/freebies/resource/edm-drop-project"
          />
        </div>
      </section>
    </div>
  )
}

function ResourceCard({
  title,
  description,
  downloads,
  icon,
  href,
}: {
  title: string
  description: string
  downloads: number
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <div className="mr-4 p-2 bg-blue-600 rounded-full">{icon}</div>
          <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Download className="w-4 h-4 mr-1" />
          {downloads} downloads
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={href}>Unlock Resource</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


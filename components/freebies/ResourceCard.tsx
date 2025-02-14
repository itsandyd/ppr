import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileAudio } from "lucide-react"

type Resource = {
  id: string
  title: string
  description: string
  type: string
  downloads: number
  imageUrl: string
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden">
      <div className="relative h-48">
        <Image src={resource.imageUrl || "/placeholder.svg"} alt={resource.title} layout="fill" objectFit="cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className="mr-2 p-2 bg-blue-600 rounded-full">
            <FileAudio className="w-4 h-4" />
          </div>
          <span className="text-sm text-gray-400">{resource.type}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
        <div className="flex items-center text-sm text-gray-400">
          <Download className="w-4 h-4 mr-1" />
          {resource.downloads} downloads
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/freebies/resource/${resource.id}`}>Access Resource</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


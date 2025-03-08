import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileArchive, FileAudio, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

type Resource = {
  id: string
  slug: string
  title: string
  description: string
  fileName: string
  fileUrl: string
  requiresLeadGen: boolean
  type?: string
  downloads?: number
  imageUrl?: string
  createdAt?: string
}

export function ResourceCard({ resource }: { resource: Resource }) {
  // Extract file extension from fileName if available
  const fileExtension = resource.fileName ? resource.fileName.split('.').pop()?.toLowerCase() : null;
  
  // Determine resource type based on file extension or use the provided type
  const resourceType = resource.type || (fileExtension === 'zip' ? 'ZIP Archive' : 'Resource')
  
  // Use the provided imageUrl or a placeholder
  const imageUrl = resource.imageUrl || "/placeholder.svg"
  
  // Default downloads to 0 if not provided
  const downloads = resource.downloads || 0

  return (
    <Card className={cn(
      "h-full flex flex-col overflow-hidden",
      "theme-transition"
    )}>
      <div className="relative h-48">
        <Image 
          src={imageUrl} 
          alt={resource.title} 
          fill
          className="object-cover"
        />
        {resource.requiresLeadGen && (
          <div className="absolute top-2 right-2 bg-amber-600 text-white p-1 rounded-md flex items-center text-xs">
            <Lock className="w-3 h-3 mr-1" />
            Gated
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          <div className="mr-2 p-2 bg-primary rounded-full text-primary-foreground">
            <FileArchive className="w-4 h-4" />
          </div>
          <span className="text-sm text-muted-foreground">{resourceType}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{resource.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{resource.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-auto">
          <Download className="w-4 h-4 mr-1" />
          {downloads} downloads
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/freebies/resources/${resource.slug}`}>Access Resource</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


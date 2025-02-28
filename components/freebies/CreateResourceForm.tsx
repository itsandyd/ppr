"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import FollowGateSetup from "@/components/freebies/FollowGateSetup"
import type { Requirement } from "@/components/freebies/FollowGateSetup"
import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { FileArchive, Image } from "lucide-react"
import { UploadFileResponse } from "uploadthing/client"

export default function CreateResourceForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [resourceData, setResourceData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileName: "",
    imageUrl: "",
    imageName: "",
  })
  const [followGateRequirements, setFollowGateRequirements] = useState<Requirement[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResourceData((prev) => ({ ...prev, [name]: value }))
  }

  const validateFileType = useCallback((file: File): boolean => {
    const validZipTypes = [
      'application/zip', 
      'application/x-zip-compressed', 
      'application/octet-stream'
    ];
    
    // Check if the file has a .zip extension
    const hasZipExtension = file.name.toLowerCase().endsWith('.zip');
    
    // Check if file MIME type is a valid zip type
    const isValidMimeType = validZipTypes.includes(file.type);
    
    if (!hasZipExtension || !isValidMimeType) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a ZIP file (.zip).",
      });
      return false;
    }
    
    return true;
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resourceData.fileUrl) {
      toast({
        variant: "destructive",
        title: "File Required",
        description: "Please upload a resource file before submitting.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Check if Lead Gen requirement exists
      const requiresLeadGen = followGateRequirements.some(req => req.platform === "leadgen")
      
      // Log the data being sent to verify it's correct
      console.log("Submitting data:", {
        ...resourceData,
        followGateRequirements,
        requiresLeadGen
      })
      
      const formData = {
        ...resourceData,
        followGateRequirements,
        requiresLeadGen,
      }
      
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create resource")
      }
      
      toast({
        title: "Resource Created Successfully",
        description: `Your resource "${resourceData.title}" has been created and is now available.`,
      })
      
      // Redirect to resource listing page after a short delay
      setTimeout(() => {
        router.push('/freebies/resources')
        router.refresh() // Force a refresh to ensure the new resource appears
      }, 1500)
    } catch (error) {
      console.error("Error creating resource:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem creating your resource.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debug the requirements state to help diagnose issues
  useEffect(() => {
    console.log("Current requirements:", followGateRequirements)
    console.log("Requires lead gen:", followGateRequirements.some(req => req.platform === "leadgen"))
  }, [followGateRequirements])

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="title">Resource Title</Label>
            <Input
              id="title"
              name="title"
              value={resourceData.title}
              onChange={handleInputChange}
              placeholder="Enter resource title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={resourceData.description}
              onChange={handleInputChange}
              placeholder="Describe your resource"
              required
            />
          </div>
          <div>
            <Label>Resource Image</Label>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <Image className="h-4 w-4" />
              <p className="text-sm text-gray-400">
                Upload an image for your resource (max 4MB)
              </p>
            </div>
            {resourceData.imageUrl ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 break-all">
                  ✅ Uploaded: {resourceData.imageName}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setResourceData(prev => ({ ...prev, imageUrl: "", imageName: "" }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                config={{ mode: "auto" }}
                content={{
                  allowedContent: "Image files up to 4MB",
                }}
                onUploadBegin={() => {
                  setIsImageUploading(true)
                }}
                onClientUploadComplete={(res) => {
                  setIsImageUploading(false)
                  if (res?.[0]) {
                    setResourceData(prev => ({
                      ...prev,
                      imageUrl: res[0].url,
                      imageName: res[0].name
                    }))
                    toast({
                      title: "Image Upload Successful",
                      description: "Your image has been uploaded successfully.",
                    })
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsImageUploading(false)
                  toast({
                    variant: "destructive",
                    title: "Image Upload Failed",
                    description: error.message || "Make sure you're uploading a valid image under 4MB.",
                  })
                }}
                className="bg-white ut-label:text-gray-800 ut-allowed-content:text-gray-800"
              />
            )}
          </div>
          <div>
            <Label>Upload Resource File</Label>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <FileArchive className="h-4 w-4" />
              <p className="text-sm text-gray-400">
                Upload .zip files only (max 100MB)
              </p>
            </div>
            {resourceData.fileUrl ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 break-all">
                  ✅ Uploaded: {resourceData.fileName}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setResourceData(prev => ({ ...prev, fileUrl: "", fileName: "" }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="storageUpload"
                config={{ mode: "auto" }}
                content={{
                  allowedContent: "ZIP files up to 100MB",
                }}
                onUploadBegin={() => {
                  setIsUploading(true)
                }}
                onClientUploadComplete={(res) => {
                  setIsUploading(false)
                  if (res?.[0]) {
                    // Double-check that it's a ZIP file by checking the extension
                    if (!res[0].name.toLowerCase().endsWith('.zip')) {
                      toast({
                        variant: "destructive",
                        title: "Invalid File Type",
                        description: "Only ZIP files are allowed.",
                      });
                      return;
                    }
                    
                    setResourceData(prev => ({
                      ...prev,
                      fileUrl: res[0].url,
                      fileName: res[0].name
                    }))
                    toast({
                      title: "Upload Successful",
                      description: "Your zip file has been uploaded successfully.",
                    })
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false)
                  toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: error.message || "Make sure you're uploading a valid zip file under 100MB.",
                  })
                }}
                className="bg-white ut-label:text-gray-800 ut-allowed-content:text-gray-800"
              />
            )}
          </div>
          <div>
            <Label>Access Requirements</Label>
            <p className="text-sm text-gray-400 mb-2">
              Set up requirements for users to access this resource. If you select Lead Gen, 
              users will need to provide their email address.
            </p>
            <FollowGateSetup requirements={followGateRequirements} setRequirements={setFollowGateRequirements} />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isUploading || isImageUploading || isSubmitting}
          >
            {isSubmitting ? "Creating Resource..." : "Create Resource"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}


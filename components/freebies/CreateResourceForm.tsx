"use client"

import { useState } from "react"
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

export default function CreateResourceForm() {
  const { toast } = useToast()
  const [resourceData, setResourceData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileName: "",
  })
  const [followGateRequirements, setFollowGateRequirements] = useState<Requirement[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResourceData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resourceData.fileUrl) {
      toast({
        variant: "destructive",
        title: "File Required",
        description: "Please upload a resource file before submitting.",
      })
      return
    }
    // Here you would typically send the data to your backend
    console.log("Resource Data:", resourceData)
    console.log("Follow Gate Requirements:", followGateRequirements)
    // Reset form or redirect user after successful submission
  }

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
            <Label>Upload Resource File</Label>
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
                onUploadBegin={() => {
                  setIsUploading(true)
                }}
                onClientUploadComplete={(res) => {
                  setIsUploading(false)
                  if (res?.[0]) {
                    setResourceData(prev => ({
                      ...prev,
                      fileUrl: res[0].url,
                      fileName: res[0].name
                    }))
                    toast({
                      title: "Upload Successful",
                      description: "Your file has been uploaded successfully.",
                    })
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false)
                  toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: error.message,
                  })
                }}
                className="bg-white ut-label:text-gray-800 ut-allowed-content:text-gray-800"
              />
            )}
          </div>
          <FollowGateSetup requirements={followGateRequirements} setRequirements={setFollowGateRequirements} />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Create Resource"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}


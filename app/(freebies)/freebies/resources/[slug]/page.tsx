"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Instagram, Twitter, Facebook, Download, FileAudio } from "lucide-react"

const socialPlatforms = [
  { name: "Instagram", icon: Instagram, color: "bg-pink-600 hover:bg-pink-700" },
  { name: "Twitter", icon: Twitter, color: "bg-blue-400 hover:bg-blue-500" },
  { name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
]

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = () => {
    setIsDialogOpen(true)
  }

  const handleFollow = () => {
    // In a real application, this would verify the follow action
    console.log(`Verifying follow on ${socialPlatforms[currentStep].name}...`)

    if (currentStep < socialPlatforms.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsUnlocked(true)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center mb-6">
            <div className="mr-4 p-3 bg-blue-600 rounded-full">
              <FileAudio className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ultimate Mixing Cheat Sheet</h1>
              <p className="text-gray-400">Cheat Sheet</p>
            </div>
          </div>
          <p className="mb-6">
            Unlock the secrets to professional-sounding mixes with our comprehensive cheat sheet. This resource covers
            everything from EQ techniques to compression settings for various instruments.
          </p>

          <Button onClick={handleUnlock} className="flex items-center">
            <Download className="mr-2" />
            Download Resource
          </Button>
        </CardContent>
        <CardFooter className="bg-gray-800 mt-6">
          <div className="flex items-center text-sm text-gray-400">
            <Download className="w-4 h-4 mr-1" />
            1,234 downloads
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Follow to Unlock</DialogTitle>
            <DialogDescription>
              Follow us on social media to unlock this resource.
              {currentStep + 1} of {socialPlatforms.length} steps completed.
            </DialogDescription>
          </DialogHeader>

          {!isUnlocked ? (
            <>
              <div className="py-4">
                <p className="mb-4">Please follow us on {socialPlatforms[currentStep].name} to continue:</p>
                <Button onClick={handleFollow} className={`flex items-center ${socialPlatforms[currentStep].color}`}>
                  {(() => {
                    const Icon = socialPlatforms[currentStep].icon
                    return <Icon className="mr-2" />
                  })()}
                  Follow on {socialPlatforms[currentStep].name}
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-4">
                <p className="text-green-400 font-semibold mb-4">
                  All steps completed! You can now download the resource.
                </p>
                <Button className="flex items-center">
                  <Download className="mr-2" />
                  Download Cheat Sheet
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


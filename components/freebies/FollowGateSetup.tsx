import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Instagram, Twitter, Facebook, Youtube, Twitch, Music, X, Mail } from "lucide-react"
import { SiSoundcloud, SiSpotify } from "react-icons/si"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

export type Requirement = {
  platform: string
  accountUrl?: string
  username?: string
  action?: string
}

type FollowGateSetupProps = {
  value: Requirement[]
  onChange: (requirements: Requirement[]) => void
  isPreview?: boolean
}

export default function FollowGateSetup({ value, onChange, isPreview = false }: FollowGateSetupProps) {
  const [requirements, setRequirements] = useState<Requirement[]>(value || [])
  const [newRequirement, setNewRequirement] = useState<{
    platform: string
    accountUrl: string
    username: string
    action: string
  }>({
    platform: "",
    accountUrl: "",
    username: "",
    action: "follow"
  })

  // const platformOptions = [
  //   { 
  //     value: "instagram", 
  //     label: "Instagram", 
  //     icon: (props: any) => <Instagram {...props} />,
  //     actions: ["follow", "like"]
  //   },
  //   { 
  //     value: "twitter", 
  //     label: "Twitter",
  //     icon: (props: any) => <Twitter {...props} />,
  //     actions: ["follow", "like"]
  //   },
  //   { 
  //     value: "facebook", 
  //     label: "Facebook",
  //     icon: (props: any) => <Facebook {...props} />,
  //     actions: ["follow", "like"]
  //   },
  //   { 
  //     value: "youtube", 
  //     label: "YouTube",
  //     icon: (props: any) => <Youtube {...props} />,
  //     actions: ["subscribe"]
  //   },
  //   { 
  //     value: "twitch", 
  //     label: "Twitch",
  //     icon: (props: any) => <Twitch {...props} />,
  //     actions: ["follow", "subscribe"]
  //   },
  //   { 
  //     value: "soundcloud", 
  //     label: "SoundCloud",
  //     icon: (props: any) => <SiSoundcloud {...props} />,
  //     actions: ["follow", "like"]
  //   },
  //   { 
  //     value: "spotify", 
  //     label: "Spotify",
  //     icon: (props: any) => <SiSpotify {...props} />,
  //     actions: ["follow"]
  //   },
  //   { 
  //     value: "leadgen", 
  //     label: "Email Capture",
  //     icon: (props: any) => <Mail {...props} />,
  //     actions: []
  //   }
  // ]

  // // Helper to find the platform config by value
  // const getPlatformConfig = (platformValue: string) => {
  //   return platformOptions.find(p => p.value === platformValue)
  // }

  // const handlePlatformChange = (platform: string) => {
  //   const platformConfig = getPlatformConfig(platform)
  //   setNewRequirement({
  //     ...newRequirement,
  //     platform,
  //     action: platformConfig?.actions?.[0] || "follow"
  //   })
  // }

  // const handleActionChange = (action: string) => {
  //   setNewRequirement({
  //     ...newRequirement,
  //     action
  //   })
  // }

  // const handleAddRequirement = () => {
  //   if (newRequirement.platform && 
  //       ((newRequirement.platform === "leadgen") || 
  //        (newRequirement.username && newRequirement.action))) {
  //     const updatedRequirements = [...requirements, newRequirement]
  //     setRequirements(updatedRequirements)
  //     onChange(updatedRequirements)

  //     // Reset new requirement form completely
  //     setNewRequirement({
  //       platform: "", // Reset platform so the user can select a different one
  //       accountUrl: "",
  //       username: "",
  //       action: "follow" // Default action for the next requirement
  //     })
  //   }
  // }

  // const handleRemoveRequirement = (index: number) => {
  //   const updatedRequirements = requirements.filter((_, i) => i !== index)
  //   setRequirements(updatedRequirements)
  //   onChange(updatedRequirements)
  // }

  // const hasEmailRequirement = requirements.some(req => req.platform === "leadgen")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Follow Gate Requirements</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Users will need to authenticate with these platforms
                and complete the specified actions before accessing your resource.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        {/* Email capture is always required */}
        {/* {!hasEmailRequirement && (
          <div className="p-3 border rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <div>
                <p>Email Capture</p>
                <p className="text-sm text-gray-400">Always required</p>
              </div>
            </div>
            <Badge variant="outline">Required</Badge>
          </div>
        )} */}
        
        {/* Display existing requirements */}
        {requirements.map((req, index) => {
          // const platform = getPlatformConfig(req.platform)
          // const IconComponent = platform?.icon || ((props: any) => <X {...props} />)
          
          if (req.platform === "leadgen") {
            return (
              <div key={index} className="p-3 border rounded-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* <IconComponent className="h-5 w-5" /> */}
                  <div>
                    <p>Email Capture</p>
                    <p className="text-sm text-gray-400">Always required</p>
                  </div>
                </div>
                {/* <Button 
                  variant="destructive" 
                  size="sm" 
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                >
                  Remove
                </Button> */}
              </div>
            )
          }
          
          return (
            <div key={index} className="p-3 border rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <IconComponent className="h-5 w-5" />
                <div>
                  <p>{platform?.label || req.platform}</p>
                  <p className="text-sm text-gray-400">
                    {req.action === "follow" && (platform?.label === "YouTube" ? "Subscribe to" : "Follow")} 
                    {req.action === "like" && "Like"} 
                    {req.action === "subscribe" && "Subscribe to"} {req.username}
                  </p>
                </div> */}
              </div>
              {/* <Button 
                variant="destructive" 
                size="sm" 
                type="button"
                onClick={() => handleRemoveRequirement(index)}
              >
                Remove
              </Button> */}
            </div>
          )
        })}
      </div>
      
      {/* Add new requirement form */}
      <div className="grid gap-4 p-4 border rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            {/* <Select
              value={newRequirement.platform}
              onValueChange={handlePlatformChange}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      {platform.icon({ className: "h-4 w-4" })}
                      <span>{platform.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
          
          {newRequirement.platform && newRequirement.platform !== "leadgen" && (
            <div>
              <Label htmlFor="action">Required Action</Label>
              <Select
                value={newRequirement.action}
                // onValueChange={handleActionChange}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {/* {getPlatformConfig(newRequirement.platform)?.actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action === "follow" && (newRequirement.platform === "youtube" ? "Subscribe to" : "Follow")}
                      {action === "like" && "Like"}
                      {action === "subscribe" && "Subscribe to"}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {newRequirement.platform && newRequirement.platform !== "leadgen" && (
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={newRequirement.username}
              onChange={(e) => setNewRequirement({...newRequirement, username: e.target.value})}
              placeholder="Enter your username (e.g. johndoe)"
            />
          </div>
        )}
        
        {/* <Button 
          type="button" 
          onClick={handleAddRequirement}
          disabled={
            !newRequirement.platform || 
            (newRequirement.platform !== "leadgen" && (!newRequirement.username || !newRequirement.action))
          }
        >
          Add
        </Button> */}
      </div>
    </div>
  )
}


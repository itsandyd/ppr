import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Instagram, Twitter, Facebook, Youtube, Twitch, Mail } from "lucide-react"
import { SiSoundcloud } from "react-icons/si"

export type Requirement = {
  platform: string
  accountUrl: string
}

type FollowGateSetupProps = {
  requirements: Requirement[]
  setRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>
}

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "twitch", label: "Twitch", icon: Twitch },
  { value: "soundcloud", label: "Soundcloud", icon: (props: any) => <SiSoundcloud {...props} /> },
  { value: "leadgen", label: "Lead Gen", icon: Mail },
]

export default function FollowGateSetup({ requirements, setRequirements }: FollowGateSetupProps) {
  const [newRequirement, setNewRequirement] = useState<Requirement>({ platform: "", accountUrl: "" })

  const handleAddRequirement = () => {
    if (newRequirement.platform === "leadgen") {
      setRequirements([...requirements, { platform: "leadgen", accountUrl: "lead-gen" }])
      setNewRequirement({ platform: "", accountUrl: "" })
    } else if (newRequirement.platform && newRequirement.accountUrl) {
      setRequirements([...requirements, newRequirement])
      setNewRequirement({ platform: "", accountUrl: "" })
    }
  }

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const IconComponent = ({ platform, className }: { platform: string, className?: string }) => {
    const option = platformOptions.find((p) => p.value === platform)
    if (!option) return null
    const Icon = option.icon
    return <Icon className={className} />
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Follow Gate Requirements</h3>
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center space-x-2">
          <IconComponent platform={req.platform} className="w-5 h-5" />
          <span>
            {req.platform === "leadgen" 
              ? "Lead Gen: User info required"
              : `${req.platform}: ${req.accountUrl}`}
          </span>
          <Button variant="destructive" size="sm" onClick={() => handleRemoveRequirement(index)}>
            Remove
          </Button>
        </div>
      ))}
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Label htmlFor="platform">Platform</Label>
          <Select
            value={newRequirement.platform}
            onValueChange={(value) => setNewRequirement({ ...newRequirement, platform: value, accountUrl: "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <option.icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {newRequirement.platform && newRequirement.platform !== "leadgen" && (
          <div className="flex-1">
            <Label htmlFor="accountUrl">Account URL</Label>
            <Input
              id="accountUrl"
              value={newRequirement.accountUrl}
              onChange={(e) => setNewRequirement({ ...newRequirement, accountUrl: e.target.value })}
              placeholder="Enter account URL"
            />
          </div>
        )}
        <Button onClick={handleAddRequirement}>Add</Button>
      </div>
    </div>
  )
}


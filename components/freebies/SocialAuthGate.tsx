import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, Twitter, Facebook, Youtube, Twitch, Check, Lock, ExternalLink } from "lucide-react"
import { SiSoundcloud, SiSpotify } from "react-icons/si"
import { Requirement } from "./FollowGateSetup"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

interface SocialAuthGateProps {
  requirements: Requirement[]
  onComplete: () => void
  resourceTitle: string
}

export default function SocialAuthGate({ requirements, onComplete, resourceTitle }: SocialAuthGateProps) {
  const { toast } = useToast()
  const [completedRequirements, setCompletedRequirements] = useState<string[]>([])
  const [authenticating, setAuthenticating] = useState<string | null>(null)
  
  const iconMap: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    youtube: Youtube,
    twitch: Twitch,
    soundcloud: SiSoundcloud,
    spotify: SiSpotify
  }
  
  // Format action text
  const getActionText = (platform: string, action?: string) => {
    if (!action) return "follow";
    
    switch (action) {
      case "follow":
        return platform === "youtube" ? "Subscribe to" : "Follow";
      case "like":
        return "Like";
      case "subscribe":
        return "Subscribe to";
      default:
        return "Follow";
    }
  }
  
  // Initiate real OAuth flow with the selected platform
  const handleAuthenticate = async (platform: string) => {
    setAuthenticating(platform)
    
    try {
      toast({
        title: "Authentication In Progress",
        description: `Connecting to ${platform}...`,
      })
      
      // Find the requirement for this platform
      const requirement = requirements.find(req => req.platform === platform)
      
      if (!requirement) {
        throw new Error("Platform requirement not found")
      }
      
      // Get the resource ID from the URL (in a real implementation, this would be passed as a prop)
      const urlParts = window.location.pathname.split('/')
      const resourceId = urlParts[urlParts.length - 1]
      
      // Build the authentication URL to the real OAuth endpoint
      const state = btoa(JSON.stringify({
        resourceId,
        platform,
        action: requirement.action || "follow",
        username: requirement.username || requirement.accountUrl || ""
      }))
      
      // Create platform-specific OAuth URLs
      let authUrl = "";
      
      switch (platform) {
        case "instagram":
          // Instagram Graph API OAuth URL (using Facebook Login)
          authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/instagram`)}&scope=user_profile,user_media&response_type=code&state=${state}`;
          break;
        
        case "facebook":
          // Facebook OAuth URL
          authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/facebook`)}&state=${state}&scope=email,public_profile`;
          break;
          
        case "twitter":
          // Twitter OAuth URL
          authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/twitter`)}&scope=tweet.read%20users.read%20follows.read&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
          break;
          
        case "youtube":
          // YouTube/Google OAuth URL
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/google`)}&scope=https://www.googleapis.com/auth/youtube.readonly&response_type=code&state=${state}`;
          break;
          
        case "spotify":
          // Spotify OAuth URL
          authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/spotify`)}&state=${state}&scope=user-follow-read`;
          break;
        
        case "twitch":
          // Twitch OAuth URL
          authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/twitch`)}&response_type=code&scope=user:read:follows&state=${state}`;
          break;
          
        case "soundcloud":
          // SoundCloud OAuth URL
          authUrl = `https://soundcloud.com/connect?client_id=${process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/soundcloud`)}&response_type=code&state=${state}`;
          break;
          
        default:
          throw new Error(`OAuth not configured for platform: ${platform}`);
      }
      
      // Open the authentication window as a popup
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const authWindow = window.open(
        authUrl, 
        `${platform}Auth`, 
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!authWindow) {
        throw new Error("Popup was blocked. Please allow popups for this site.");
      }
      
      // Set up a timer to check if the auth window has been closed without completing auth
      const popupCheckInterval = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(popupCheckInterval);
          setAuthenticating(null);
          
          // Check if the requirement was completed
          const cookieName = `social_auth_${platform}_${resourceId}`;
          if (!document.cookie.includes(cookieName)) {
            toast({
              variant: "destructive",
              title: "Authentication Cancelled",
              description: "You closed the authentication window before completing the process."
            });
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: `Could not connect to ${platform}. Please try again.`,
      });
      setAuthenticating(null);
    }
  }
  
  // Check URL for any auth success/error messages when component mounts
  useEffect(() => {
    const url = new URL(window.location.href)
    const authSuccess = url.searchParams.get("auth_success")
    const authError = url.searchParams.get("auth_error")
    
    // If we have an auth success parameter, mark that requirement as completed
    if (authSuccess) {
      setCompletedRequirements(prev => {
        if (!prev.includes(authSuccess)) {
          toast({
            title: "Authentication Successful",
            description: `Connected to ${authSuccess} successfully!`,
          })
          return [...prev, authSuccess]
        }
        return prev
      })
      
      // Clean up the URL
      url.searchParams.delete("auth_success")
      window.history.replaceState({}, document.title, url.toString())
    }
    
    // If we have an auth error parameter, show an error toast
    if (authError) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: `Could not verify your ${authError} action. Please try again.`,
      })
      
      // Clean up the URL
      url.searchParams.delete("auth_error")
      window.history.replaceState({}, document.title, url.toString())
    }
    
    // Check for existing auth cookies and mark requirements as completed
    const urlParts = window.location.pathname.split('/')
    const resourceId = urlParts[urlParts.length - 1]
    
    requirements
      .filter(req => req.platform !== "leadgen")
      .forEach(req => {
        const cookieName = `social_auth_${req.platform}_${resourceId}`
        if (document.cookie.includes(cookieName)) {
          setCompletedRequirements(prev => {
            if (!prev.includes(req.platform)) {
              return [...prev, req.platform]
            }
            return prev
          })
        }
      })
  }, [requirements, toast])
  
  // Check if all requirements are completed
  const allRequirementsCompleted = requirements
    .filter(req => req.platform !== "leadgen")
    .every(req => completedRequirements.includes(req.platform))
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Access &ldquo;{resourceTitle}&rdquo;</CardTitle>
        <CardDescription>
          Complete the following requirements to access this resource:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements
          .filter(req => req.platform !== "leadgen")
          .map((req, index) => {
            const IconComponent = iconMap[req.platform] || ExternalLink;
            const isCompleted = completedRequirements.includes(req.platform);
            const actionText = getActionText(req.platform, req.action);
            const username = req.username || req.accountUrl;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {actionText} on {req.platform}
                    </p>
                    <p className="text-sm text-gray-400">
                      {username}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isCompleted ? "outline" : "default"}
                  onClick={() => handleAuthenticate(req.platform)}
                  disabled={isCompleted || authenticating !== null}
                >
                  {isCompleted ? "Done" : "Connect"}
                </Button>
              </div>
            )
          })}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!allRequirementsCompleted} 
          onClick={onComplete}
        >
          {allRequirementsCompleted ? (
            "Access Resource"
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Complete requirements first</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 
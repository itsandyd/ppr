import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Youtube, Twitch, Check, Lock, ExternalLink, RefreshCcw } from "lucide-react";
import { SiSoundcloud, SiSpotify } from "react-icons/si";
import { useToast } from "@/components/ui/use-toast";
import { Requirement } from "./FollowGateSetup";
import { useUser } from "@clerk/nextjs";

interface ClerkSocialAuthGateProps {
  requirements: Requirement[];
  onComplete: () => void;
  resourceTitle: string;
  resourceId: string;
}

export default function ClerkSocialAuthGate({
  requirements,
  onComplete,
  resourceTitle,
  resourceId
}: ClerkSocialAuthGateProps) {
  const { toast } = useToast();
  const { user, isSignedIn, isLoaded } = useUser();
  const [completedRequirements, setCompletedRequirements] = useState<string[]>([]);
  const [authenticating, setAuthenticating] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  // Map of social platforms to their Clerk provider names
  const providerMap: Record<string, string> = {
    instagram: "oauth_facebook", // Instagram uses Facebook OAuth since Facebook owns Instagram
    twitter: "oauth_twitter",
    facebook: "oauth_facebook",
    youtube: "oauth_google", // YouTube uses Google OAuth
    spotify: "oauth_spotify",
    twitch: "oauth_twitch",
    soundcloud: "oauth_soundcloud",
  };

  // Map of platform names to icon components
  const iconMap: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    youtube: Youtube,
    twitch: Twitch,
    soundcloud: SiSoundcloud,
    spotify: SiSpotify,
  };

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
  };

  // Get action button text
  const getActionButtonText = (platform: string, action?: string) => {
    if (!action) return "Follow";

    switch (action) {
      case "follow":
        return platform === "youtube" ? "Subscribe on YouTube" : `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      case "like":
        return `Like on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      case "subscribe":
        return `Subscribe on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      default:
        return `Complete action on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    }
  };

  // ToneDen-style social action popup
  const openSocialActionPopup = (platform: string, username: string, action: string) => {
    if (!username) return;
    
    // Clean the username (remove @ if present)
    const cleanUsername = username.replace('@', '');
    
    // Generate the appropriate URL based on platform and action
    let socialUrl = '';
    let popupTitle = '';
    let actionVerb = '';
    
    switch (platform) {
      // case 'instagram':
      //   socialUrl = `https://www.instagram.com/${cleanUsername}/`;
      //   popupTitle = `Follow ${username} on Instagram`;
      //   actionVerb = 'follow';
      //   break;
      // case 'twitter':
      //   socialUrl = `https://twitter.com/${cleanUsername}`;
      //   popupTitle = `Follow ${username} on Twitter`;
      //   actionVerb = 'follow';
      //   break;
      // case 'youtube':
      //   socialUrl = `https://www.youtube.com/${cleanUsername}?sub_confirmation=1`;
      //   popupTitle = `Subscribe to ${username} on YouTube`;
      //   actionVerb = 'subscribe to';
      //   break;
      // case 'facebook':
      //   socialUrl = `https://www.facebook.com/${cleanUsername}`;
      //   popupTitle = `Follow ${username} on Facebook`;
      //   actionVerb = 'follow';
      //   break;
      // case 'twitch':
      //   socialUrl = `https://www.twitch.tv/${cleanUsername}`;
      //   popupTitle = `Follow ${username} on Twitch`;
      //   actionVerb = 'follow';
      //   break;
      // case 'soundcloud':
      //   socialUrl = `https://soundcloud.com/${cleanUsername}`;
      //   popupTitle = `Follow ${username} on SoundCloud`;
      //   actionVerb = 'follow';
      //   break;
      // case 'spotify':
      //   socialUrl = `https://open.spotify.com/artist/${cleanUsername}`;
      //   popupTitle = `Follow ${username} on Spotify`;
      //   actionVerb = 'follow';
      //   break;
      // default:
      //   socialUrl = `https://${platform}.com/${cleanUsername}`;
      //   popupTitle = `Complete action on ${platform}`;
      //   actionVerb = 'connect with';
    }
    
    console.log(`Opening ${platform} ${action} popup for: ${socialUrl}`);
    
    // Open in a popup window
    const width = 720;
    const height = 720;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const popup = window.open(
      socialUrl,
      `${platform}_action_popup`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );
    
    if (!popup) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for this site and try again.",
        variant: "destructive",
      });
      setAuthenticating(null);
      return;
    }
    
    toast({
      title: popupTitle,
      description: `Please ${action === 'follow' ? 
        (platform === 'youtube' ? 'subscribe to' : 'follow') : 
        action} ${username} to complete this requirement.`,
    });

    // Set up a check to see when popup is closed
    const checkPopupInterval = setInterval(() => {
      try {
        // This will throw an error if the popup is closed
        if (popup.closed) {
          clearInterval(checkPopupInterval);
          
          // Use setTimeout to give a brief pause before showing the confirmation dialog
          setTimeout(() => {
            // Auto-verify in ToneDen-style (since we can't actually verify the follow action)
            // This simulates ToneDen's behavior where it assumes you've completed the action
            toast({
              title: "Verifying action...",
              description: `Processing your ${actionVerb} action for ${username}`,
            });
            
            // Find the requirement and verify the action
            const requirement = requirements.find(req => req.platform === platform);
            if (requirement) {
              verifyAction(platform, requirement.action || 'follow', requirement.username || '', true);
            }
          }, 800);
        }
      } catch (e) {
        // If we get an error, the popup is likely closed
        clearInterval(checkPopupInterval);
        
        // Handle similarly to the closed case
        setTimeout(() => {
          toast({
            title: "Verifying action...",
            description: `Processing your ${actionVerb} action for ${username}`,
          });
          
          const requirement = requirements.find(req => req.platform === platform);
          if (requirement) {
            verifyAction(platform, requirement.action || 'follow', requirement.username || '', true);
          }
        }, 800);
      }
    }, 1000);
  };

  // Simplified action handler (ToneDen-style)
  const handleSocialAction = (platform: string) => {
    const requirement = requirements.find(req => req.platform === platform);
    
    if (!requirement) {
      toast({
        title: "Error",
        description: "Platform requirement not found",
        variant: "destructive",
      });
      return;
    }

    setAuthenticating(platform);
    
    try {
      // Open the social platform popup directly
      if (requirement.action && requirement.username) {
        openSocialActionPopup(platform, requirement.username, requirement.action);
      } else {
        toast({
          title: "Error",
          description: "Missing action or username for requirement",
          variant: "destructive",
        });
        setAuthenticating(null);
      }
    } catch (error) {
      console.error("Error handling social action:", error);
      toast({
        title: "Error",
        description: "Failed to open social platform",
        variant: "destructive",
      });
      setAuthenticating(null);
    }
  };

  // Verify the social action (follow, like, etc.)
  const verifyAction = async (platform: string, action: string, username: string, skipOAuthCheck = true) => {
    try {
      console.log(`Verifying action for ${platform}, skipOAuthCheck: ${skipOAuthCheck}`);
      // Call the API to verify the action
      const response = await fetch("/api/verify-social-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          action,
          username,
          resourceId,
          skipOAuthCheck, // For ToneDen-style, we always skip OAuth check
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Verified your ${action} on ${platform}`,
        });
        
        // Mark this requirement as completed
        setCompletedRequirements(prev => {
          if (!prev.includes(platform)) {
            const newCompleted = [...prev, platform];
            console.log("Updated completed platforms:", newCompleted);
            
            // If all requirements are completed, call onComplete
            const allCompleted = requirements
              .filter(req => req.platform !== "leadgen")
              .every(req => newCompleted.includes(req.platform));
              
            if (allCompleted) {
              setTimeout(() => onComplete(), 1000);
            }
            
            return newCompleted;
          }
          return prev;
        });
      } else {
        toast({
          title: "Verification Failed",
          description: data.error || `Could not verify your ${action} on ${platform}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Error",
        description: `An error occurred while verifying your ${action} on ${platform}`,
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  // Check for completed requirements when the component mounts
  useEffect(() => {
    const checkCompletedRequirements = async () => {
      try {
        console.log(`Checking completed requirements for resource: ${resourceId}`);
        const response = await fetch(`/api/verify-social-action?resourceId=${resourceId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Completed platforms:', data.completedPlatforms);
          setCompletedRequirements(data.completedPlatforms || []);
        } else {
          console.error('Error response from verification endpoint:', await response.text());
        }
      } catch (error) {
        console.error("Error fetching completed requirements:", error);
      }
    };
    
    checkCompletedRequirements();
    
    // Set up interval to periodically check for updates
    const interval = setInterval(checkCompletedRequirements, 5000);
    return () => clearInterval(interval);
  }, [resourceId]);

  // Force load after timeout
  useEffect(() => {
    console.log("Auth loading state:", { isLoaded, isSignedIn });
    if (!isLoaded) {
      // If loading takes more than 5 seconds, show timeout message
      const timer = setTimeout(() => {
        console.log("Authentication loading timed out");
        setLoadingTimeout(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  // Check if all requirements are completed
  const allRequirementsCompleted = requirements
    .filter(req => req.platform !== "leadgen")
    .every(req => completedRequirements.includes(req.platform));

  if (loadingTimeout) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Loading Issue</CardTitle>
          <CardDescription>
            Loading is taking longer than expected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">There seems to be an issue with loading. You can try these options:</p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => {
                // Force refresh
                setForceRefresh(!forceRefresh);
                setLoadingTimeout(false);
              }}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            const actionButtonText = getActionButtonText(req.platform, req.action);
            const username = req.username || req.accountUrl;
            
            return (
              <div key={index} className="flex flex-col p-3 border rounded-md">
                <div className="flex items-center justify-between">
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
                  <div>
                    <Button
                      size="sm"
                      variant={isCompleted ? "outline" : "default"}
                      onClick={() => isCompleted ? null : handleSocialAction(req.platform)}
                      disabled={isCompleted || authenticating !== null}
                      className="flex items-center gap-1"
                    >
                      {isCompleted ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {actionButtonText}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
          <h3 className="text-sm font-medium text-yellow-500 mb-2">Having trouble?</h3>
          <p className="text-xs text-gray-400 mb-2">
            If your action isn&apos;t being detected, try:
          </p>
          <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
            <li>Make sure you&apos;re logged into the platform</li>
            <li>Complete the action and close the popup</li>
            <li>If still having issues, use the manual verification option below</li>
          </ul>
          <div className="mt-3">
            <details className="text-xs">
              <summary className="cursor-pointer font-medium text-gray-400">Manual verification options</summary>
              <div className="mt-2 space-y-2">
                {requirements
                  .filter(req => req.platform !== "leadgen")
                  .filter(req => !completedRequirements.includes(req.platform))
                  .map((req, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      onClick={() => verifyAction(req.platform, req.action || "follow", req.username || "", true)}
                      disabled={authenticating !== null}
                      className="flex items-center gap-1 w-full justify-start text-xs"
                    >
                      <Check className="h-3 w-3" />
                      Manually verify {req.platform} {req.action || "follow"}
                    </Button>
                  ))}
              </div>
            </details>
          </div>
        </div>
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
  );
} 
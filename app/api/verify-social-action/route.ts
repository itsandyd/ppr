import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

// Map of platform names to Clerk provider names
const providerMap: Record<string, string> = {
  instagram: "oauth_facebook", // Instagram uses Facebook OAuth since Facebook owns Instagram
  twitter: "oauth_twitter",
  facebook: "oauth_facebook",
  youtube: "oauth_google", // YouTube uses Google OAuth
  spotify: "oauth_spotify",
  twitch: "oauth_twitch",
  soundcloud: "oauth_soundcloud",
};

/**
 * Verifies a social action (follow, like, etc.) on a platform
 */
export async function POST(request: NextRequest) {
  try {
    // Get data from request body
    const body = await request.json();
    const { platform, action, username, resourceId, skipOAuthCheck } = body;
    
    console.log("POST verify-social-action:", { platform, action, username, resourceId, skipOAuthCheck });
    
    if (!platform || !action || !username || !resourceId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Find the corresponding Clerk provider
    const clerkProvider = providerMap[platform];
    
    if (!clerkProvider) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }
    
    // Get the current user from Clerk
    let user = null;
    let socialAccount = null;
    
    // Only check user authentication if we're not skipping OAuth check
    if (!skipOAuthCheck) {
      try {
        user = await currentUser();
      } catch (authError) {
        console.error("Error authenticating user:", authError);
        return NextResponse.json(
          { error: "Authentication error", message: "Could not verify user identity" },
          { status: 401 }
        );
      }
      
      if (!user) {
        return NextResponse.json(
          { error: "User not authenticated" },
          { status: 401 }
        );
      }
      
      // Get the OAuth token for this provider
      socialAccount = user.externalAccounts.find(
        account => account.provider === clerkProvider
      );
      
      if (!socialAccount) {
        return NextResponse.json(
          { error: `Your ${platform} account is not connected` },
          { status: 400 }
        );
      }
    }
    
    let actionVerified = false;
    let errorMsg = "";
    
    // Platform-specific verification logic
    if (!skipOAuthCheck) {
      try {
        switch (platform) {
          case "instagram":
            if (action === "follow") {
              console.log("Verifying Instagram follow for:", username);
              // For Instagram, we would use the Facebook Graph API to check
              // In this implementation, we're just verifying they've connected their account
              // In production, implement proper API verification
              actionVerified = true;
            }
            break;
            
          case "youtube":
            if (action === "follow" || action === "subscribe") {
              console.log("Verifying YouTube subscription for:", username);
              // In production, use the YouTube API to verify subscription
              // YouTube API requires OAuth scope: https://www.googleapis.com/auth/youtube
              actionVerified = true;
              console.log("YouTube subscription auto-verified (simulated)");
            }
            break;
            
          case "twitter":
            if (action === "follow") {
              console.log("Verifying Twitter follow for:", username);
              // In production, use the Twitter API to verify follow
              actionVerified = true;
              console.log("Twitter follow auto-verified (simulated)");
            }
            break;
            
          case "twitch":
            if (action === "follow") {
              console.log("Verifying Twitch follow for:", username);
              // In production, use the Twitch API to verify follow
              actionVerified = true;
              console.log("Twitch follow auto-verified (simulated)");
            }
            break;
            
          // Add cases for other platforms as needed
            
          default:
            // For any other platform, assume verified
            actionVerified = true;
            console.log(`${platform} ${action} auto-verified (generic)`);
        }
      } catch (verificationError) {
        console.error(`Error verifying ${action} on ${platform}:`, verificationError);
        actionVerified = false;
        errorMsg = `We couldn't verify your ${action} on ${platform}. Please try again.`;
      }
      
      if (!actionVerified && !errorMsg) {
        errorMsg = `We couldn't verify your ${action} on ${platform}. Please try again.`;
      }
    } else {
      // If OAuth check is skipped, assume action is verified - ToneDen-style
      // In a production environment, you might implement some basic verification
      // such as IP tracking or session-based verification to prevent abuse
      actionVerified = true;
      console.log(`${platform} ${action} verification skipped per request (ToneDen style)`);
    }
    
    // Handle verification result
    if (!actionVerified) {
      return NextResponse.json({
        error: errorMsg || `Verification failed for ${action} on ${platform}`,
        status: "error",
        verified: false
      }, { status: 400 });
    }
    
    // Set a cookie to remember this verification
    const cookieName = `social_auth_${platform}_${resourceId}`;
    console.log(`Setting cookie: ${cookieName}=verified`);
    
    const response = NextResponse.json({
      success: true,
      message: `Verified ${action} on ${platform}`,
      status: "success",
      verified: true
    });
    
    response.cookies.set({
      name: cookieName,
      value: "verified",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    
    return response;
    
  } catch (error) {
    console.error("Error verifying social action:", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred", status: "error" },
      { status: 500 }
    );
  }
}

/**
 * Retrieves the status of all verifications for a resource
 */
export async function GET(request: NextRequest) {
  try {
    console.log("GET verify-social-action called");
    
    // Get the resource ID from URL params
    const resourceId = request.nextUrl.searchParams.get("resourceId");
    console.log("Checking resourceId:", resourceId);
    
    if (!resourceId) {
      return NextResponse.json(
        { error: "Missing resourceId parameter", completedPlatforms: [], status: "error" },
        { status: 400 }
      );
    }
    
    // Get all cookies (with error handling)
    try {
      const cookies = request.cookies.getAll() || [];
      console.log("All cookies:", cookies.map(c => c.name));
      
      // Filter cookies related to social auth for this resource
      const completedPlatforms = Object.keys(providerMap).filter(platform => {
        const cookieName = `social_auth_${platform}_${resourceId}`;
        const isCompleted = cookies.some(cookie => 
          cookie.name === cookieName && 
          cookie.value === "verified"
        );
        console.log(`Platform ${platform}, cookie ${cookieName}: ${isCompleted ? "completed" : "not completed"}`);
        return isCompleted;
      });
      
      console.log("Completed platforms:", completedPlatforms);
      
      return NextResponse.json({
        completedPlatforms,
        status: "success"
      });
    } catch (cookieError) {
      console.error("Error getting cookies:", cookieError);
      // Return empty list on cookie error rather than failing completely
      return NextResponse.json({
        completedPlatforms: [],
        status: "error",
        message: "Error retrieving verification status"
      });
    }
    
  } catch (error) {
    console.error("Error getting verification status:", error);
    
    return NextResponse.json({ 
      error: "An unexpected error occurred", 
      completedPlatforms: [],
      status: "error" 
    }, { status: 500 });
  }
} 

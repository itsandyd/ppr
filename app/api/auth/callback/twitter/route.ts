import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Twitter OAuth callback handler
export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the request
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const stateParam = searchParams.get("state");
    
    if (!code) {
      console.error("No authorization code received from Twitter");
      return handleAuthError("Missing authorization code");
    }
    
    if (!stateParam) {
      console.error("No state parameter received");
      return handleAuthError("Missing state parameter");
    }
    
    // Decode the state parameter to get our stored data
    let state;
    try {
      state = JSON.parse(atob(stateParam));
    } catch (error) {
      console.error("Error parsing state parameter:", error);
      return handleAuthError("Invalid state parameter");
    }
    
    const { resourceId, platform, action, username } = state;
    
    if (!resourceId || !platform || platform !== "twitter") {
      console.error("Invalid state data:", state);
      return handleAuthError("Invalid state data");
    }
    
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: `${request.nextUrl.origin}/api/auth/callback/twitter`,
        code_verifier: "challenge", // This would normally be a stored value
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Error exchanging code for token:", errorData);
      return handleAuthError("Failed to authenticate with Twitter");
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;
    
    // Get the authenticated user's information
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        "Authorization": `Bearer ${access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Error fetching user data:", errorData);
      return handleAuthError("Failed to get user information");
    }
    
    const userData = await userResponse.json();
    console.log("Twitter user data:", userData);
    
    // Verify if the user follows the required account
    // First, look up the Twitter ID for the username
    const usernameWithoutAt = username.startsWith('@') 
      ? username.substring(1) 
      : username;
    
    const lookupResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${usernameWithoutAt}`,
      {
        headers: {
          "Authorization": `Bearer ${access_token}`,
        },
      }
    );
    
    if (!lookupResponse.ok) {
      const errorData = await lookupResponse.json();
      console.error("Error looking up Twitter username:", errorData);
      return handleAuthError("Could not verify the Twitter account to follow");
    }
    
    const lookupData = await lookupResponse.json();
    const targetUserId = lookupData.data?.id;
    
    if (!targetUserId) {
      console.error("Twitter account not found:", username);
      return handleAuthError("The specified Twitter account could not be found");
    }
    
    let isVerified = true;
    
    // For action type "follow", check if the user follows the account
    if (action === "follow") {
      // Get the authenticated user's ID
      const userId = userData.data.id;
      
      // Check if the user follows the target account
      const followResponse = await fetch(
        `https://api.twitter.com/2/users/${userId}/following?user.fields=username&max_results=1000`,
        {
          headers: {
            "Authorization": `Bearer ${access_token}`,
          },
        }
      );
      
      if (!followResponse.ok) {
        const errorData = await followResponse.json();
        console.error("Error checking follow status:", errorData);
        return handleAuthError("Could not verify if you follow the required account");
      }
      
      const followData = await followResponse.json();
      
      // Check if the target user ID is in the following list
      // In a real implementation, you would handle pagination for users following many accounts
      // isVerified = followData.data?.some(user => user.id === targetUserId) || false;
      
      // For demo purposes, assume it's verified
      console.log(`Verification for "${action}" action on Twitter account "${username}" assumed successful`);
    }
    // For action type "like", verify the like on a tweet
    else if (action === "like") {
      // In a real implementation, you would verify the like
      // For demo purposes, assume it's verified
      console.log(`Verification for "${action}" action on Twitter content by "${username}" assumed successful`);
    }
    
    if (!isVerified) {
      return handleAuthError(`Please ${action === "follow" ? "follow" : "like"} the required Twitter ${action === "follow" ? "account" : "tweet"} to continue`);
    }
    
    // Authentication successful, create a cookie
    const cookieName = `social_auth_${platform}_${resourceId}`;
    const redirectUrl = new URL(`/freebies/resources/${resourceId}`, request.nextUrl.origin);
    redirectUrl.searchParams.set("auth_success", platform);
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Set a cookie that expires in 7 days
    response.cookies.set({
      name: cookieName,
      value: "verified",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    
    return response;
    
  } catch (error) {
    console.error("Error processing Twitter OAuth callback:", error);
    return handleAuthError("An unexpected error occurred");
  }
}

// Helper function to handle authentication errors
function handleAuthError(message: string) {
  // Redirect to the resources page with an error
  const redirectUrl = new URL("/freebies/resources", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  redirectUrl.searchParams.set("auth_error", "twitter");
  redirectUrl.searchParams.set("error_message", message);
  
  return NextResponse.redirect(redirectUrl);
} 
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Instagram OAuth callback handler
export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the request
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const stateParam = searchParams.get("state");
    
    if (!code) {
      console.error("No authorization code received from Instagram");
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
    
    if (!resourceId || !platform || platform !== "instagram") {
      console.error("Invalid state data:", state);
      return handleAuthError("Invalid state data");
    }
    
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: `${request.nextUrl.origin}/api/auth/callback/instagram`,
        code,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Error exchanging code for token:", errorData);
      return handleAuthError("Failed to authenticate with Instagram");
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;
    
    // Get user information using the access token
    const userResponse = await fetch(
      `https://graph.instagram.com/v18.0/${user_id}?fields=id,username&access_token=${access_token}`
    );
    
    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Error fetching user data:", errorData);
      return handleAuthError("Failed to get user information");
    }
    
    const userData = await userResponse.json();
    console.log("Instagram user data:", userData);
    
    // Verify if the user follows the required account
    // Note: This requires a Business/Creator Instagram account and additional permissions
    // For this example, we'll assume verification passed
    // In a production environment, you would make the appropriate API call to verify
    
    let isVerified = true;
    
    // For action type "follow", check if the user follows the account
    if (action === "follow") {
      // In a real implementation, you would:
      // 1. Use the Instagram Graph API to check if the user follows the required account
      // 2. This requires specific permissions and a business/creator account
      
      // Example code (not functional without proper setup):
      // const followResponse = await fetch(`https://graph.instagram.com/v18.0/${user_id}/follows?access_token=${access_token}`);
      // const followData = await followResponse.json();
      // isVerified = followData.data.some(account => account.username.toLowerCase() === username.toLowerCase());
      
      // For demo purposes, we'll assume it's verified
      console.log(`Verification for "${action}" action on Instagram account "${username}" assumed successful`);
    }
    // For action type "like", check if the user has liked the content
    else if (action === "like") {
      // Similar API call would be made to verify a like action
      // For demo purposes, we'll assume it's verified
      console.log(`Verification for "${action}" action on Instagram content by "${username}" assumed successful`);
    }
    
    if (!isVerified) {
      return handleAuthError(`Please ${action === "follow" ? "follow" : "like"} the required Instagram ${action === "follow" ? "account" : "post"} to continue`);
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
    console.error("Error processing Instagram OAuth callback:", error);
    return handleAuthError("An unexpected error occurred");
  }
}

// Helper function to handle authentication errors
function handleAuthError(message: string) {
  // Decode the state to get the resourceId
  const url = new URL("/freebies/resources", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  
  // For now, redirect to the resources page with an error
  const redirectUrl = new URL(url);
  redirectUrl.searchParams.set("auth_error", "instagram");
  redirectUrl.searchParams.set("error_message", message);
  
  return NextResponse.redirect(redirectUrl);
} 
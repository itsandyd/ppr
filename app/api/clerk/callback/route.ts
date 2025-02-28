import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

// This route handles the callback after a user connects a social account
export async function GET(request: NextRequest) {
  try {
    console.log("Clerk callback initiated");
    
    // Get data from the URL
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform");
    const action = searchParams.get("action");
    const username = searchParams.get("username");
    const resourceId = searchParams.get("resourceId");
    
    console.log("Callback params:", { platform, action, username, resourceId });
    
    if (!platform || !action || !username || !resourceId) {
      console.error("Missing required parameters:", { platform, action, username, resourceId });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Get the current user from Clerk
    let user;
    try {
      user = await currentUser();
      console.log("User authenticated:", !!user);
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    
    // Check if the user has connected the requested platform
    const providerMap: Record<string, string> = {
      instagram: "oauth_facebook", // Instagram uses Facebook OAuth since Facebook owns Instagram
      twitter: "oauth_twitter",
      facebook: "oauth_facebook",
      youtube: "oauth_google", // YouTube uses Google OAuth
      spotify: "oauth_spotify",
      twitch: "oauth_twitch",
      soundcloud: "oauth_soundcloud",
    };
    
    const clerkProvider = providerMap[platform];
    
    if (!clerkProvider) {
      console.error("Invalid platform:", platform);
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }
    
    // Check if the user has this social account connected
    const externalAccounts = user.externalAccounts || [];
    console.log("User external accounts:", externalAccounts.map(a => a.provider));
    
    const isConnected = externalAccounts.some(
      account => account.provider === clerkProvider
    );
    
    console.log(`Is connected to ${platform} (${clerkProvider}):`, isConnected);
    
    if (!isConnected) {
      return NextResponse.json(
        { error: "Social account not connected" },
        { status: 400 }
      );
    }
    
    // Special handling for Instagram (which uses Facebook OAuth)
    const cookieName = `social_auth_${platform}_${resourceId}`;
    console.log(`Setting cookie: ${cookieName}=verified`);
    
    // Verify the follow/like action
    // For now, we'll mark it as verified
    // In a production app, you'd make API calls to verify the action
    
    // Store verification result
    const redirectUrl = new URL(`/freebies/resources/${resourceId}`, request.nextUrl.origin);
    
    // Add success parameters to the URL
    redirectUrl.searchParams.set("platform", platform);
    redirectUrl.searchParams.set("action", action);
    redirectUrl.searchParams.set("username", username);
    redirectUrl.searchParams.set("success", "true");
    
    console.log("Redirecting to:", redirectUrl.toString());
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Set a cookie to remember this verification
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
    console.error("Error in Clerk callback:", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 
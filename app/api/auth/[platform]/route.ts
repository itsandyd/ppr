import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action") || "follow"
  const username = searchParams.get("username")
  const resourceId = searchParams.get("resourceId")
  
  if (!platform || !username || !resourceId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }
  
  try {
    // This would normally initiate the OAuth flow
    // For now, we'll just simulate a redirect to the OAuth provider
    
    // Store the auth request parameters in the session so we can retrieve them when the OAuth flow returns
    // In a real implementation, you would use a state parameter with the OAuth provider
    
    const redirectUrl = new URL("/api/auth/callback", request.nextUrl.origin)
    redirectUrl.searchParams.set("platform", platform)
    redirectUrl.searchParams.set("action", action)
    redirectUrl.searchParams.set("username", username)
    redirectUrl.searchParams.set("resourceId", resourceId)
    
    // In a real implementation, this would redirect to the OAuth provider:
    // return NextResponse.redirect(`https://${platform}.com/oauth/authorize?client_id=...&redirect_uri=...`)
    
    // For demo purposes, we're just redirecting to our callback endpoint
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error("Error initiating OAuth flow:", error)
    return NextResponse.json(
      { error: "Failed to initiate authentication" },
      { status: 500 }
    )
  }
} 
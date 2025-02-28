import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get("platform")
  const action = searchParams.get("action")
  const username = searchParams.get("username")
  const resourceId = searchParams.get("resourceId")
  
  if (!platform || !action || !username || !resourceId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }
  
  try {
    // In a real implementation, this would:
    // 1. Exchange the auth code for an access token
    // 2. Call the platform's API to verify the user completed the action (followed, liked, etc.)
    // 3. Store the verification result in the database
    
    // For demo purposes, we'll just simulate a successful verification
    
    // Create a cookie to show that this platform requirement was completed
    const cookieName = `social_auth_${platform}_${resourceId}`
    
    // Redirect back to the resource page with a success parameter
    const redirectUrl = new URL(`/freebies/resources/${resourceId}`, request.nextUrl.origin)
    redirectUrl.searchParams.set("auth_success", platform)
    
    const response = NextResponse.redirect(redirectUrl)
    
    // Set a cookie that expires in 7 days
    response.cookies.set({
      name: cookieName,
      value: "verified",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    
    return response
    
  } catch (error) {
    console.error("Error completing authentication flow:", error)
    
    // Redirect back to the resource page with an error parameter
    const redirectUrl = new URL(`/freebies/resources/${resourceId}`, request.nextUrl.origin)
    redirectUrl.searchParams.set("auth_error", platform)
    
    return NextResponse.redirect(redirectUrl)
  }
} 
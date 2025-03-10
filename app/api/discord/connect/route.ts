import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const body = await request.json();
    const { redirectUrl } = body;
    
    // Store the original URL in Clerk metadata to redirect back after
    const user = await clerkClient.users.getUser(userId);
    
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        originalRedirectUrl: redirectUrl
      }
    });
    
    // Discord OAuth configuration
    const clientId = process.env.DISCORD_CLIENT_ID || '1071023976375136386';
    
    // Use Clerk's OAuth callback URL
    const clerkCallbackUrl = 'https://arriving-vulture-83.clerk.accounts.dev/v1/oauth_callback';
    
    // Build the OAuth URL for Discord that will go through Clerk
    // This is using Clerk's OAuth connection approach
    const authUrl = `https://clerk.${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || ''}/oauth/discord?redirect_url=${encodeURIComponent(redirectUrl)}`;
    
    return NextResponse.json({ 
      success: true,
      authUrl 
    });
  } catch (error) {
    console.error('Error generating Discord auth URL:', error);
    return NextResponse.json({ error: 'Failed to generate Discord auth URL' }, { status: 500 });
  }
} 
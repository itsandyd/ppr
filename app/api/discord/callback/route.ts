import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get the code from Discord
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    if (error) {
      console.error('Discord OAuth error:', error);
      // Redirect to home if there was an error
      return NextResponse.redirect(new URL('/', url.origin));
    }
    
    if (!code) {
      // Redirect to home if no code is provided
      return NextResponse.redirect(new URL('/', url.origin));
    }
    
    // Get auth state
    const { userId } = auth();
    
    if (!userId) {
      // Redirect to sign-in if no user
      return NextResponse.redirect(new URL('/sign-in', url.origin));
    }
    
    // Get the user and their original redirect URL
    const user = await clerkClient.users.getUser(userId);
    const originalRedirectUrl = user.privateMetadata.originalRedirectUrl as string || '/';
    
    console.log('Discord OAuth callback received with code, redirecting to:', originalRedirectUrl);
    
    // In a real implementation we would:
    // 1. Exchange the code for an access token
    // 2. Use the token to get the Discord user info
    // 3. Store the Discord ID in our database
    
    // For now, just update the user's metadata to indicate connection was completed
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        discordConnected: true,
        discordConnectedAt: new Date().toISOString()
      }
    });
    
    // Find the primary email
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      const primaryEmail = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      )?.emailAddress;
      
      if (primaryEmail) {
        try {
          // Check if user exists first
          const existingUser = await db.user.findUnique({
            where: { email: primaryEmail }
          });
          
          if (!existingUser) {
            // Create user if not exists
            await db.user.create({
              data: {
                email: primaryEmail,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || primaryEmail,
                discordVerified: true,
              }
            });
          } else {
            // Update existing user to indicate Discord connection
            await db.user.update({
              where: { email: primaryEmail },
              data: {
                discordVerified: true,
              },
            });
          }
        } catch (dbError) {
          console.error('Database operation failed:', dbError);
          // Continue anyway - we still want to redirect back
        }
      }
    }
    
    // Redirect back to the original page with a success parameter
    return NextResponse.redirect(new URL(`${originalRedirectUrl}?discord=connected`, url.origin));
  } catch (error) {
    console.error('Error handling Discord callback:', error);
    // Redirect to home on error
    return NextResponse.redirect(new URL('/', request.url));
  }
} 
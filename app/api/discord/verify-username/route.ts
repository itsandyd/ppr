import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { verifyDiscordMember } from '@/lib/discord-service';
import { db } from '@/lib/db';
import axios from 'axios';

// Function to try fetching Discord username directly from Discord API
async function fetchDiscordUsername(accountId: string, token: string | null) {
  if (!token) return null;
  
  try {
    console.log('Attempting to fetch Discord username directly from Discord API');
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.username) {
      console.log('Successfully fetched Discord username from API:', response.data.username);
      return response.data.username;
    }
  } catch (error) {
    console.error('Error fetching Discord data from API:', error);
  }
  
  return null;
}

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Get the authenticated user from Clerk
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Verifying Discord for user:', userId);

    // Get the user from Clerk
    const user = await clerkClient.users.getUser(userId);
    
    // Look for Discord connections - Clerk uses oauth_discord for the provider name
    const discordAccount = user.externalAccounts.find(
      account => account.provider.toLowerCase().includes('discord')
    );
    
    console.log('External accounts:', user.externalAccounts.map(a => ({ 
      provider: a.provider, 
      username: a.username,
      externalId: a.externalId ? 'exists' : 'missing'
    })));
    
    // Check if the Discord account is properly connected
    if (!discordAccount) {
      return NextResponse.json({ 
        error: 'No Discord account connected. Please connect Discord first.',
        needsAuth: true 
      }, { status: 400 });
    }
    
    // Require a valid Discord username from OAuth
    if (!discordAccount.username) {
      return NextResponse.json({ 
        error: 'Could not retrieve your Discord username. Please reconnect your Discord account.',
        needsAuth: true,
        invalidUsername: true
      }, { status: 400 });
    }
    
    // Use Discord username from OAuth connection
    const discordUsername = discordAccount.username;
    
    console.log('Using verified Discord username from OAuth:', discordUsername);
    
    console.log('Discord verification for user:', {
      clerkUserId: userId,
      discordUsername,
      fromOAuth: true,
      discordExternalId: discordAccount.externalId || null
    });
    
    // Update Clerk user metadata
    try {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          discordUsername: discordUsername,
          discordConnected: true,
          discordVerified: true,
          discordId: discordAccount.externalId || null,
          // Store whether this was manually entered for reference
          discordUsernameSource: discordAccount.username ? 'oauth' : (body.discordUsername ? 'manual' : 'fallback')
        }
      });
      console.log('Updated Clerk metadata with discordUsername:', discordUsername);
    } catch (clerkError) {
      console.error('Error updating Clerk metadata:', clerkError);
      // Continue even if Clerk update fails
    }

    // Try to update the user in our database with the Discord username
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
      
      if (primaryEmail) {
        try {
          console.log(`Attempting to update user with email ${primaryEmail} in database`);
          
          // Check if user exists first
          const existingUser = await db.user.findUnique({
            where: { email: primaryEmail }
          });
          
          if (!existingUser) {
            console.log(`User with email ${primaryEmail} not found in database`);
            // Create user if not exists
            await db.user.create({
              data: {
                email: primaryEmail,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || primaryEmail,
                discordUsername: discordUsername,
                discordId: discordAccount.externalId || null,
                discordVerified: true,
              }
            });
            console.log(`Created new user with email ${primaryEmail}`);
          } else {
            // Update existing user
            await db.user.update({
              where: { email: primaryEmail },
              data: {
                discordUsername: discordUsername,
                discordId: discordAccount.externalId || null,
                discordVerified: true,
              },
            });
            console.log(`Updated existing user with email ${primaryEmail}`);
          }
          
          // Success response
          return NextResponse.json({ 
            success: true, 
            message: 'Discord account verified successfully',
            discordUsername: discordUsername
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Return a more specific error based on the database error
          return NextResponse.json({ 
            error: 'Database operation failed',
            details: dbError instanceof Error ? dbError.message : 'Unknown error',
            needsAuth: false,
          }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ 
      error: 'Cannot find user email in database',
      needsAuth: true,
    }, { status: 400 });
  } catch (error) {
    console.error('Error verifying Discord account:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
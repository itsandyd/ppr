import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { verifyDiscordMember } from '@/lib/discord-service';
import { db } from '@/lib/db';

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
    
    // Get the discordUsername from the connected account or input
    const discordUsername = discordAccount.username || body.discordUsername || 'discord-user';
    
    // Update Clerk user metadata
    try {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          discordUsername: discordUsername,
          discordConnected: true,
          discordVerified: true,
          discordId: discordAccount.externalId || null
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
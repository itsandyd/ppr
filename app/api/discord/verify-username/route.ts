import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { verifyDiscordMember } from '@/lib/discord-service';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from Clerk to check if they have connected Discord
    const user = await clerkClient.users.getUser(userId);
    const discordAccount = user.externalAccounts.find(
      account => account.provider === 'discord'
    );

    if (!discordAccount) {
      return NextResponse.json({ 
        error: 'No Discord account connected',
        needsAuth: true
      }, { status: 400 });
    }

    // Verify the user is in our Discord server
    const { isValid } = await verifyDiscordMember(discordAccount.externalId);

    if (!isValid) {
      return NextResponse.json({ 
        error: 'You are not a member of our Discord server. Please join the server first.' 
      }, { status: 400 });
    }

    // Update the user in our database
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
      
      if (primaryEmail) {
        await db.user.update({
          where: { email: primaryEmail },
          data: {
            discordUsername: discordAccount.username,
            discordId: discordAccount.externalId,
            discordVerified: true,
          },
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Discord account verified successfully',
      discordId: discordAccount.externalId,
      discordUsername: discordAccount.username
    });
  } catch (error) {
    console.error('Error verifying Discord account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
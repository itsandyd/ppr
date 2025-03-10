import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { 
  assignCoachingRole, 
  createCoachingChannel, 
  scheduleChannelAccess,
  sendSessionWelcomeMessage
} from '@/lib/discord-service';

export async function POST(request: Request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses.find(
      email => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const body = await request.json();
    const { reservationId } = body;
    
    if (!reservationId) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    // Get the reservation
    const reservation = await db.coachingReservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // Get the client user
    const client = await db.user.findUnique({
      where: { id: reservation.userId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Get the coach listing
    const listing = await db.coachingListing.findUnique({
      where: { id: reservation.listingId }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Get the coach user
    const coach = await db.user.findUnique({
      where: { id: listing.userId }
    });

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // Check that the current user is either the coach or the client
    if (
      userEmail !== client.email &&
      userEmail !== coach.email
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify Discord info
    if (!client.discordId || !client.discordVerified) {
      return NextResponse.json({ 
        error: 'Client needs to verify their Discord account first' 
      }, { status: 400 });
    }

    if (!coach.discordId) {
      return NextResponse.json({ 
        error: 'Coach does not have Discord set up' 
      }, { status: 400 });
    }

    // Assign coaching client role
    await assignCoachingRole(client.discordId);

    // Create a coaching channel
    const channelResult = await createCoachingChannel(
      client.discordId,
      coach.discordId,
      reservation.id,
      new Date(reservation.startDate)
    );

    if (!channelResult.success || !channelResult.channelId) {
      return NextResponse.json({ error: 'Failed to create Discord channel' }, { status: 500 });
    }

    // Schedule channel access to be removed after session
    await scheduleChannelAccess(
      channelResult.channelId,
      client.discordId,
      new Date(reservation.endDate)
    );

    // Send welcome message to the channel
    await sendSessionWelcomeMessage(
      channelResult.channelId,
      coach.name || 'Your Coach',
      new Date(reservation.startDate)
    );

    // Update the reservation with Discord channel info
    await db.coachingReservation.update({
      where: {
        id: reservationId,
      },
      data: {
        discordChannelId: channelResult.channelId,
        discordSetupComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      channelId: channelResult.channelId,
    });
  } catch (error) {
    console.error('Error setting up Discord channel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
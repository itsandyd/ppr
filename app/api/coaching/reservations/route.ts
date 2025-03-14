import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";

export async function POST(
  request: Request
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      listingId,
      startDate,
      endDate,
      totalPrice
    } = body;

    console.log('[API] Reservation request:', { 
      userId, 
      listingId, 
      startDate, 
      endDate, 
      totalPrice 
    });

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has Discord connected via Clerk external accounts
    const hasDiscordConnection = user.externalAccounts.some(
      account => account.provider.toLowerCase().includes('discord')
    );
    
    // Check if user has Discord username in Clerk metadata
    const hasDiscordMetadata = typeof user.publicMetadata?.discordUsername === 'string' && 
                              (user.publicMetadata.discordUsername as string).length > 0;
    
    // Check if user has verified Discord in Clerk metadata
    const discordVerifiedInClerk = user.publicMetadata?.discordVerified === true;
    
    // Check if user has Discord username in database
    const dbUser = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        discordUsername: true,
        discordVerified: true
      }
    });

    console.log('[API] Discord verification check:', { 
      hasDiscordConnection,
      hasDiscordMetadata,
      discordVerifiedInClerk,
      discordUsername: user.publicMetadata?.discordUsername || dbUser?.discordUsername,
      discordVerified: discordVerifiedInClerk || dbUser?.discordVerified
    });

    // Allow booking if either they have a Discord connection or a Discord username in metadata
    const hasDiscord = hasDiscordConnection || hasDiscordMetadata;
    
    // Check if verification has been completed - either through Clerk metadata or database
    const isVerified = discordVerifiedInClerk || dbUser?.discordVerified;
    
    // Check if connected but needs verification
    const needsVerification = hasDiscord && !isVerified;

    // If Discord is not connected or not verified, return an error
    if (!hasDiscord || !isVerified) {
      const errorMessage = !hasDiscord 
        ? "Please connect your Discord account before booking a coaching session."
        : "Please verify your Discord account before booking a coaching session.";
        
      console.log('Reservation blocked:', {
        hasDiscord,
        isVerified,
        discordVerifiedInClerk,
        dbDiscordVerified: dbUser?.discordVerified,
        needsVerification,
        publicMetadata: user.publicMetadata
      });
        
      return NextResponse.json(
        { 
          error: errorMessage,
          needsDiscordConnection: !hasDiscord,
          needsDiscordVerification: needsVerification
        },
        { status: 400 }
      );
    }

    // Get the listing
    const listingAndUser = await db.coachingListing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!listingAndUser) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Create the reservation
    const reservation = await db.coachingReservation.create({
      data: {
        userId: userId,
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guestCount: 1 // Default to 1 for coaching sessions
      }
    });

    console.log('[API] Reservation created:', reservation);

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[RESERVATIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
} 
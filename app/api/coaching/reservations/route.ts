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
      account => account.provider === 'discord'
    );
    
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
      discordUsername: dbUser?.discordUsername,
      discordVerified: dbUser?.discordVerified
    });

    // If Discord is not connected or not verified, return an error
    if (!hasDiscordConnection || !dbUser?.discordVerified) {
      const errorMessage = !hasDiscordConnection 
        ? "Please connect your Discord account before booking a coaching session."
        : "Please verify your Discord account before booking a coaching session.";
        
      return NextResponse.json(
        { 
          error: errorMessage,
          needsDiscordConnection: !hasDiscordConnection,
          needsDiscordVerification: hasDiscordConnection && !dbUser?.discordVerified
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
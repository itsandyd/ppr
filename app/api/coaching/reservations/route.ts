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

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has Discord username in Clerk metadata
    const clerkDiscordUsername = user.publicMetadata.discordUsername as string | undefined;
    
    // Check if user has Discord username in database
    const dbUser = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        discordUsername: true
      }
    });

    // If Discord username is not found in either place, return an error
    if (!clerkDiscordUsername && !dbUser?.discordUsername) {
      return NextResponse.json(
        { error: "Discord username is required for coaching sessions. Please update your profile." },
        { status: 400 }
      );
    }

    // If Discord username is in Clerk but not in database, update the database
    if (clerkDiscordUsername && !dbUser?.discordUsername) {
      await db.user.update({
        where: {
          id: userId
        },
        data: {
          discordUsername: clerkDiscordUsername
        }
      });
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

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[RESERVATIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
} 
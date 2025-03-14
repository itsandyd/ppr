import { db } from "@/lib/db";

interface IParams {
  listingId?: string;
}

/**
 * Gets all reservations for a coach based on a single listing ID
 * This ensures schedules are synchronized across all of a coach's listings
 */
export default async function getCoachReservations(
  params: IParams
) {
  try {
    const { listingId } = params;

    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    // First, get the listing to find the coach's user ID
    const listing = await db.coachingListing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        userId: true
      }
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    const coachId = listing.userId;

    // Then, get all listings by this coach
    const coachListings = await db.coachingListing.findMany({
      where: {
        userId: coachId
      },
      select: {
        id: true
      }
    });

    const listingIds = coachListings.map(listing => listing.id);

    // Finally, get all reservations for any of the coach's listings
    const reservations = await db.coachingReservation.findMany({
      where: {
        listingId: {
          in: listingIds
        }
      },
      include: {
        listing: true
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    const safeReservations = reservations.map(
      (reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    console.error("Error getting coach reservations:", error);
    throw new Error(error);
  }
} 
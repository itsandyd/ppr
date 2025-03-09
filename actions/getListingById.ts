import { CoachingListing } from '@prisma/client';
import { db } from "@/lib/db";


interface IParams {
  listingId?: string;
}

export default async function getListingById(
  params: IParams
) {
  try {
    const { listingId } = params;

    const listing = await db.coachingListing.findUnique({
      where: {
        id: listingId,
      }
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

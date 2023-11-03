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
      },
      include: {
        user: {
          include: {
            favorites: true, // Include favoriteIds if it's a relation in your Prisma schema
          },
        },
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: 
          listing.user.emailVerified?.toString() || null,
      }
    };
  } catch (error: any) {
    throw new Error(error);
  }
}


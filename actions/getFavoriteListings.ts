

import { db } from "@/lib/db";
// import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    // const currentUser = await getCurrentUser();

    // if (!currentUser) {
    //   return [];
    // }

    const favorites = await db.coachingListing.findMany({
      where: {
        id: {
        //   in: [...(currentUser.favoriteIds || [])]
        }
      }
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
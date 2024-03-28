

import { db } from "@/lib/db";
import { Sounds, SoundsCategory } from "@prisma/client";

type SoundsWithCategory = Sounds & {
  category: SoundsCategory | null; // Extend Plugin with category relation
};

export const getSounds = async (): Promise<SoundsWithCategory[]> => {
  try {
    // Fetch all plugins and include their categories
    const sounds: SoundsWithCategory[] = await db.sounds.findMany({
      include: {
        category: true, // Include the category relation
      },
      orderBy: {
        createdAt: "asc",
      }
    });

    return sounds;
  } catch (error) {
    console.log("[GET_SOUNDS]", error);
    return [];
  }
}
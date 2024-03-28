import { Plugin, PluginCategory, Sounds, SoundsCategory } from "@prisma/client";
import { db } from "@/lib/db";

type SoundsWithCategory = Sounds & {
  category: SoundsCategory | null;
};

interface GetFreeSoundsParams {
  categoryId?: string; // Optional parameter for filtering by category
}

export const getFreeSounds = async ({ categoryId }: GetFreeSoundsParams = {}): Promise<SoundsWithCategory[]> => {
  try {
    const plugins: SoundsWithCategory[] = await db.sounds.findMany({
      where: {
        pricingType: "FREE",
        ...(categoryId && { categoryId: categoryId }), // Conditionally add categoryId to the query if it exists
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "asc",
      }
    });

    return plugins;
  } catch (error) {
    console.log("[GET_FREE_SOUNDS]", error);
    return [];
  }
}
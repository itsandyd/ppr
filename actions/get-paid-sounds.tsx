import { Plugin, PluginCategory, SoundsCategory } from "@prisma/client";
import { db } from "@/lib/db";

type SoundsWithCategory = Plugin & {
  category: SoundsCategory | null;
};

interface GetPaidSoundsParams {
  categoryId?: string; // Optional parameter for filtering by category
}

export const getPaidSounds = async ({ categoryId }: GetPaidSoundsParams = {}): Promise<SoundsWithCategory[]> => {
  try {
    const sounds: SoundsWithCategory[] = await db.sounds.findMany({
      where: {
        pricingType: "PAID",
        ...(categoryId && { categoryId: categoryId }), // Conditionally add categoryId to the query if it exists
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "asc",
      }
    });

    return sounds;
  } catch (error) {
    console.log("[GET_PAID_SOUNDS]", error);
    return [];
  }
}
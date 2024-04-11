import { Sounds, SoundsCategory } from "@prisma/client";
import { db } from "@/lib/db";

type SoundsWithCategory = Sounds & {
  category: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

interface GetPaidSoundsParams {
  categoryId?: string; // Optional parameter for filtering by category
}

export const getPaidSounds = async ({ categoryId }: GetPaidSoundsParams = {}): Promise<SoundsWithCategory[]> => {
  try {
    const sounds: SoundsWithCategory[] = await db.sounds.findMany({
      where: {
        pricingType: "PAID", // Assuming that the Sounds model has a pricingType field
        ...(categoryId && { categoryId: categoryId }), // Conditionally add categoryId to the query if it exists
      },
      include: {
        category: true, // Include the category relation
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
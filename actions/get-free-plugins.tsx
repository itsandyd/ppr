import { Plugin, PluginCategory } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithCategory = Plugin & {
  category: PluginCategory | null;
};

interface GetFreePluginsParams {
  categoryId?: string; // Optional parameter for filtering by category
}

export const getFreePlugins = async ({ categoryId }: GetFreePluginsParams = {}): Promise<PluginWithCategory[]> => {
  try {
    const plugins: PluginWithCategory[] = await db.plugin.findMany({
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
    console.log("[GET_FREE_PLUGINS]", error);
    return [];
  }
}
import { Plugin, PluginCategory } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithCategory = Plugin & {
  category: PluginCategory | null; // Extend Plugin with category relation
};

export const getPaidPlugins = async (): Promise<PluginWithCategory[]> => {
  try {
    // Fetch all plugins and include their categories
    const plugins: PluginWithCategory[] = await db.plugin.findMany({
      where: {
        pricingType: "PAID"
      },
      include: {
        category: true, // Include the category relation
      },
      orderBy: {
        createdAt: "asc",
      }
    });

    return plugins;
  } catch (error) {
    console.log("[GET_PLUGINS]", error);
    return [];
  }
}
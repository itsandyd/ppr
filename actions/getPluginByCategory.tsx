import { Plugin, PluginCategory } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithCategory = Plugin & {
  category: PluginCategory | null; // Extend Plugin with category relation
};

// Accept a category name as a parameter
export const getPluginsByCategory = async (categoryName: string): Promise<PluginWithCategory[]> => {
  try {
    // Fetch all plugins that belong to the specified category and include their categories
    const plugins: PluginWithCategory[] = await db.plugin.findMany({
      where: {
        category: {
          name: categoryName, // Use the categoryName parameter to filter plugins
        },
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
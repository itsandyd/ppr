import { Plugin, PluginCategory } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithCategory = Plugin & {

};

// Accept a category name as a parameter
export const getPluginsByCategory = async (categoryId: string): Promise<PluginWithCategory[]> => {
  try {
    const plugins: PluginWithCategory[] = await db.plugin.findMany({
      where: {
        categoryId: categoryId, // Use the categoryId parameter to filter plugins
      },
      include: {
        pluginType: true, // Include the pluginType relation
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
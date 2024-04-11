import { Plugin, PluginType } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithType = Plugin & {
  pluginType: PluginType | null; // Extend Product with type relation
};

interface GetFreePluginsParams {
  categoryId?: string; // Optional parameter for filtering by category
  pluginTypeId?: string; // Optional parameter for filtering by pluginType's typeId
}

export const getFreePlugins = async ({ categoryId, pluginTypeId }: GetFreePluginsParams = {}): Promise<PluginWithType[]> => {
  try {
    const products: PluginWithType[] = await db.plugin.findMany({
      where: {
        ...(categoryId && { categoryId: categoryId }), // Conditionally add categoryId to the query if it exists
        ...(pluginTypeId && { pluginTypeId: pluginTypeId }), // Conditionally add pluginTypeId to the query if it exists
      },
      include: {
        pluginType: true, // Include the pluginType relation
      },
      orderBy: {
        createdAt: "asc",
      }
    });

    return products;
  } catch (error) {
    console.log("[GET_FREE_PLUGINS]", error);
    return [];
  }
}
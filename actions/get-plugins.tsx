import { Plugin, PluginType } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithType = Plugin & {
  pluginType: PluginType | null; // Extend Plugin with type relation
};

interface GetPluginsParams {
  categoryId?: string; // Optional parameter for filtering by category
  pluginTypeId?: string; // Optional parameter for filtering by pluginType's typeId
}

export const getPlugins = async ({ categoryId, pluginTypeId }: GetPluginsParams = {}): Promise<PluginWithType[]> => {
  try {
    const plugins: PluginWithType[] = await db.plugin.findMany({
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

    return plugins;
  } catch (error) {
    console.log("[GET_PLUGINS]", error);
    return [];
  }
}
import { Plugin, PluginType } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithType = Plugin & {
  pluginType: PluginType | null; // Extend Product with type relation
};

interface GetFreePluginsParams {
  categoryId?: string; // Optional parameter for filtering by category
  pluginTypeName?: string; // Optional parameter for filtering by pluginType's name
}

export const getFreePlugins = async ({ categoryId, pluginTypeName }: GetFreePluginsParams = {}): Promise<PluginWithType[]> => {
  try {
    const products: PluginWithType[] = await db.plugin.findMany({
      where: {
        ...(categoryId && { categoryId: categoryId }), // Conditionally add categoryId to the query if it exists
        ...(pluginTypeName && { pluginType: { name: pluginTypeName } }), // Conditionally add pluginTypeName to the query if it exists
        pricingType: "FREE", // Only include plugins where the pricingType is Free
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
import { Plugin, PluginEffectCategory, PluginInstrumentCategory, PluginType } from "@prisma/client";
import { db } from "@/lib/db";

type PluginWithType = Plugin & {
  pluginType: PluginType | null; // Extend Plugin with type relation
};

export const getPlugins = async (): Promise<PluginWithType[]> => {
  try {
    // Fetch all plugins and include their types
    const plugins: PluginWithType[] = await db.plugin.findMany({
      include: {
        pluginType: true,
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
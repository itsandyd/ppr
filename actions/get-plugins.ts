import { db } from "@/lib/db";

interface GetPluginsProps {
  title?: string;
  categoryId?: string;
  typeId?: string;
}

export const getPlugins = async ({
  title,
  categoryId,
  typeId
}: GetPluginsProps) => {
  try {
    const plugins = await db.plugin.findMany({
      where: {
        AND: [
          // Search by name if provided
          title ? {
            name: {
              contains: title.toLowerCase()
            }
          } : {},
          // Filter by category if provided
          categoryId ? { categoryId } : {},
          // Filter by type if provided
          typeId ? { pluginTypeId: typeId } : {},
        ]
      },
      include: {
        pluginType: true,
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return plugins;
  } catch (error) {
    console.error("[GET_PLUGINS]", error);
    return [];
  }
} 
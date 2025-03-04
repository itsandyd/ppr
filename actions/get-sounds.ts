import { db } from "@/lib/db";

interface GetSoundsProps {
  title?: string;
  categoryId?: string;
  typeId?: string;
}

export const getSounds = async (props?: GetSoundsProps) => {
  const { title, categoryId } = props || {};
  
  try {
    const sounds = await db.sounds.findMany({
      where: {
        AND: [
          title ? {
            name: {
              contains: title.toLowerCase()
            }
          } : {},
          categoryId ? { categoryId } : {},
        ]
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return sounds;
  } catch (error) {
    console.error("[GET_SOUNDS]", error);
    return [];
  }
} 
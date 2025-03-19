import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { pluginId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const plugin = await db.plugin.findUnique({
      where: {
        id: params.pluginId,
        userId,
      },
    });

    if (!plugin) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Since there's no dedicated published field, we'll:
    // 1. Make sure the slug is set (required for a published plugin)
    // 2. Append a [PUBLISHED] tag to the description if not already there
    
    let description = plugin.description || "";
    if (!description.includes("[PUBLISHED]")) {
      description = `[PUBLISHED] ${description}`;
    }

    // Ensure slug exists
    const slug = plugin.slug || plugin.name.toLowerCase().replace(/\s+/g, '-');

    const publishedPlugin = await db.plugin.update({
      where: {
        id: params.pluginId,
      },
      data: {
        slug,
        description,
      },
    });

    return NextResponse.json(publishedPlugin);
  } catch (error) {
    console.log("[PLUGIN_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
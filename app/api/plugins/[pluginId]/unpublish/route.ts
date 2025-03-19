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

    // Remove the [PUBLISHED] tag from the description if it exists
    let description = plugin.description || "";
    description = description.replace("[PUBLISHED] ", "");

    const unpublishedPlugin = await db.plugin.update({
      where: {
        id: params.pluginId,
      },
      data: {
        description,
      },
    });

    return NextResponse.json(unpublishedPlugin);
  } catch (error) {
    console.log("[PLUGIN_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
import { CourseChapter } from '@prisma/client';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { pluginId: string } }
  ) {
    try {
      const { userId } = auth();
    //   const { pluginCategoryId } = await req.json();
      const { videoUrl, audioUrl, ...values } = await req.json();

      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const plugin = await db.plugin.findFirst({
        where: {
          id: params.pluginId,
          userId,
        },
      });
  
      if (!plugin) {
        return new NextResponse("Not found", { status: 404 });
      }
  
      const updateData: any = { ...values };
  
      if (videoUrl !== undefined) {
        updateData.videoUrl = videoUrl;
      }
      
      if (audioUrl !== undefined) {
        updateData.audioUrl = audioUrl;
      }
  
      const updatedPlugin = await db.plugin.update({
        where: {
          id: params.pluginId,
        },
        data: updateData,
      });
  
      return NextResponse.json(updatedPlugin);
    } catch (error) {
      console.error("[PLUGIN_PATCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

export async function DELETE(
  req: Request,
  { params }: { params: { pluginId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const plugin = await db.plugin.findFirst({
      where: {
        id: params.pluginId,
        userId,
      },
    });

    if (!plugin) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.plugin.delete({
      where: {
        id: params.pluginId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PLUGIN_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
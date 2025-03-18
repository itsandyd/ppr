import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!chapterId) {
      return new NextResponse("Missing chapterId", { status: 400 });
    }

    // Get the chapter data
    const chapter = await db.courseChapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        audioUrl: true,
        position: true,
        isPublished: true,
        isFree: true,
        muxData: {
          select: {
            id: true,
            assetId: true,
            playbackId: true
          }
        }
      }
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTER_GET_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
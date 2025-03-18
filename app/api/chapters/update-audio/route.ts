import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { chapterId, audioUrl } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!chapterId) {
      return new NextResponse("Chapter ID is required", { status: 400 });
    }

    if (!audioUrl) {
      return new NextResponse("Audio URL is required", { status: 400 });
    }

    console.log(`Updating chapter ${chapterId} with audio URL: ${audioUrl}`);

    // Update the chapter with the permanent audio URL
    await db.courseChapter.update({
      where: { id: chapterId },
      data: { audioUrl }
    });

    console.log("Chapter audio URL updated successfully");

    return NextResponse.json({
      success: true,
      message: "Chapter audio URL updated"
    });
  } catch (error) {
    console.error("[UPDATE_AUDIO_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
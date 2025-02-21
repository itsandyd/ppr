import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title, description, chapters } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update course title and description if provided
    const courseUpdate: { title?: string; description?: string } = {};
    if (title) courseUpdate.title = title;
    if (description) courseUpdate.description = description;

    // Update the course
    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: courseUpdate,
    });

    // Add chapters if provided
    if (chapters && Array.isArray(chapters)) {
      // Get current max position
      const existingChapters = await db.courseChapter.findMany({
        where: {
          courseId: params.courseId,
        },
        orderBy: {
          position: 'desc',
        },
        take: 1,
      });

      const startPosition = existingChapters[0]?.position || 0;

      // Create chapters
      await Promise.all(
        chapters.map((chapter: { title: string; description: string }, index: number) => {
          return db.courseChapter.create({
            data: {
              title: chapter.title,
              description: chapter.description,
              position: startPosition + index + 1,
              courseId: params.courseId,
            },
          });
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COURSE_APPLY_GENERATED]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
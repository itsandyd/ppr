import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } },
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 } );
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 } );
        }

        const chapter = await db.courseChapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            },
        });

        if (!chapter || !chapter.title || !chapter.description) {
            return new NextResponse("Missing required fields", { status: 400 } );
        }

        const publishedChapter = await db.courseChapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
            }
        })

        if (!publishedChapter) {
            return new NextResponse("Failed to publish chapter", { status: 400 } );
        }

        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("[CHAPTER_PUBLISH", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
import { ReactNode } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseNavbar } from "@/components/courses/navbar";
import { CourseDashboardSidebar } from "@/components/courses/sidebar";
import { Course } from "@prisma/client";

export const runtime = 'nodejs';

interface LayoutProps {
  children: ReactNode;
}

async function getProgress(userId: string, courseId: string): Promise<number> {
  try {
    const publishedChapters = await db.courseChapter.findMany({
      where: {
        courseId: courseId,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;

    return Math.round(progressPercentage);
  } catch (error) {
    console.error("[GET_PROGRESS]", error);
    return 0;
  }
}

export default async function Layout({ children }: LayoutProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="h-full relative flex">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60">
        <CourseDashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full bg-background text-foreground dark:bg-background dark:text-foreground transition-colors md:ml-60">
        <CourseNavbar />
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
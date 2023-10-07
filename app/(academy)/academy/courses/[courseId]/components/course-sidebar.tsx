import Link from "next/link"

import { Logo } from "@/components/courses/logo"
import { ArrowLeft } from "lucide-react"
import { Course, CourseChapter, UserProgress} from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseSidebarItem } from "./course-sidebar-item";
import Image from "next/image";

interface CourseSidebarProps {
    course: Course & {
        courseChapter: (CourseChapter & {
            userProgress: UserProgress[];
        })[];
    };
    progressCount: number;
}

export const CourseSidebar = async ({
    course,
    progressCount
}: CourseSidebarProps) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const purchase = await db.purchaseCourse.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    })

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
          <div className="p-8 flex flex-col border-b">
            <h1 className="font-semibold">
              {course.title}
            </h1>
            {purchase && (
              <div className="mt-10">
                {/* <CourseProgress
                  variant="success"
                  value={progressCount}
                /> */}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full">
            {course.courseChapter.map((chapter) => (
              <CourseSidebarItem
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase}
              />
            ))}
          </div>
        </div>
      )
    }
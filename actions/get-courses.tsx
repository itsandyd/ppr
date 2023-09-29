import { Course, CourseCategory } from "@prisma/client"

import { getProgress } from "./get-progress"
import { db } from "@/lib/db";

type CoursesWithProgressWithCategory = Course & {
    category?: CourseCategory | null,
    chapters?: { id: string}[],
    progress?: number | null,
};

type GetCourses = {
    userId: string,
    title?: string,
    categoryId?: string,
}

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CoursesWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title || "",
                },
                courseCategoryId: categoryId || undefined,
            },
            include: {
                CourseCategory: true,
                CourseChapter: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    },
                },
                PurchaseCourse: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        })

        const coursesWithProgress: CoursesWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course) => {
                if (course.PurchaseCourse.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                }
            }));

            return coursesWithProgress;

    } catch (error) {
        console.log("[GET_COURSES]", error)
        return []
    }


}
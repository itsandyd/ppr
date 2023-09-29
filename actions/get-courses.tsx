import { CourseCategory, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    courseCategory: CourseCategory | null;
    courseChapters: { id: string }[];
    progress: number | null;
  };

type GetCourses = {
  userId: string;
  title?: string;
  courseCategoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  courseCategoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        courseCategoryId
      },
      include: {
        CourseCategory: true,
        CourseChapter: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
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
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
        courses.map(async course => {
          const courseCategory = course.CourseCategory || { id: '', name: '' };
          if (course.PurchaseCourse.length === 0) {
            return {
              ...course,
              courseCategory,
              courseChapters: course.CourseChapter,
              progress: null,
            }
          }
      
          const progressPercentage = await getProgress(userId, course.id);
      
          return {
            ...course,
            courseCategory,
            courseChapters: course.CourseChapter,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}
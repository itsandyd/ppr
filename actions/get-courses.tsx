import { CourseCategory, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    courseCategory: CourseCategory | null; // changed from 'category' to 'courseCategory'
    courseChapter: { id: string }[]; // changed from 'chapters' to 'courseChapter'
    progress: number | null;
  };

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        courseCategoryId: categoryId,
      },
      include: {
        courseCategory: true,
        courseChapter: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchaseCourse: {
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
          if (course.purchaseCourse.length === 0) { // changed from 'purchases' to 'purchaseCourse'
            return {
              ...course,
              progress: null,
            }
          }
      
          const progressPercentage = await getProgress(userId, course.id);
      
          return {
            ...course,
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
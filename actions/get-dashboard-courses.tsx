import { CourseCategory, CourseChapter, Course } from "@prisma/client";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: CourseCategory | null; // Allow category to be null
  chapters: CourseChapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchaseCourse.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            courseCategory: true,
            courseChapter: {
              where: {
                isPublished: true,
              }
            }
          }
        }
      }
    });

    // Correctly map purchasedCourses to CourseWithProgressWithCategory[]
    const courses: CourseWithProgressWithCategory[] = purchasedCourses.map((purchase) => {
      const course = purchase.course;
      return {
        ...course,
        category: course.courseCategory, // Rename courseCategory to category
        chapters: course.courseChapter, // Rename courseChapter to chapters
        progress: null, // Initialize progress; will be set in the loop below
      };
    });

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course.progress = progress; // Set progress for each course
    }

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}
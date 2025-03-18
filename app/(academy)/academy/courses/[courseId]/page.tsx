import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CourseNavbar } from "./components/course-navbar";

const CourseIdPage = async ({
    params
  }: {
    params: { courseId: string; }
  }) => {
    const course = {
      id: params.courseId,
      userId: "dummyUser",
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: "Sample Course Title",
      description: "Sample description",
      price: 0,
      isPublished: true,
      courseCategoryId: null,
      courseChapter: [
        {
           id: "chapter1",
           createdAt: new Date(),
           updatedAt: new Date(),
           title: "Introduction",
           description: null,
           isPublished: true,
           position: 1,
           videoUrl: null,
           audioUrl: null,
           isFree: true,
           courseId: params.courseId,
           userProgress: []
        },
        {
           id: "chapter2",
           createdAt: new Date(),
           updatedAt: new Date(),
           title: "Getting Started",
           description: null,
           isPublished: true,
           position: 2,
           videoUrl: null,
           audioUrl: null,
           isFree: false,
           courseId: params.courseId,
           userProgress: []
        }
      ]
    };
  
    if (!course) {
      return redirect("/");
    }

    const progressCount = 0; // Replace with actual progress calculation

    return (
      <div>
        <CourseNavbar course={course} progressCount={progressCount} />
        <div className="p-6">
          {/* Course content goes here */}
          <h1 className="text-2xl font-bold">Course Content</h1>
        </div>
      </div>
    );
}

export default CourseIdPage;
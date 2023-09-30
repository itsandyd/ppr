import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
    params
  }: {
    params: { courseId: string; }
  }) => {
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        courseChapter: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc"
          }
        }
      }
    });
  
    if (!course) {
      return redirect("/");
    }
    return ( 
        <div>
            Course ID Page
        </div>
     );
}

export default CourseIdPage;
import { CourseNavbarRoutes } from "@/components/courses/navbar-routes";
import { Course, CourseChapter, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseSidebarProps {
    course: Course & {
        courseChapter: (CourseChapter & {
            userProgress: UserProgress[];
        })[];
    };
    progressCount: number;
}

export const CourseNavbar = ({
    course,
    progressCount,
}: CourseSidebarProps) => {
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar 
                course={course}
                progressCount={progressCount}
            />
            <CourseNavbarRoutes />
        </div>
     );
}
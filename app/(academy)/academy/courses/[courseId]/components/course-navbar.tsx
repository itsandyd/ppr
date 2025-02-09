import { CourseNavbarRoutes } from "@/components/courses/navbar-routes";
import { Course, CourseChapter, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { cn } from "@/lib/utils";

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
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "border-border transition-colors"
        )}>
            <CourseMobileSidebar 
                course={course}
                progressCount={progressCount}
            />
            <CourseNavbarRoutes />
        </div>
     );
}
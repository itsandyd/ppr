import { CourseMobileSidebar } from "./mobile-sidebar";
import { CourseNavbarRoutes } from "./navbar-routes";
import { cn } from "@/lib/utils";

export const CourseNavbar = () => {
    return ( 
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "border-border transition-colors"
        )}>
            <CourseMobileSidebar />
            <CourseNavbarRoutes />
        </div>
     );
}
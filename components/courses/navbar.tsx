import { CourseMobileSidebar } from "./mobile-sidebar";
import { CourseNavbarRoutes } from "./navbar-routes";

export const CourseNavbar = () => {
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar />
            <CourseNavbarRoutes />
        </div>
     );
}
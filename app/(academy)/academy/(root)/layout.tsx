import { CourseNavbar } from "@/components/courses/navbar";
import { CourseDashboardSidebar } from "@/components/courses/sidebar";
import { Course } from "@prisma/client";

const DashboardLayout = ({
  children,
  course,
  progressCount
}: {
  children: React.ReactNode;
  course: Course; // ideally use proper Course type
  progressCount: number;
}) => {
  return ( 
    <div className="h-full relative flex">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60">
        <CourseDashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full bg-background text-foreground dark:bg-background dark:text-foreground transition-colors md:ml-60">
        <CourseNavbar />
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
   );
}
 
export default DashboardLayout;
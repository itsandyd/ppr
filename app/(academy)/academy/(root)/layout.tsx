import { CourseNavbar } from "@/components/courses/navbar";
import { CourseDashboardSidebar } from "@/components/courses/sidebar";

const DashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full relative flex">
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <CourseDashboardSidebar />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60">
        <CourseDashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full bg-background text-foreground dark:bg-background dark:text-foreground transition-colors md:ml-60">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
   );
}
 
export default DashboardLayout;
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Course, CourseChapter, UserProgress } from "@prisma/client"
import { Menu } from "lucide-react"
import { CourseSidebar } from "./course-sidebar"
import { cn } from "@/lib/utils"

interface CourseMobileSidebarProps {
    course: Course & {
        courseChapter: (CourseChapter & {
            userProgress: UserProgress[];
        })[];
    };
    progressCount: number;
}

export const CourseMobileSidebar = ({
    course,
    progressCount
}: CourseMobileSidebarProps) => {

    return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side="left" className={cn(
            "p-0 w-72",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "theme-transition"
        )}>
            <CourseSidebar 
                course={course}
                progressCount={progressCount}
            />
        </SheetContent>
    </Sheet>
    )

}
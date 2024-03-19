import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Course, CourseChapter, UserProgress } from "@prisma/client"
import { Menu } from "lucide-react"
import { ProfileSidebar } from "./ProfileSidebar";


interface CourseMobileSidebarProps {
    // course: Course & {
    //     courseChapter: (CourseChapter & {
    //         userProgress: UserProgress[];
    //     })[];
    // };
    // progressCount: number;
}

export const ProfileMobileSidebar = ({
}) => {

    return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white w-72">
            <ProfileSidebar 
            />
        </SheetContent>
    </Sheet>
    )

}
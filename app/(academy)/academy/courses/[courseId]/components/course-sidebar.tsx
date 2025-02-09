import Link from "next/link"
import { Menu } from "lucide-react"
import { Course, CourseChapter, UserProgress } from "@prisma/client"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { CourseSidebarItem } from "./course-sidebar-item"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface CourseSidebarProps {
    course: Course & {
        courseChapter: (CourseChapter & {
            userProgress: UserProgress[];
        })[];
    };
    progressCount: number;
}

export const CourseSidebar = async ({
    course,
    progressCount
}: CourseSidebarProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const purchase = await db.purchaseCourse.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    });

    return (
        <>
            {/* Mobile Sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-4 text-white">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-card text-card-foreground dark:bg-card dark:text-card-foreground border-r-0">
                    <div className="h-full flex flex-col overflow-y-auto">
                        <div className="p-4 border-b border-gray-800">
                            <h1 className="text-xl font-semibold text-white">{course.title}</h1>
                            {purchase && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">Progress: {progressCount}%</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col w-full py-2">
                            {course.courseChapter.map((chapter) => (
                                <CourseSidebarItem
                                    key={chapter.id}
                                    id={chapter.id}
                                    label={chapter.title}
                                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                                    courseId={course.id}
                                    isLocked={!chapter.isFree && !purchase}
                                />
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className={cn(
                "hidden md:flex h-full w-60 bg-card text-card-foreground dark:bg-card dark:text-card-foreground border-r border-gray-800 flex-col overflow-y-auto transition-all duration-300"
            )}>
                <div className="p-4 flex items-center border-b border-gray-800">
                    <h1 className="text-xl font-semibold text-white whitespace-nowrap">{course.title}</h1>
                </div>
                {purchase && (
                    <div className="p-4 border-b border-gray-800">
                        <p className="text-sm text-gray-400">Progress: {progressCount}%</p>
                    </div>
                )}
                <div className="flex flex-col w-full py-2">
                    {course.courseChapter.map((chapter) => (
                        <CourseSidebarItem
                            key={chapter.id}
                            id={chapter.id}
                            label={chapter.title}
                            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                            courseId={course.id}
                            isLocked={!chapter.isFree && !purchase}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
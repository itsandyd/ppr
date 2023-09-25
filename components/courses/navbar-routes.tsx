"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../community/mode-toggle";

export const CourseNavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    const isTeacherPage = pathname?.startsWith("/courses/teacher");
    const isPlayerPage = pathname?.startsWith("/courses/student");

    return (
        <div className="flex gap-x-2 ml-auto">
            {/* <ModeToggle /> */}
            {isTeacherPage || isPlayerPage ? (
            <Link href="/courses/"> 
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                </Button>
            </Link>
            ) : 
                <Link href="/courses/teacher/courses"> 
                    <Button size="sm" variant="ghost">
                        Teacher mode
                    </Button>
                </Link>
                }
            <UserButton 
                afterSignOutUrl="/"
            />
        </div>
    )
}
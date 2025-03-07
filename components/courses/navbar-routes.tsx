"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const CourseNavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    const isTeacherPage = pathname?.startsWith("/academy/dashboard/teacher");
    const isCoursePage = pathname?.startsWith("/academy/courses");
    const isSearchPage = pathname === "/academy/search";

    return (
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage ? (
            <Link href="/academy/"> 
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2"/>
                    Exit
                </Button>
            </Link>
            ) : (
                <Link href="/academy/dashboard/teacher/courses"> 
                    <Button size="sm" variant="ghost">
                        Teacher mode
                    </Button>
                </Link>
            )}
        </div>
        </>
    )
}
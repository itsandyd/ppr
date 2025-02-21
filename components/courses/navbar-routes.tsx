"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../community/mode-toggle";
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
            {/* <ModeToggle />
            {isTeacherPage || isCoursePage ? (
            <Link href="/academy/"> 
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                </Button>
            </Link>
            ) : 
                <Link href="/academy/dashboard/teacher/courses"> 
                    <Button size="sm" variant="ghost">
                        Teacher mode
                    </Button>
                </Link>
                } */}
            <UserButton 
                afterSignOutUrl="/"
            />
        </div>
        </>
    )
}
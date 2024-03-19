"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const ProfileNavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    // const isTeacherPage = pathname?.startsWith("/academy/dashboard/teacher");
    // const isCoursePage = pathname?.startsWith("/academy/courses");

    // const isSearchPage = pathname === "/academy/search";

    return (
        <>
        {/* {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )} */}
        <div className="flex items-center gap-x-2 ml-auto">
            <Link href="/profile">
          <Button variant="outline" className="rounded-full">
            View Profile
          </Button>
        </Link>
            <UserButton 
                afterSignOutUrl="/"
            />
        </div>
        </>
    )
}
"use client"

import { UserButton, useAuth } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/community/mode-toggle";
// import { SearchInput } from "./search-input";

export const PluginNavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { isSignedIn } = useAuth();

    const isTeacherPage = pathname?.startsWith("/academy/dashboard/teacher");
    const isCoursePage = pathname?.startsWith("/academy/courses");

    const isSearchPage = pathname === "/academy/search";

    return (
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                {/* <SearchInput /> */}
            </div>
        )}
        <div className="flex items-center gap-x-2 ml-auto">
            {isSignedIn ? (
                <Link href="/profile">
                    <Button variant="default" className="rounded-full text-sm">
                        View Profile
                    </Button>
                </Link>
            ) : (
                <Link href="/sign-in">
                    <Button variant="default" className="rounded-full text-sm">
                        Login
                    </Button>
                </Link>
            )}
            <ModeToggle />
            <UserButton 
                afterSignOutUrl="/"
            />
        </div>
        </>
    )
}
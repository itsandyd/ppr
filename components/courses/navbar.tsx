import { CourseMobileSidebar } from "./mobile-sidebar";
import { CourseNavbarRoutes } from "./navbar-routes";
import { cn } from "@/lib/utils";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../community/mode-toggle";

export const CourseNavbar = () => {
    return ( 
        <div className={cn(
            "h-[65px] pl-0 pr-4 border-b flex items-center shadow-sm",
            "bg-white dark:bg-card",
            "text-gray-900 dark:text-card-foreground",
            "border-gray-200 dark:border-gray-800",
            "transition-colors duration-200"
        )}>
            <div className="flex items-center">
                <CourseMobileSidebar />
            </div>
            
            <div className="flex items-center justify-between w-full">
                <div className="flex-shrink-0 pl-4">
                    <CourseNavbarRoutes />
                </div>
                
                <div className="flex items-center space-x-3 ml-auto">
                    <ModeToggle />
                    <Link href="/profile">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white dark:bg-card border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                        >
                            View Profile
                        </Button>
                    </Link>
                    <div className="ml-1">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </div>
     );
}
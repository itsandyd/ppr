import { ProfileMobileSidebar } from "./ProfileMobileSidebar";
import { ProfileNavbarRoutes } from "./ProfileNavbarRoutes";
import { cn } from "@/lib/utils";

export const ProfileNavbar = () => {
    return ( 
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "border-border transition-colors"
        )}>
            <ProfileMobileSidebar />
            <ProfileNavbarRoutes />
        </div>
     );
}
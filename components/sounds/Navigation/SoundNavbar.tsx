import { SoundNavbarRoutes } from "./SoundNavbarRoutes";
import { cn } from "@/lib/utils";

export const SoundNavbar = () => {
    return ( 
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "border-border transition-colors"
        )}>
            {/* <CourseMobileSidebar /> */}
            <SoundNavbarRoutes />  
        </div>
     );
}
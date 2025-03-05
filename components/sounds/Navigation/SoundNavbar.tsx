import { SoundNavbarRoutes } from "./SoundNavbarRoutes";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SoundSidebar } from "./SoundSidebar";
import { Button } from "@/components/ui/button";

export const SoundNavbar = () => {
    return ( 
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "border-border transition-colors"
        )}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden mr-2">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-white dark:bg-zinc-900 w-72">
                    <SoundSidebar />
                </SheetContent>
            </Sheet>
            <SoundNavbarRoutes />  
        </div>
     );
}
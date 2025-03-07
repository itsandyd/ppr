import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";

export const MusicMobileSidebar = () => {
    return ( 
        <Sheet>
            <SheetTrigger className="md:hidden pl-4 pr-2 py-2 hover:opacity-75 transition">
                <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[250px] sm:w-[250px] bg-gray-50 dark:bg-[#030303] border-r border-gray-200 dark:border-gray-800">
                <SidebarNav isMobile={true} />
            </SheetContent>
        </Sheet>
     );
} 
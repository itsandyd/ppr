"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseDashboardSidebar } from "./sidebar";

export const CourseMobileSidebar = () => {
    return ( 
        <Sheet>
            <SheetTrigger className="md:hidden pl-4 pr-2 py-2 hover:opacity-75 transition">
                <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full sm:w-72">
                <CourseDashboardSidebar />
            </SheetContent>
        </Sheet>
     );
}
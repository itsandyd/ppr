"use client";

import { PluginNavbarRoutes } from "./plugin-navbar-routes";
import { useSidebar } from "../providers/sidebar-provider";
import { cn } from "@/lib/utils";

export const PluginNavbar = () => {
    const { isCollapsed } = useSidebar();

    return ( 
        // border-b 
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm bg-white dark:bg-[#313338] transition-all duration-300",
            isCollapsed ? "md:pl-[70px]" : "md:pl-[240px]"
        )}>
            {/* <CourseMobileSidebar /> */}
            <PluginNavbarRoutes />  
        </div>
     );
}
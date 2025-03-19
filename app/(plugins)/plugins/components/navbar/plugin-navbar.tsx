"use client";

import { PluginNavbarRoutes } from "./plugin-navbar-routes";
import { useSidebar, SidebarProvider } from "../providers/sidebar-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PluginSidebarRoutes } from "../sidebar/plugin-sidebar-routes";

// Inner component that uses the context
const PluginNavbarContent = () => {
    const { isCollapsed } = useSidebar();

    return ( 
        <div className={cn(
            "h-[65px] border-b flex items-center justify-between shadow-sm bg-white dark:bg-card text-gray-900 dark:text-card-foreground theme-transition"
        )}>
            <div className="flex items-center pl-4">
                {/* Mobile Menu Button - Only visible on mobile */}
                <div className="md:hidden mr-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-white">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-card text-gray-900 dark:text-card-foreground border-r-0 z-[100] mt-0 h-full">
                            <div className="h-full flex flex-col overflow-y-auto">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                                    <Link href="/plugins">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white">Plugins</p>
                                    </Link>
                                </div>
                                <div className="flex flex-col w-full">
                                    <PluginSidebarRoutes />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="pr-4">
                <PluginNavbarRoutes />
            </div>
        </div>
     );
}

// Wrapper component that provides the context
export const PluginNavbar = () => {
    return (
        <SidebarProvider>
            <PluginNavbarContent />
        </SidebarProvider>
    );
}
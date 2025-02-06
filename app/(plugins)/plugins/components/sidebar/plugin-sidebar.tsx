"use client";

import Link from "next/link"
// import { Button } from "../ui/button"
// import { Logo } from "./logo"

import { ArrowLeft, Menu } from "lucide-react"
import { PluginSidebarRoutes } from "./plugin-sidebar-routes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useSidebar } from "../providers/sidebar-provider"

export const PluginSidebar = () => {
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-4 text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-card text-card-foreground dark:bg-card dark:text-card-foreground border-r-0">
          <div className="h-full flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <Link href="/plugins">
                <p className="text-xl font-semibold text-white">Plugins</p>
              </Link>
            </div>
            <div className="flex flex-col w-full">
              <PluginSidebarRoutes />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex h-full bg-card text-card-foreground dark:bg-card dark:text-card-foreground border-r border-gray-800 flex-col overflow-y-auto transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}>
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <Link href="/plugins" className={cn(
            "transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-0" : "w-[150px]"
          )}>
            <p className="text-xl font-semibold text-white whitespace-nowrap">Plugins</p>
          </Link>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleCollapse}
            className={cn(
              "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700",
              isCollapsed && "ml-auto"
            )}
          >
            <ArrowLeft className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
        <div className="flex flex-col w-full py-2">
          <PluginSidebarRoutes isCollapsed={isCollapsed} />
        </div>
      </div>
    </>
  )
}
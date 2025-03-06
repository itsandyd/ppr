"use client";

import Link from "next/link"
// import { Button } from "../ui/button"
// import { Logo } from "./logo"

import { Menu } from "lucide-react"
import { PluginSidebarRoutes } from "./plugin-sidebar-routes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export const PluginSidebar = () => {
  return (
    // Desktop Sidebar Only
    <div className="h-full w-full bg-white dark:bg-card text-gray-900 dark:text-card-foreground border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto theme-transition">
      <div className="h-[65px] px-4 flex items-center border-b border-gray-200 dark:border-gray-800 theme-transition">
        <Link href="/plugins">
          <p className="text-xl font-semibold text-gray-900 dark:text-white whitespace-nowrap theme-transition">Plugins</p>
        </Link>
      </div>
      <div className="flex flex-col w-full py-2">
        <PluginSidebarRoutes />
      </div>
    </div>
  )
}
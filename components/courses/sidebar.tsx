"use client";

import Link from "next/link"
import { Button } from "../ui/button"
import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export const CourseDashboardSidebar = () => {
  return (
    <div className={cn(
      "h-full border-r flex flex-col overflow-y-auto shadow-sm w-full",
      "bg-white dark:bg-card",
      "text-gray-900 dark:text-card-foreground",
      "border-gray-200 dark:border-gray-800",
      "transition-colors duration-200"
    )}>
      <div className="h-[65px] px-6 flex items-center border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <Link href="/">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">Academy</p>
        </Link>
      </div>
      <div className="flex flex-col w-full py-2">
        <SidebarRoutes />
      </div>
    </div>
  )
}
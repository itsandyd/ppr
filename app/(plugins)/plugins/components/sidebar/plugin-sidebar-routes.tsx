"use client"

import { cn } from "@/lib/utils"
import { Compass, Download, Folder, Home, Music2, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface PluginSidebarRoutesProps {
  isCollapsed?: boolean;
}

export const PluginSidebarRoutes = ({
  isCollapsed
}: PluginSidebarRoutesProps) => {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Browse',
      icon: Compass,
      href: '/plugins',
    },
    {
      label: 'Search',
      icon: Search,
      href: '/plugins/search',
    },
    {
      label: 'Free',
      icon: Download,
      href: '/plugins/free',
    },
    {
      label: 'Paid',
      icon: Music2,
      href: '/plugins/paid',
    },
    // {
    //   label: 'Synths',
    //   icon: Folder,
    //   href: '/plugins/synths',
    // },
  ];

  return (
    <div className="flex flex-col w-full space-y-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-x-2 text-sm font-medium px-3 py-2 transition-all theme-transition",
            "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50",
            pathname === route.href && "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700/50",
            isCollapsed ? "justify-center px-2" : "px-3"
          )}
        >
          <route.icon className={cn(
            "h-4 w-4",
            pathname === route.href ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
          )} />
          {!isCollapsed && (
            <span>{route.label}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
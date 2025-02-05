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
            "flex items-center gap-x-2 text-sm text-gray-400 font-medium px-3 py-2 transition-all hover:text-white hover:bg-gray-700/50",
            pathname === route.href && "text-white bg-gray-700/50",
            isCollapsed ? "justify-center px-2" : "px-3"
          )}
        >
          <route.icon className={cn(
            "h-4 w-4",
            pathname === route.href ? "text-white" : "text-gray-400"
          )} />
          {!isCollapsed && (
            <span>{route.label}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
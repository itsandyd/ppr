"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const MusicNavbar = () => {
  const pathname = usePathname();

  const routes = [
    {
      icon: Home,
      label: "Home",
      href: "/spotify/dashboard",
    },
    {
      icon: Search,
      label: "Search",
      href: "/spotify/search",
    },
    {
      icon: Library,
      label: "Your Library",
      href: "/spotify/library",
    },
    {
      icon: Plus,
      label: "Create Playlist",
      href: "/spotify/create",
    },
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-black">
      <div className="flex items-center gap-x-4">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-x-2 hover:bg-white/10",
                pathname === route.href ? "text-white" : "text-neutral-400"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span className="font-medium">{route.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}; 
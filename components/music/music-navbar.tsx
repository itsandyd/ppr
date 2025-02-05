"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MusicNavbar() {
  const pathname = usePathname();

  const routes = [
    {
      icon: Home,
      label: "Home",
      href: "/music/dashboard",
    },
    {
      icon: Search,
      label: "Search",
      href: "/music/search",
    },
    {
      icon: Library,
      label: "Your Library",
      href: "/music/library",
    },
    {
      icon: Plus,
      label: "Create Playlist",
      href: "/music/playlists/create",
    },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === route.href ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <route.icon className="h-4 w-4 mr-2" />
            {route.label}
          </Link>
        ))}
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {routes.map((route) => (
              <DropdownMenuItem key={route.href} asChild>
                <Link href={route.href} className="flex items-center">
                  <route.icon className="h-4 w-4 mr-2" />
                  {route.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
} 
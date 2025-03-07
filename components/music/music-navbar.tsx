"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus, Menu } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../community/mode-toggle";
import { MusicMobileSidebar } from "./mobile-sidebar";

export function MusicNavbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const routes = [
    {
      label: "Home",
      href: "/music",
    },
    {
      label: "Dashboard",
      href: "/music/dashboard",
    },
    {
      label: "Songs",
      href: "/music/songs",
    },
    {
      label: "Playlists",
      href: "/music/playlists",
    },
  ];

  return (
    <nav className="p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10 relative">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <MusicMobileSidebar />
        </div>
        {/* <Link href="/music" className="font-semibold text-xl mr-4">
          PausePlayRepeat
        </Link> */}
        {/* <div className="hidden md:flex items-center gap-x-2">
          {routes.map((route) => (
            <Link 
              key={route.href} 
              href={route.href}
            >
              <Button 
                variant="ghost" 
                className={cn(
                  "rounded-full", 
                  pathname === route.href 
                    ? "bg-black/10 dark:bg-white/10" 
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {route.label}
              </Button>
            </Link>
          ))}
        </div> */}
      </div>
      
      <div className="flex items-center gap-x-2">
        {isSignedIn ? (
          <>
            <Link href="/profile">
              <Button variant="ghost" className="rounded-full">
                Profile
              </Button>
            </Link>
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <Link href="/sign-up">
              <Button variant="ghost" className="rounded-full">
                Sign up
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full">
                Log in
              </Button>
            </Link>
            <ModeToggle />
          </>
        )}
      </div>
    </nav>
  );
} 
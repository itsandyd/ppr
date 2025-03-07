"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MusicMobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "@/components/community/mode-toggle";

export function SiteHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <MusicMobileSidebar />
        <div className="hidden md:flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-100 dark:bg-black/50 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-black/70"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-100 dark:bg-black/50 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-black/70"
            onClick={() => window.history.forward()}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {isSignedIn ? (
          <>
            <Link href="/profile">
              <Button variant="ghost" className="hidden sm:flex text-gray-700 dark:text-zinc-200 hover:text-gray-900 dark:hover:text-white rounded-full">
                Profile
              </Button>
            </Link>
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <Link href="/sign-up">
              <Button variant="ghost" className="text-gray-700 dark:text-zinc-200 hover:text-gray-900 dark:hover:text-white rounded-full">
                Sign up
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-4 sm:px-6">
                Log in
              </Button>
            </Link>
            <ModeToggle />
          </>
        )}
      </div>
    </header>
  );
}


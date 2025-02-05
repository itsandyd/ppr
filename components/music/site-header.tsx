"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={() => window.history.forward()}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-x-2">
        {isSignedIn ? (
          <>
            <Link href="/profile">
              <Button variant="ghost" className="text-zinc-200 hover:text-white rounded-full">
                Profile
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <Link href="/sign-up">
              <Button variant="ghost" className="text-zinc-200 hover:text-white rounded-full">
                Sign up
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-white text-black hover:bg-zinc-100 rounded-full px-6">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}


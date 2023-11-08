"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { UserButton, useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../community/mode-toggle";
// import { LandingMobileSidebar } from "./landing-mobile-navbar";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const MusicNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
    <nav className="p-4 bg-transparent flex items-center justify-between">
    {/* <LandingMobileSidebar /> */}
      <Link href="/" className="flex items-center">
        <h1 className={cn("text-2xl font-bold p-2", font.className)}>
          PausePlayRepeat.com
        </h1>
      </Link>
      <div>
        {/* Other links... */}
        {/* <Link href="/spotify">
            <Button variant="ghost" className="rounded-full">
                Spotify
            </Button>
        </Link> */}
        <Link href="/spotify/dashboard">
            <Button variant="ghost" className="rounded-full">
                Dashboard
            </Button>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
    </>
  )
}
"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { UserButton, useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../community/mode-toggle";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        {/* <div className="relative h-8 w-8 mr-4">
          <Image fill alt="Logo" src="/ppr.svg" />
        </div> */}
        {/* <Image
        src="./ppr.svg" // Path of your image
        alt="Description of image" // Alt text for your image
        width={50} // Desired width
        height={100} // Desired height
      /> */}
      <h1 className={cn("text-2xl font-bold p-2", font.className)}>
          PausePlayRepeat.com
        </h1>
      </Link>
      <div>
        <Link href="/sounds">
            <Button variant="ghost" className="rounded-full">
                Sounds
            </Button>
        </Link>
        <Link href="/academy">
            <Button variant="ghost" className="rounded-full">
                Academy
            </Button>
        </Link>
        <Link href="/community">
            <Button variant="ghost" className="rounded-full">
                Community
            </Button>
        </Link>
        {/* <Link href="/dashboard">
            <Button variant="ghost" className="rounded-full">
                Dashboard
            </Button>
        </Link> */}
        <Link href="/ai/dashboard">
            <Button variant="ghost" className="rounded-full">
                AI
            </Button>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        {/* <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="outline" className="rounded-full">
            Get Started
          </Button>
        </Link> */}
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  )
}
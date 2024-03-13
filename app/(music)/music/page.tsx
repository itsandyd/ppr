/**
 * v0 by Vercel.
 * @see https://v0.dev/t/agYn8qiUbZD
 */
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { TrackListing } from "@/components/music/TrackListing"

export default function Component() {

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[240px_1fr]">
      <nav className="hidden lg:flex flex-col gap-4 p-4 border-r bg-zinc-100/40 dark:bg-zinc-800/40">
        <div className="grid gap-2">
          <Link className="font-semibold" href="#">
            Library
          </Link>
          <Link className="font-semibold" href="#">
            Playlists
          </Link>
          <Link className="font-semibold" href="#">
            Albums
          </Link>
          <Link className="font-semibold" href="#">
            Artists
          </Link>
          <Link className="font-semibold" href="#">
            Settings
          </Link>
        </div>
      </nav>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
          <Link className="lg:hidden" href="#">
            <IconMountain className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex-1 flex justify-between">
            <div className="flex gap-4">
              <Link className="font-semibold" href="#">
                Home
              </Link>
              <Link className="font-semibold" href="#">
                Discover
              </Link>
              <Link className="font-semibold" href="#">
                Community
              </Link>
              <Link className="font-semibold" href="#">
                Profile
              </Link>
            </div>
            <div className="flex items-center gap-2">
                <UserButton />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
         <TrackListing />
        </main>
      </div>
    </div>
  )
}

function IconMountain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function IconPlay(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

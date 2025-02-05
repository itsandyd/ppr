import Link from "next/link"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/music/site-header"
import { SidebarNav } from "@/components/music/sidebar-nav"
import { db } from "@/lib/db"

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const songs = await db.song.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <div
            className="rounded-xl p-8 mb-8"
            style={{
              background: "linear-gradient(to bottom, rgba(176, 216, 243, 0.2) 0%, rgba(0,0,0,1) 100%)",
            }}
          >
            <h1 className="text-3xl font-bold mb-4">Send your music for promotion</h1>
            <Link href="/profile/edit">
              <Button className="bg-[#BAE6FD] text-black hover:bg-[#93C5FD] rounded-full px-6">
                Edit Your Profile
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Newest songs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {songs.map((song) => (
                <Link key={song.id} href={`/music/songs/${song.id}`} className="block">
                  <div className="bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-800/50 transition">
                    <h3 className="font-semibold">{song.title}</h3>
                    <p className="text-zinc-400">{song.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Button className="bg-[#BAE6FD] text-black hover:bg-[#93C5FD] rounded-full px-6">Submit Your Music</Button>
        </div>
      </main>
    </div>
  )
}


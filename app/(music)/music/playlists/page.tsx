import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { PlaylistGrid } from "@/components/music/playlist-grid"
import { db } from "@/lib/db"

export default async function PlaylistsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const playlists = await db.playlist.findMany({
    where: {
      userId,
    },
    include: {
      songs: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  }).then(playlists => playlists.map(playlist => ({
    id: playlist.id.toString(),
    name: playlist.name,
    description: null,
    songs: playlist.songs
  })));

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
            <h1 className="text-3xl font-bold">Your Playlists</h1>
          </div>

          <PlaylistGrid data={playlists} />
        </div>
      </main>
    </div>
  )
}


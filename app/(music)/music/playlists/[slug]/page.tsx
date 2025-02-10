import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { PlaylistDetails } from "@/components/music/playlist-details"
import { db } from "@/lib/db"

export default async function PlaylistPage({ params }: { params: { slug: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const playlist = await db.playlist.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      songs: true
    }
  });

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <SidebarNav />
        <main className="flex-1">
          <SiteHeader />
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Playlist Not Found</h2>
              <p className="text-zinc-400 mt-2">The playlist you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <PlaylistDetails playlist={playlist} />
        </div>
      </main>
    </div>
  )
} 
import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { PlaylistGrid } from "@/components/music/playlist-grid"
import { SongGrid } from "@/components/music/song-grid"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"

export default async function Home() {
  // Fetch recent songs
  const recentSongs = await db.song.findMany({
    take: 6,
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      // Only show public songs if you have that setting
    }
  });

  // Fetch recent playlists
  const recentPlaylists = await db.playlist.findMany({
    take: 6,
    where: {
      isPublic: true,
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
    description: playlist.description,
    songs: playlist.songs,
    slug: playlist.slug
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
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">Elevate Your Music Journey</h1>
            <p className="text-xl text-zinc-300 mb-8">
              Pauseplayrepeat is more than just a music app – it&apos;s a thriving community where artists and fans connect
              through the universal language of music.
            </p>
            <Link href="/music/submit">
              <Button size="lg" className="bg-[#BAE6FD] text-black hover:bg-[#93C5FD] rounded-full px-8 py-6 text-lg font-medium">
                <Upload className="w-5 h-5 mr-2" />
                Submit Your Music
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Songs</h2>
              <SongGrid data={recentSongs} />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Playlists</h2>
              <PlaylistGrid data={recentPlaylists} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


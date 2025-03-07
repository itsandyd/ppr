import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { PlaylistGrid } from "@/components/music/playlist-grid"
import { SongGrid } from "@/components/music/song-grid"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <div
            className={cn(
              "rounded-xl p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden",
              "bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-black"
            )}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 md:mb-4 text-gray-900 dark:text-white">
              Elevate Your Music Journey
            </h1>
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-4 md:mb-8">
              Pauseplayrepeat is more than just a music app – it&apos;s a thriving community where artists and fans connect
              through the universal language of music.
            </p>
            <Link href="/music/submit">
              <Button 
                size="lg" 
                className={cn(
                  "bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700",
                  "text-blue-900 dark:text-blue-100",
                  "rounded-full px-6 md:px-8 py-2 md:py-6 text-sm md:text-lg font-medium"
                )}
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Submit Your Music
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Songs</h2>
              <SongGrid data={recentSongs} />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Playlists</h2>
              <PlaylistGrid data={recentPlaylists} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


import Link from "next/link"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/music/site-header"
import { SidebarNav } from "@/components/music/sidebar-nav"
import { db } from "@/lib/db"
import { ListMusic, Music, PlayCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const songs = await db.song.findMany({
    take: 4,
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const playlists = await db.playlist.findMany({
    take: 4,
    where: {
      userId,
    },
    include: {
      songs: {
        take: 1,
      },
    },
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Your Songs</h2>
                <p className="text-zinc-400 text-sm">Your most recent songs</p>
              </div>
              <Link href="/music/submit">
                <Button className="bg-[#BAE6FD] text-black hover:bg-[#93C5FD] rounded-full px-6">
                  <Music className="h-4 w-4 mr-2" />
                  Submit Song
                </Button>
              </Link>
            </div>
            {songs.length === 0 ? (
              <div className="text-zinc-400">No songs found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {songs.map((song) => (
                  <Link key={song.id} href={`/music/songs/${song.id}`} className="block">
                    <div className="bg-zinc-900/50 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition group">
                      <div className="relative aspect-square bg-zinc-800">
                        {song.imagePath ? (
                          <Image
                            src={song.imagePath}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircle className="h-12 w-12 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
                          <span>{song.platform || "Local"}</span>
                          <span>{formatDistanceToNow(new Date(song.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Your Playlists</h2>
                <p className="text-zinc-400 text-sm">Your most recent playlists</p>
              </div>
              <Link href="/music/playlists/create">
                <Button className="bg-[#BAE6FD] text-black hover:bg-[#93C5FD] rounded-full px-6">
                  <ListMusic className="h-4 w-4 mr-2" />
                  Create Playlist
                </Button>
              </Link>
            </div>
            {playlists.length === 0 ? (
              <div className="text-zinc-400">No playlists found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                  <Link key={playlist.id} href={`/music/playlists/${playlist.slug}`} className="block">
                    <div className="bg-zinc-900/50 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition group">
                      <div className="relative aspect-square bg-zinc-800">
                        {playlist.songs[0]?.imagePath ? (
                          <Image
                            src={playlist.songs[0].imagePath}
                            alt={playlist.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ListMusic className="h-12 w-12 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        <p className="text-zinc-400 text-sm">{playlist.songs.length} songs</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
                          <span>Created</span>
                          <span>{formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


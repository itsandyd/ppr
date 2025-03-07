"use client"

import Link from "next/link"
import { Play, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Music, PlayCircle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface PlaylistGridProps {
  data: {
    id: string;
    name: string;
    description: string | null;
    songs: any[];
    slug: string | null;
  }[];
}

export const PlaylistGrid = ({
  data = []
}: PlaylistGridProps) => {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Music className="h-10 w-10 text-gray-400 dark:text-zinc-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          No playlists found. Create your first playlist to get started!
        </p>
      </div>
    );
  }

  return (
  <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">All Playlists</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Discover curated collections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 pb-10">
        {data.map((playlist) => (
          <Card
            key={playlist.id}
            className="bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
          >
            <Link href={`/music/playlists/${playlist.slug}`}>
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-200 dark:bg-zinc-800">
                  {playlist.songs[0]?.imagePath ? (
                    <Image 
                      src={playlist.songs[0].imagePath}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-gray-400 dark:text-zinc-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 hover:bg-black/40 opacity-0 hover:opacity-100 transition-opacity group flex items-center justify-center">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add play functionality here
                      }}
                      size="icon"
                      className="rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <Play className="h-5 w-5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-3">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate text-gray-900 dark:text-white">
                      {playlist.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 dark:text-gray-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/music/playlists/${playlist.slug}/edit`);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                  </p>
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}


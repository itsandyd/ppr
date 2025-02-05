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
  }[];
}

export const PlaylistGrid = ({
  data = []
}: PlaylistGridProps) => {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Music className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm text-center">
          No playlists found. Create your first playlist to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">All Playlists</h2>
          <p className="text-sm text-zinc-400">Discover curated collections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.map((playlist) => (
          <Card
            key={playlist.id}
            className="group cursor-pointer transition overflow-hidden border rounded-lg"
            onClick={() => router.push(`/music/playlists/${playlist.id}`)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted">
                {playlist.songs[0]?.imagePath ? (
                  <Image
                    src={playlist.songs[0].imagePath}
                    alt={playlist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start p-2">
              <p className="font-semibold truncate w-full">
                {playlist.name}
              </p>
              <p className="text-sm text-muted-foreground truncate w-full">
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


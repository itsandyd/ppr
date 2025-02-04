"use client"

import Link from "next/link"
import { Play, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// This would typically come from your database
const songs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Wave",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    title: "Neon Lights",
    artist: "Electric Echo",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    title: "Ocean Breeze",
    artist: "Coastal Vibes",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    title: "Urban Jungle",
    artist: "City Sounds",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    title: "Starry Night",
    artist: "Cosmic Harmony",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    title: "Desert Mirage",
    artist: "Oasis Dreams",
    image: "/placeholder.svg?height=400&width=400",
  },
  // Add more songs as needed
]

export function MusicGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">All Songs</h2>
          <p className="text-sm text-zinc-400">Explore our music collection</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {songs.map((song) => (
          <div key={song.id} className="group relative">
            <Link href={`/music/songs/${song.id}`}>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img src={song.image || "/placeholder.svg"} alt={song.title} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    className="rounded-full bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold text-sm truncate">{song.title}</h3>
                <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
              </div>
            </Link>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>View Artist</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


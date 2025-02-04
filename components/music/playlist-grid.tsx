"use client"

import Link from "next/link"
import { Play, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// This would typically come from your database
const playlists = [
  {
    id: 1,
    title: "Chill Vibes",
    creator: "MoodMaster",
    songCount: 25,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    title: "Workout Mix",
    creator: "FitnessFreak",
    songCount: 40,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    title: "Road Trip Anthems",
    creator: "Wanderlust",
    songCount: 50,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    title: "90s Nostalgia",
    creator: "RetroLover",
    songCount: 35,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    title: "Jazz Classics",
    creator: "SmoothOperator",
    songCount: 30,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    title: "Indie Discoveries",
    creator: "HipsterVibes",
    songCount: 45,
    image: "/placeholder.svg?height=400&width=400",
  },
]

export function PlaylistGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">All Playlists</h2>
          <p className="text-sm text-zinc-400">Discover curated collections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="group relative">
            <Link href={`/music/playlists/${playlist.id}`}>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={playlist.image || "/placeholder.svg"}
                  alt={playlist.title}
                  className="object-cover w-full h-full"
                />
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
                <h3 className="font-semibold text-sm truncate">{playlist.title}</h3>
                <p className="text-zinc-400 text-xs truncate">By {playlist.creator}</p>
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
                  <DropdownMenuItem>Add to Library</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>View Creator</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


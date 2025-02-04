"use client"

import { useState } from "react"
import { Play, Pause, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Song {
  id: number
  title: string
  artist: string
  duration: string
}

interface PlaylistDetailsProps {
  id: number
  title: string
  creator: string
  description: string
  songCount: number
  image: string
  songs: Song[]
}

export function PlaylistDetails({ id, title, creator, description, songCount, image, songs }: PlaylistDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-6">
        <img src={image || "/placeholder.svg"} alt={title} className="w-48 h-48 object-cover rounded-lg shadow-lg" />
        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-zinc-400 mb-1">Created by {creator}</p>
          <p className="text-zinc-500 mb-4">{songCount} songs</p>
          <Button
            size="lg"
            className="rounded-full bg-green-500 text-white hover:bg-green-600"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      {description && <p className="text-zinc-400">{description}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">
              <Clock className="h-4 w-4" />
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song, index) => (
            <TableRow key={song.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell className="text-right">{song.duration}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


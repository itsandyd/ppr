"use client"

import { useState } from "react"
import { Play, Pause, Clock, MoreHorizontal, ListMusic, Mail, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"

interface PlaylistDetailsProps {
  playlist: {
    id: string;
    name: string;
    description: string | null;
    genre: string | null;
    mood: string | null;
    isPublic: boolean;
    contactEmail: string | null;
    submissionEnabled: boolean;
    submissionGuidelines: string | null;
    createdAt: Date;
    songs: Array<{
      id: string;
      title: string;
      artist: string;
      duration: number;
      imagePath: string | null;
    }>;
    imagePath: string | null;
  }
}

export function PlaylistDetails({ playlist }: PlaylistDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(false)


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative aspect-square w-full md:w-[300px] rounded-lg overflow-hidden">
          <Image
            src={playlist.imagePath || "/images/playlist-default.png"}
            alt={playlist.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{playlist.name}</h1>
              {playlist.isPublic ? (
                <Globe className="h-5 w-5 text-zinc-400" />
              ) : (
                <Lock className="h-5 w-5 text-zinc-400" />
              )}
            </div>
            {playlist.description && (
              <p className="text-zinc-400 mt-2">{playlist.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {playlist.genre && (
              <div className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                {playlist.genre}
              </div>
            )}
            {playlist.mood && (
              <div className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                {playlist.mood}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <div className="flex items-center gap-1">
              <ListMusic className="h-4 w-4" />
              {playlist.songs.length} songs
            </div>
            <div>
              Created {formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}
            </div>
          </div>

          {playlist.submissionEnabled && (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-zinc-400 mt-1" />
                <div>
                  <h3 className="font-semibold">Submissions Enabled</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Contact {playlist.contactEmail} to submit songs to this playlist.
                  </p>
                  {playlist.submissionGuidelines && (
                    <div className="mt-2 text-sm">
                      <h4 className="font-semibold">Guidelines:</h4>
                      <p className="text-zinc-400">{playlist.submissionGuidelines}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Songs</h2>
        {playlist.songs.length === 0 ? (
          <p className="text-zinc-400">No songs in this playlist yet.</p>
        ) : (
          <div className="space-y-2">
            {playlist.songs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900/50 transition"
              >
                <div className="w-8 text-center text-zinc-400">{index + 1}</div>
                <div className="relative h-12 w-12 rounded overflow-hidden">
                  <Image
                    src={song.imagePath || "/images/song-default.png"}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
                </div>
                <div className="text-zinc-400">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


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
        <div className="relative w-full max-w-[300px] mx-auto md:mx-0 md:w-[300px] aspect-square rounded-lg overflow-hidden">
          <Image
            src={playlist.imagePath || "/images/playlist-default.png"}
            alt={playlist.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            priority
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-4 mt-4 md:mt-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold break-words">{playlist.name}</h1>
              {playlist.isPublic ? (
                <Globe className="h-5 w-5 text-zinc-400 flex-shrink-0" />
              ) : (
                <Lock className="h-5 w-5 text-zinc-400 flex-shrink-0" />
              )}
            </div>
            {playlist.description && (
              <p className="text-zinc-400 mt-2 text-sm md:text-base">{playlist.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {playlist.genre && (
              <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs md:text-sm">
                {playlist.genre}
              </div>
            )}
            {playlist.mood && (
              <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs md:text-sm">
                {playlist.mood}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-zinc-400">
            <div className="flex items-center gap-1">
              <ListMusic className="h-4 w-4 flex-shrink-0" />
              <span>{playlist.songs.length} songs</span>
            </div>
            <div className="flex-wrap">
              Created {formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}
            </div>
          </div>

          {playlist.submissionEnabled && (
            <Card className="p-3 md:p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-zinc-400 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm md:text-base">Submissions Enabled</h3>
                  <p className="text-xs md:text-sm text-zinc-400 mt-1 break-words">
                    Contact {playlist.contactEmail} to submit songs to this playlist.
                  </p>
                  {playlist.submissionGuidelines && (
                    <div className="mt-2 text-xs md:text-sm">
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
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Songs</h2>
        {playlist.songs.length === 0 ? (
          <p className="text-zinc-400 text-sm md:text-base">No songs in this playlist yet.</p>
        ) : (
          <div className="space-y-2">
            {playlist.songs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-zinc-900/50 transition"
              >
                <div className="w-6 md:w-8 text-center text-zinc-400 text-xs md:text-sm">{index + 1}</div>
                <div className="relative h-10 w-10 md:h-12 md:w-12 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={song.imagePath || "/images/song-default.png"}
                    alt={song.title}
                    fill
                    sizes="(max-width: 768px) 40px, 48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm md:text-base">{song.title}</div>
                  <div className="text-xs md:text-sm text-zinc-400 truncate">{song.artist}</div>
                </div>
                <div className="text-zinc-400 text-xs md:text-sm whitespace-nowrap">
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


"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface SongDetailsProps {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  image: string
}

export function SongDetails({ id, title, artist, album, duration, image }: SongDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <img src={image || "/placeholder.svg"} alt={title} className="w-64 h-64 object-cover rounded-lg shadow-lg" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-zinc-400 mb-4">{artist}</p>
          <p className="text-zinc-500">Album: {album}</p>
          <p className="text-zinc-500">Duration: {duration}</p>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button size="icon" variant="ghost">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="rounded-full bg-white text-black hover:bg-zinc-200 h-12 w-12"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button size="icon" variant="ghost">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
            <Volume2 className="h-5 w-5 text-zinc-400" />
            <Slider defaultValue={[75]} max={100} step={1} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}


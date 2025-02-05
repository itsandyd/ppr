"use client"

import Image from "next/image"
import { Song } from "@prisma/client"
import { PlayCircle, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SongDetailsProps {
  data: Song
}

export const SongDetails = ({
  data
}: SongDetailsProps) => {
  return (
    <Card className="p-6 w-full">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative aspect-square w-full md:w-[300px] rounded-lg overflow-hidden">
          {data.imagePath ? (
            <Image
              src={data.imagePath}
              alt={data.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <PlayCircle className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{data.title}</h1>
              <p className="text-xl text-muted-foreground">{data.artist}</p>
            </div>
            <div className="flex items-center gap-x-2">
              {data.url ? (
                <Button
                  size="lg"
                  className="w-fit gap-x-2"
                  onClick={() => window.open(data.url || "", "_blank")}
                >
                  <PlayCircle className="h-5 w-5" />
                  Play on {data.platform}
                </Button>
              ) : data.url ? (
                <Button
                  size="lg"
                  className="w-fit gap-x-2"
                  onClick={() => {
                    const audio = document.getElementById("audio-player") as HTMLAudioElement;
                    if (audio) {
                      audio.play();
                    }
                  }}
                >
                  <PlayCircle className="h-5 w-5" />
                  Play
                </Button>
              ) : null}
              <Button
                size="lg"
                variant="outline"
                className="w-fit gap-x-2"
                onClick={() => {
                  // Implement share functionality
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
          {data.url && (
            <div className="mt-6">
              <audio
                id="audio-player"
                controls
                className="w-full"
                src={data.url || undefined}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}


"use client";

import Image from "next/image";
import { Song } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

interface SongGridProps {
  data: Song[];
}

export const SongGrid = ({
  data
}: SongGridProps) => {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">
          No songs found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
      {data.map((item) => (
        <Card
          key={item.id}
          className="group cursor-pointer transition overflow-hidden border rounded-lg"
          onClick={() => router.push(`/music/songs/${item.id}`)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-square">
              {item.imagePath ? (
                <Image
                  src={item.imagePath}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <PlayCircle className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start p-2">
            <p className="font-semibold truncate w-full">
              {item.title}
            </p>
            <p className="text-sm text-muted-foreground truncate w-full">
              {item.author}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}; 
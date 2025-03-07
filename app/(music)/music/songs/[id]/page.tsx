import { SiteHeader } from "@/components/music/site-header";
import { SidebarNav } from "@/components/music/sidebar-nav";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Play, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface SongPageProps {
  params: {
    id: string;
  };
}

export default async function SongPage({
  params
}: SongPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // First try to find the song without the userId constraint
  const song = await db.song.findUnique({
    where: {
      id: params.id
    }
  });

  if (!song) {
    redirect('/music/songs');
  }

  // Check if this is the user's song
  const isOwner = song.userId === userId;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <div
            className={cn(
              "rounded-xl p-6 md:p-8 mb-6 md:mb-8",
              "bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-black"
            )}
          >
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Song Details</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isOwner ? "View and manage your song" : "Enjoy this song"}
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900/50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative aspect-square w-full md:w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                {song.imagePath ? (
                  <Image
                    src={song.imagePath}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-gray-400 dark:text-zinc-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{song.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">{song.artist}</p>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Platform:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{song.platform || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-24">Added:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDistanceToNow(new Date(song.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    className={cn(
                      "bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700",
                      "text-blue-900 dark:text-blue-100",
                      "rounded-full px-6 py-2"
                    )}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play Song
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SidebarNav } from "@/components/music/sidebar-nav";
import { SiteHeader } from "@/components/music/site-header";
import { SongGrid } from "@/components/music/song-grid";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export default async function SongsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const songs = await db.song.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Music</h1>
          </div>

          <SongGrid data={songs} />
        </div>
      </main>
    </div>
  );
}


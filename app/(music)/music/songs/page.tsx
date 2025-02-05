import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SidebarNav } from "@/components/music/sidebar-nav";
import { SiteHeader } from "@/components/music/site-header";
import { SongGrid } from "@/components/music/song-grid";
import { db } from "@/lib/db";

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
    <div className="min-h-screen bg-black text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <div
            className="rounded-xl p-8 mb-8"
            style={{
              background: "linear-gradient(to bottom, rgba(176, 216, 243, 0.2) 0%, rgba(0,0,0,1) 100%)",
            }}
          >
            <h1 className="text-3xl font-bold">Your Music</h1>
          </div>

          <SongGrid data={songs} />
        </div>
      </main>
    </div>
  );
}


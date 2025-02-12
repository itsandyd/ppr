import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SongDetails } from "@/components/music/song-details";
import { SidebarNav } from "@/components/music/sidebar-nav";
import { SiteHeader } from "@/components/music/site-header";
import { db } from "@/lib/db";

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

  const song = await db.song.findUnique({
    where: {
      id: params.id,
      userId
    }
  });

  if (!song) {
    redirect('/music/songs');
  }

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
            <h1 className="text-3xl font-bold mb-2">Song Details</h1>
            <p className="text-zinc-400">View and manage your song</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <SongDetails data={song} />
          </div>
        </div>
      </main>
    </div>
  );
}


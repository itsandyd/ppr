import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SongDetails } from "@/components/music/song-details";
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
    <div className="h-full p-4 space-y-2">
      <SongDetails data={song} />
    </div>
  );
}


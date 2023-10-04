"use client";

import SongItem from "@/components/music/song-item";
// import useOnPlay from "@/hooks/music/useOnPlay";
import usePlayer from "@/hooks/music/usePlayer";
import { auth } from "@clerk/nextjs";

import { Song } from "@prisma/client";
import { redirect } from "next/navigation";

interface PageContentProps {
  songs: Song[];
}

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
//   const subscribeModal = useSubscribeModal();
  // const authModal = useAuthModal();
  // const { userId } = auth();

  const onPlay = (id: string) => {

    // if (!subscription) {
    //   return subscribeModal.onOpen();
    // }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  }

  return onPlay;
};

const MusicPageContent: React.FC<PageContentProps> = ({
  songs
}) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <div className="mt-4 text-neutral-400">
        No songs available.
      </div>
    )
  }

  return ( 
    <div 
      className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      "
    >
      {songs.map((item) => (
        <SongItem 
          onClick={(id: string) => onPlay(id)} 
          key={item.id} 
          data={item}
        />
      ))}
    </div>
  );
}
 
export default MusicPageContent;
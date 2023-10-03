

import usePlayer from "./usePlayer";
// import useSubscribeModal from "./useSubscribeModal";
// import useAuthModal from "./useAuthModal";
// import { useUser } from "./useUser";
import { Song } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
//   const subscribeModal = useSubscribeModal();
  // const authModal = useAuthModal();
  const { userId } = auth();

  const onPlay = (id: string) => {
    if (!userId) {
      return redirect('/music')
    }

    // if (!subscription) {
    //   return subscribeModal.onOpen();
    // }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  }

  return onPlay;
};

export default useOnPlay;
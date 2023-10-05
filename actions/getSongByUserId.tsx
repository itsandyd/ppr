import { Song } from "@prisma/client";
import { db } from "../lib/db"
import { useAuth } from "@clerk/nextjs";

type GetSongs = {
    userId: string;
  };


  
//   type SongWithUser = Song & {
//     user: {
//       id: string;
//       name: string | null;
//     };
//   };
  
export const getSongsByUserId = async ({ }: GetSongs) => {
    try {

      // const songs = await db.song.findMany({
      //   where: {
      //     userId: userId
      //   },

        // orderBy: {
        //   createdAt: "desc",
        // },
      // });
  
      return;
    } catch (error) {
      console.log("[GET_SONGS]", error);
      return [];
    }
};


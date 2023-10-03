import { Song } from "@prisma/client";
import { db } from "../lib/db"

type GetSongs = {
    userId: string;
  };
  
  type SongWithUser = Song & {
    user: {
      id: string;
      name: string | null;
    };
  };
  
export const getSongsByUserId = async ({
    userId,
  }: GetSongs): Promise<SongWithUser[]> => {
    try {
      const songs = await db.song.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
        },
        // orderBy: {
        //   createdAt: "desc",
        // },
      });
  
      return songs;
    } catch (error) {
      console.log("[GET_SONGS]", error);
      return [];
    }
};


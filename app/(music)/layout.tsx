// import { Figtree } from 'next/font/google'
// import UserProvider from '@/providers/UserProvider'
// import ModalProvider from '@/providers/ModalProvider'
// import { SpotifyProvider } from '@/providers/SpotifyProvider';
// import './globals.css'
import Player from '@/components/music/player'
import Sidebar from '@/components/music/sidebar'
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';

// const font = Figtree({ subsets: ['latin'] })
export const revalidate = 0;

const MusicLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {

  const { userId } = auth();

  try {
    const userSongs = await db.song.findMany({
      // where: {
      //   userId: userId,
      // },
      // include: {
      //   user: true,
      // },
    });

    return (
      <html lang="en">
        <body className="bg-black">
          {/* <UserProvider> */}
            {/* <ModalProvider /> */}
            {/* <SpotifyProvider> */}
              <Sidebar songs={userSongs}>
                {children}
              </Sidebar>
              <Player />
            {/* </SpotifyProvider> */}
          {/* </UserProvider> */}
        </body>
      </html>
    )
  } catch (error) {
    console.log("[GET_SONGS]", error);
    return [];
  }
}

export default MusicLayout;
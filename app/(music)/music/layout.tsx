import { Figtree } from 'next/font/google'


// import ToasterProvider from '@/providers/ToasterProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
// import SupabaseProvider from '@/providers/SupabaseProvider'
import { SpotifyProvider } from '@/providers/SpotifyProvider';
// import SpotifyAuthModal from './spotify/components/SpotifyAuthModal'

import './globals.css'
import Player from '@/components/music/player'
import Sidebar from '@/components/music/sidebar'
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify Clone',
  description: 'Spotify Clone',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { userId } = auth() 

  const userSongs = await db.song.findMany({
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

  return (
    <html lang="en">
      <body className={font.className}>
        {/* <ToasterProvider /> */}
        {/* <SupabaseProvider> */}
          <UserProvider>
            <ModalProvider />
            <SpotifyProvider> {/* Include the SpotifyProvider here */}
              {/* <SpotifyAuthModal /> Include the SpotifyAuthModal here */}
              <Sidebar songs={userSongs}>
                {children}
              </Sidebar>
              <Player />
            </SpotifyProvider>
          </UserProvider>
        {/* </SupabaseProvider> */}
      </body>
    </html>
  )
}

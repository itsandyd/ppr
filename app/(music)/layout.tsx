import { Figtree } from 'next/font/google'

import getSongsByUserId from '@/actions/getSongsByUserId'
import Sidebar from '@/components/music/Sidebar'
import ToasterProvider from '@/providers/music/ToasterProvider'
import UserProvider from '@/providers/music/UserProvider'
import ModalProvider from '@/providers/music/ModalProvider'
import SupabaseProvider from '@/providers/music/SupabaseProvider'
import { SpotifyProvider } from '@/providers/music/SpotifyProvider';
import Player from '@/components/music/Player'

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
  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
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
        </SupabaseProvider>
      </body>
    </html>
  )
}

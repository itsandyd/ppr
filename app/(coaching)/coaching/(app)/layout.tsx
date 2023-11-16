import { Nunito } from 'next/font/google'


// import LoginModal from '@/app/components/modals/LoginModal';
// import RegisterModal from '@/app/components/modals/RegisterModal';

// import RentModal from '@/app/components/modals/RentModal';

// import ToasterProvider from '@/app/providers/ToasterProvider';

// import getCurrentUser from './actions/getCurrentUser';
// import ClientOnly from '@/components/coaching/ClientOnly';

import { auth, useUser } from '@clerk/nextjs';
import Navbar from '@/components/coaching/navbar/Navbar';
import SearchModal from '@/components/coaching/modals/SearchModal';
import RentModal from '@/components/coaching/modals/RentModal';
import ClientOnly from '@/components/coaching/ClientOnly';

export const metadata = {
  title: 'PausePlayRepeat Coaching',
  description: 'Find Coaches for Music Prodiction',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    // const currentUser = auth();

  return (
    <html lang="en">
      <body>
        <ClientOnly>
          {/* <LoginModal /> */}
          {/* <RegisterModal /> */}
          <SearchModal />
          <RentModal />
          <Navbar />
        </ClientOnly>
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}
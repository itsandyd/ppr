import { Metadata } from 'next';
import CoachingRegisterModal from '@/components/coaching/modals/CoachingRegisterModal';
import ClientOnly from '@/components/coaching/ClientOnly';

export const metadata: Metadata = {
  title: 'Find Your Music Production Coach | Level Up Your Skills',
  description: 'Connect with experienced music production coaches who can elevate your skills, refine your sound, and help you achieve your musical goals.',
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientOnly>
        <CoachingRegisterModal />
      </ClientOnly>
      {children}
    </>
  );
}

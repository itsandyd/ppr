import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import Container from '@/components/coaching/Container';
import Heading from '@/components/coaching/Heading';
import ClientOnly from '@/components/coaching/ClientOnly';
import CoachDashboard from '@/components/coaching/coach-panel/CoachDashboard';
import { User } from "@clerk/nextjs/server";

export default async function CoachPanelPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect('/login');
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-8">
          <Heading
            title="Coach Panel"
            subtitle="Manage your coaching business in one place"
          />
          <div className="mt-8">
            <CoachDashboard currentUser={currentUser} />
          </div>
        </div>
      </Container>
    </ClientOnly>
  );
} 
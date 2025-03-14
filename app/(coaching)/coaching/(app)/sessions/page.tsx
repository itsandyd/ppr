import ClientOnly from "@/components/coaching/ClientOnly";
import EmptyState from "@/components/coaching/EmptyState";
import SessionsClient from "./components/SessionsClient";
import { auth } from "@clerk/nextjs";
import getReservations from "@/actions/getReservations";


const SessionsPage = async () => {

  const { userId } = auth();

  if (!userId) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorized"
          subtitle="Please login"
        />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({ userId: userId });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No sessions found"
          subtitle="Looks like you havent reserved any sessions."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <SessionsClient
        reservations={reservations}
        userId={userId}
      />
    </ClientOnly>
  );
}
 
export default SessionsPage;
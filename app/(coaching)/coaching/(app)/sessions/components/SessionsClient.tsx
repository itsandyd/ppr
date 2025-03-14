'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "@/types";
import Container from "@/components/coaching/Container";
import Heading from "@/components/coaching/Heading";
import ListingCard from "@/components/coaching/listings/ListingCard";

interface SessionsClientProps {
  reservations: SafeReservation[],
  userId?: string,
}

const SessionsClient: React.FC<SessionsClientProps> = ({
  reservations,
  userId
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/sessions/${id}`)
    .then(() => {
      toast.success('Coaching session cancelled');
      router.refresh();
    })
    .catch((error) => {
      toast.error(error?.response?.data?.error || 'Error cancelling session')
    })
    .finally(() => {
      setDeletingId('');
    })
  }, [router]);

  return (
    <Container>
      <Heading
        title="Coaching Sessions"
        subtitle="Your upcoming and past coaching sessions"
      />
      <div 
        className="
          mt-12
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {reservations.map((reservation: any) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel session"
            userId={userId}
          />
        ))}
      </div>
    </Container>
   );
}
 
export default SessionsClient;
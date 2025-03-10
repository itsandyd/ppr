import ClientOnly from "@/components/coaching/ClientOnly";
import ListingClient from "./ListingClient";
import EmptyState from "@/components/coaching/EmptyState";
import getListingById from "@/actions/getListingById";
import getReservations from "@/actions/getReservations";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getListings from "@/actions/getListings";
import AuthCheck from "@/components/coaching/AuthCheck";
import { Metadata } from 'next';

interface IParams {
  listingId?: string;
}

export async function generateMetadata({ params }: { params: IParams }): Promise<Metadata> {
  const listing = await getListingById(params);
  
  if (!listing) {
    return {
      title: 'Listing Not Found | Music Production Coaching',
      description: 'The requested coaching listing could not be found.'
    };
  }
  
  return {
    title: `${listing.title} | Music Production Coaching`,
    description: listing.description || 'View this music production coach and book your session today.',
  };
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  // const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <AuthCheck>
        <ListingClient
          listing={listing}
          reservations={reservations}
          // currentUser={currentUser || undefined}
        />
      </AuthCheck>
    </ClientOnly>
  );
}
 
export default ListingPage;
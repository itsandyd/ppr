import ClientOnly from "@/components/coaching/ClientOnly";
import ListingClient from "./ListingClient";
import EmptyState from "@/components/coaching/EmptyState";
import getListingById from "@/actions/getListingById";
import getReservations from "@/actions/getReservations";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getListings from "@/actions/getListings";

interface IParams {
  listingId?: string;
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
      <ListingClient
        listing={listing}
        reservations={reservations}
        // currentUser={currentUser || undefined}
      />
    </ClientOnly>
  );
}
 
export default ListingPage;
import getFavoriteListings from "@/actions/getFavoriteListings";
import ClientOnly from "@/components/coaching/ClientOnly";
import EmptyState from "@/components/coaching/EmptyState";
import FavoritesClient from "./components/FavoritesClient";


const ListingPage = async () => {
  const listings = await getFavoriteListings();
//   const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite coaches."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient
        listings={listings}
        // currentUser={currentUser}
      />
    </ClientOnly>
  );
}
 
export default ListingPage;
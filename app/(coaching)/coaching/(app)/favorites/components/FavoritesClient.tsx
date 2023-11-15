import Container from "@/components/coaching/Container";
import Heading from "@/components/coaching/Heading";
import ListingCard from "@/components/coaching/listings/ListingCard";
import { SafeListing, SafeUser } from "@/types";

interface FavoritesClientProps {
  listings: SafeListing[],
  userId?: string,
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings,
  userId
}) => {
  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of coaches you favorited!"
      />
      <div 
        className="
          mt-10
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
        {listings.map((listing: any) => (
          <ListingCard
            userId={userId}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
   );
}
 
export default FavoritesClient;
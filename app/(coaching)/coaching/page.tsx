

import Container from "@/components/coaching/Container";
import ListingCard from "@/components/coaching/listings/ListingCard";
// import ClientOnly from "@/components/coaching/ClientOnly";
import EmptyState from "@/components/coaching/EmptyState";
import getListings, { IListingsParams } from "@/actions/getListings";

interface HomeProps {
  searchParams: IListingsParams;
};

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);


  if (listings.length === 0) {
    return (
      // <ClientOnly>
        <EmptyState showReset />
      // </ClientOnly>
    );
  }

  return (
    // <ClientOnly>
      <Container>
        <div 
          className="
            pt-24
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

              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    // </ClientOnly>
  )
}

export default Home;
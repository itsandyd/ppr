import getListings from "@/actions/getListings";
import ClientOnly from "@/components/coaching/ClientOnly";
import EmptyState from "@/components/coaching/EmptyState";
import PropertiesClient from "./components/PropertiesClient";
import { auth } from "@clerk/nextjs";

const PropertiesPage = async () => {

    const { userId } = auth();

  if (!userId) {
    return <EmptyState
      title="Unauthorized"
      subtitle="Please login"
    />
  }

  const listings = await getListings({ userId });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No properties found"
          subtitle="Looks like you have no properties."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient
        listings={listings}
        // userId={user}
      />
    </ClientOnly>
  );
}
 
export default PropertiesPage;
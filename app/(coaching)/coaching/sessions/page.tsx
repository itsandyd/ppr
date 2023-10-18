import ClientOnly from "@/components/coaching/ClientOnly";
import EmptyState from "@/components/coaching/EmptyState";
import TripsClient from "./components/SessionsClient";








const TripsPage = async () => {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) {
//     return (
//       <ClientOnly>
//         <EmptyState
//           title="Unauthorized"
//           subtitle="Please login"
//         />
//       </ClientOnly>
//     );
//   }

//   const reservations = await getReservations({ userId: currentUser.id });

//   if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No sessions found"
          subtitle="Looks like you havent reserved any sessions."
        />
      </ClientOnly>
    );
  }

//   return (
//     <ClientOnly>
//       <TripsClient
//         reservations={reservations}
//         currentUser={currentUser}
//       />
//     </ClientOnly>
//   );
// }
 
export default TripsPage;
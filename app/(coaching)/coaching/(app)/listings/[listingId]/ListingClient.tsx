'use client';

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import { SafeListing, SafeReservation, SafeUser } from "@/types";
import useLoginModal from "@/hooks/useLoginModal";
import Container from "@/components/coaching/Container";
import ListingHead from "@/components/coaching/listings/ListingHead";
import ListingInfo, { CoachStats } from "@/components/coaching/listings/ListingInfo";
import ListingReservation from "@/components/coaching/listings/ListingReservation";
import { categories } from "@/components/coaching/navbar/Categories"
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    // user: SafeUser;
  };
  currentUser?: User | null;
  // categories: { label: string; value: string }[]; // Add this line if categories is a prop
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
  // categories,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const category = useMemo(() => {
    return categories.find((items) => 
     items.label === listing.category);
 }, [listing.category]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [discordUsername, setDiscordUsername] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const onCreateReservation = useCallback(() => {
      if (!isSignedIn) {
        return loginModal.onOpen();
      }

      // Check if user has Discord username
      const clerkDiscordUsername = user?.publicMetadata?.discordUsername as string | undefined;
      const dbDiscordUsername = currentUser?.discordUsername;
      
      if (!clerkDiscordUsername && !dbDiscordUsername) {
        setShowDiscordModal(true);
        return;
      }

      // Set end time 1 hour after start time
      if (!dateRange.startDate || !selectedTime) {
        toast.error('Please select a date and time for your session');
        return;
      }
      
      // Parse the selected time
      const timeComponents = selectedTime.match(/(\d+):(\d+)\s*([AP]M)/i);
      if (!timeComponents) {
        toast.error('Invalid time format');
        return;
      }
      
      let hours = parseInt(timeComponents[1], 10);
      const minutes = parseInt(timeComponents[2], 10);
      const ampm = timeComponents[3].toUpperCase();
      
      // Convert to 24-hour format
      if (ampm === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const bookedStartDate = new Date(dateRange.startDate);
      bookedStartDate.setHours(hours, minutes, 0, 0);
      
      const bookedEndDate = new Date(bookedStartDate);
      bookedEndDate.setHours(bookedEndDate.getHours() + 1);

      setIsLoading(true);

      axios.post('/api/coaching/reservations', {
        totalPrice,
        startDate: bookedStartDate,
        endDate: bookedEndDate,
        listingId: listing?.id
      })
      .then(() => {
        toast.success('Coaching session reserved! Check your Discord for details.');
        setDateRange(initialDateRange);
        setSelectedTime(null);
        router.push('/coaching/trips');
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Something went wrong.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
  },
  [
    totalPrice, 
    dateRange, 
    selectedTime,
    listing?.id,
    router,
    isSignedIn,
    user,
    currentUser,
    loginModal
  ]);

  const handleDiscordSubmit = useCallback(() => {
    if (!discordUsername) {
      toast.error('Please enter your Discord username');
      return;
    }

    setIsLoading(true);

    // Update user's Discord username in both Clerk metadata and database
    axios.post('/api/user/update-discord', {
      discordUsername
    })
    .then(() => {
      toast.success('Discord username saved!');
      setShowDiscordModal(false);
      // Proceed with reservation
      onCreateReservation();
    })
    .catch((error) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to save Discord username.');
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [discordUsername, onCreateReservation]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      // For coaching, we only use single-day hourly sessions
      // Set the endDate to be the same as startDate
      if (dateRange.endDate.getDate() !== dateRange.startDate.getDate()) {
        setDateRange({
          ...dateRange,
          endDate: dateRange.startDate
        });
      }
      
      // Always charge the base hourly rate for a session
      setTotalPrice(listing.price);
    }
  }, [dateRange, listing.price, selectedTime]);

  return ( 
    <Container>
      <div 
        className="
          max-w-screen-lg 
          mx-auto
          dark:text-white
          pt-36
          pb-10
        "
      >
        <div className="flex flex-col gap-6 mb-4">
          {/* Main profile section */}
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            userId={user?.id}
          />
          
          {/* Main content layout - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
            {/* Left column - Coach profile and info */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Coach stats */}
              <CoachStats
                guestCount={listing.guestCount}
                roomCount={listing.roomCount}
              />
              
              {/* Coach info */}
              <ListingInfo
                category={category}
                description={listing.description}
                roomCount={listing.roomCount}
                guestCount={listing.guestCount}
                bathroomCount={listing.bathroomCount}
                locationValue={listing.locationValue}
              />
            </div>

            {/* Booking section for mobile - Shown above coach info on mobile */}
            <div className="order-first mb-6 lg:hidden">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
                <h3 className="text-md font-semibold text-blue-800 dark:text-blue-300">Important Note</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Coaching sessions are conducted via Discord. You&apos;ll need to provide your Discord username to book a session.
                </p>
                {(() => {
                  const discordName = currentUser?.discordUsername || 
                    (user?.publicMetadata?.discordUsername as string | undefined);
                  
                  return discordName ? (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      ✓ Discord username is set: {discordName}
                    </p>
                  ) : null;
                })()}
              </div>
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>

            {/* Right column - Booking (desktop) */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
                <h3 className="text-md font-semibold text-blue-800 dark:text-blue-300">Important Note</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Coaching sessions are conducted via Discord. You&apos;ll need to provide your Discord username to book a session.
                </p>
                {(() => {
                  const discordName = currentUser?.discordUsername || 
                    (user?.publicMetadata?.discordUsername as string | undefined);
                  
                  return discordName ? (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      ✓ Discord username is set: {discordName}
                    </p>
                  ) : null;
                })()}
              </div>
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Discord Username Modal */}
      {showDiscordModal && (
        <div className="fixed inset-0 bg-neutral-800/70 z-50 flex items-center justify-center">
          <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Enter Your Discord Username</h2>
              <p className="mb-4 dark:text-neutral-300">
                Coaching sessions are conducted via Discord. Please enter your Discord username (e.g., username#1234) to continue.
              </p>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-900 dark:text-white"
                placeholder="username#1234"
              />
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowDiscordModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDiscordSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md disabled:opacity-70"
                >
                  {isLoading ? 'Saving...' : 'Save and Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
   );
}
 
export default ListingClient;
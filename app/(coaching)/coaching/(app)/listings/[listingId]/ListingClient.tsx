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
import DiscordUsernameModal from "@/components/coaching/modals/DiscordUsernameModal";

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
  const { user, isSignedIn, isLoaded } = useUser();

  const [reservedTimeSlots, setReservedTimeSlots] = useState<{[key: string]: string[]}>({});
  const [reservedServicesInfo, setReservedServicesInfo] = useState<{[key: string]: {[time: string]: string}}>({});

  const disabledDates = useMemo(() => {
    // For the calendar, we still need to know which dates have ALL slots booked
    // We'll implement this logic when we build the time slot selector
    let dates: Date[] = [];

    // Only completely disable dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dates;
  }, []);
  
  // This function checks if a specific time slot is available on a selected date
  const isTimeSlotAvailable = useCallback((date: Date, time: string) => {
    if (!date) return true;
    
    // Format date as YYYY-MM-DD for lookup
    const dateString = date.toISOString().split('T')[0];
    
    // If we have reserved slots for this date, check if this time is reserved
    return !reservedTimeSlots[dateString]?.includes(time);
  }, [reservedTimeSlots]);
  
  // Load reserved time slots when reservations change or date range changes
  useEffect(() => {
    const slots: {[key: string]: string[]} = {};
    const servicesInfo: {[key: string]: {[time: string]: string}} = {};
    
    reservations.forEach((reservation: any) => {
      const startDate = new Date(reservation.startDate);
      const dateString = startDate.toISOString().split('T')[0];
      
      // Get the time in the format "1:00 PM"
      const hours = startDate.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour = hours % 12 || 12;
      const timeString = `${hour}:00 ${ampm}`;
      
      if (!slots[dateString]) {
        slots[dateString] = [];
      }
      
      slots[dateString].push(timeString);
      
      // Track which service is booked for this slot
      if (!servicesInfo[dateString]) {
        servicesInfo[dateString] = {};
      }
      
      // Use the listing title as the service name, truncate if too long
      let serviceName = reservation.listing.title || 'Coaching Session';
      const shortServiceName = serviceName.length > 20 
        ? serviceName.substring(0, 20) + '...' 
        : serviceName;
        
      // Add listing ID to easily identify if it's this listing or another
      if (reservation.listingId === listing.id) {
        serviceName = `${shortServiceName} (This Service)`;
      } else {
        serviceName = shortServiceName;
      }
      
      servicesInfo[dateString][timeString] = serviceName;
    });
    
    setReservedTimeSlots(slots);
    setReservedServicesInfo(servicesInfo);
  }, [reservations, listing.id]);

  const category = useMemo(() => {
    return categories.find((items) => 
     items.label === listing.category);
 }, [listing.category]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const onCreateReservation = useCallback(() => {
    // Log authentication state for debugging
    console.log('Auth state:', { 
      isSignedIn, 
      user: !!user, 
      currentUser: !!currentUser,
      userId: user?.id,
      isLoaded
    });

    // Check if user data is loaded first
    if (!isLoaded) {
      console.log('User data is still loading');
      toast.error('Connecting to your account...');
      return;
    }

    if (!isSignedIn || !user) {
      toast.error('Please sign in to reserve a session');
      return loginModal.onOpen();
    }

    // Check if user has connected Discord
    const hasDiscordConnection = user?.externalAccounts?.some(
      account => account.provider.toLowerCase().includes('discord')
    );
    
    // Check if we have a Discord username in metadata (this means they've gone through our verification process)
    const hasDiscordUsername = typeof user?.publicMetadata?.discordUsername === 'string' && 
                              user.publicMetadata.discordUsername.length > 0;
    
    console.log('Discord check:', { 
      hasDiscordConnection, 
      hasDiscordUsername,
      discordUsername: user?.publicMetadata?.discordUsername,
      discordVerified: user?.publicMetadata?.discordVerified,
      discordId: user?.publicMetadata?.discordId,
      publicMetadata: user?.publicMetadata,
      externalAccounts: user?.externalAccounts,
      dbUsername: currentUser?.discordUsername,
      dbVerified: currentUser?.discordVerified
    });
    
    // Allow booking if either condition is met
    if (!hasDiscordConnection && !hasDiscordUsername) {
      console.log('Discord not connected - opening Discord modal');
      toast.error('Please connect your Discord account to continue');
      setShowDiscordModal(true);
      return;
    }

    // Only check verification if we have a Discord connection
    if (hasDiscordConnection) {
      // Check if the Discord account has been verified through our API
      const discordVerifiedInClerk = user?.publicMetadata?.discordVerified === true;
      
      if (!discordVerifiedInClerk) {
        console.log('Discord not verified in Clerk metadata - opening Discord modal');
        toast.error('Please verify your Discord account to continue');
        setShowDiscordModal(true);
        return;
      }
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
      console.error('Failed to parse time:', selectedTime);
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

    console.log('Booking session:', {
      totalPrice,
      startDate: bookedStartDate,
      endDate: bookedEndDate,
      listingId: listing?.id
    });

    setIsLoading(true);

    axios.post('/api/coaching/reservations', {
      totalPrice,
      startDate: bookedStartDate,
      endDate: bookedEndDate,
      listingId: listing?.id
    })
    .then((response) => {
      console.log('Reservation created:', response.data);
      toast.success('Coaching session reserved! Check your Discord for details.');
      setDateRange(initialDateRange);
      setSelectedTime(null);
      router.push('/coaching/sessions');
    })
    .catch((error) => {
      console.error('Reservation error:', error);
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
    loginModal,
    isLoaded
  ]);

  const handleDiscordSubmit = useCallback(() => {
    setShowDiscordModal(false);
    // Discord username is now saved, proceed with reservation
    onCreateReservation();
  }, [onCreateReservation]);

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
          pt-16
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
              
              {/* Shared schedule info */}
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                <h3 className="text-md font-semibold text-amber-800 dark:text-amber-300">Shared Schedule</h3>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  This coach may offer multiple services. Their schedule is shared across all offerings to avoid double bookings.
                </p>
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
                reservedTimeSlots={reservedTimeSlots}
                isTimeSlotAvailable={isTimeSlotAvailable}
                reservedServicesInfo={reservedServicesInfo}
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
              
              {/* Shared schedule info */}
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                <h3 className="text-md font-semibold text-amber-800 dark:text-amber-300">Shared Schedule</h3>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  This coach may offer multiple services. Their schedule is shared across all offerings to avoid double bookings.
                </p>
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
                reservedTimeSlots={reservedTimeSlots}
                isTimeSlotAvailable={isTimeSlotAvailable}
                reservedServicesInfo={reservedServicesInfo}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Discord Username Modal */}
      {showDiscordModal && (
        <DiscordUsernameModal
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
          onSuccess={handleDiscordSubmit}
        />
      )}
    </Container>
   );
}
 
export default ListingClient;
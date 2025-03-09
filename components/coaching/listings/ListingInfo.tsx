'use client';

import dynamic from "next/dynamic";
import { IconType } from "react-icons";

import Avatar from "../Avatar";
import { SafeUser } from "@/types";
import useCountries from "@/hooks/useCountries";
import CategoryView from "./ListingCategory";

const Map = dynamic(() => import('../Map'), { 
  ssr: false 
});

interface ListingInfoProps {
  // user: SafeUser,
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: {
    icon: IconType,
    label: string;
    description: string;
  } | undefined
  locationValue: string;
}

// Separate component for experience badges to be used outside ListingInfo
export const CoachStats: React.FC<{
  guestCount: number;
  roomCount: number;
}> = ({ guestCount, roomCount }) => {
  return (
    <div className="
      flex 
      flex-col
      gap-2 
      w-full
    ">
      <div className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 rounded-md text-center text-sm">
        <span className="font-semibold">{guestCount}+</span> clients coached
      </div>
      <div className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 rounded-md text-center text-sm">
        <span className="font-semibold">{roomCount}+</span> years experience
      </div>
    </div>
  );
};

const ListingInfo: React.FC<ListingInfoProps> = ({
  // user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng
  const location = getByValue(locationValue);

  return ( 
    <div className="w-full flex flex-col gap-5">
      {/* Category section */}
      {category && (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium mb-2">Specialty</h3>
          <CategoryView
            icon={category.icon} 
            label={category?.label}
            description={category?.description} 
          />
        </div>
      )}
      
      {/* About section */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-medium mb-2">About This Coach</h3>
        <div className="text-base font-light text-neutral-500 dark:text-neutral-400">
          {description}
        </div>
      </div>
      
      {/* Location section */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-medium mb-2">Coach Location</h3>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          Sessions are remote via Discord, but the coach is based in {location?.label}, {location?.region}.
        </div>
        <div className="h-[200px] rounded-md overflow-hidden">
          <Map center={coordinates} />
        </div>
      </div>
    </div>
   );
}
 
export default ListingInfo;
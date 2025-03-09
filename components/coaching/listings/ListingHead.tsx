'use client';

import Image from "next/image";
import { useState } from "react";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import useCountries from "@/hooks/useCountries";
import { SafeUser } from "@/types";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  imageSrc: string;
  id: string;
  userId?: string
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  userId
}) => {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  const placeholderImage = "/images/placeholder.jpg"; // Default placeholder path
  const hasValidImage = imageSrc && imageSrc.trim() !== '';
  
  return ( 
    <div className="flex flex-col md:flex-row gap-6 pb-2">
      {/* Profile Image Column */}
      <div className="md:w-1/4 w-full">
        <div className="
            w-full
            h-[250px] md:h-auto
            aspect-[1/1]
            overflow-hidden 
            rounded-xl
            relative
            mb-2
            bg-neutral-200
            dark:bg-neutral-800
            shadow-sm
          "
        >
          {!hasValidImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mb-4 opacity-50"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-lg font-medium">No Image Available</p>
              <p className="text-sm mt-2">Coach profile image will appear here</p>
            </div>
          ) : (
            <Image
              src={imageSrc}
              fill
              className="object-cover w-full"
              alt={`${title} - Coach Profile`}
              unoptimized={!imageSrc.startsWith('https://')}
              priority
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          )}
          
          {userId && (
            <div
              className="
                absolute
                top-3
                right-3
                z-10
              "
            >
              <HeartButton 
                listingId={id}
                userId={userId}
              />
            </div>
          )}
        </div>
      </div>

      {/* Coach Info Column */}
      <div className="md:w-3/4 flex flex-col justify-center">
        <Heading
          title={title}
          subtitle={location ? `${location.region}, ${location.label}` : "Online Coaching"}
        />
      </div>
    </div>
  );
}
 
export default ListingHead;
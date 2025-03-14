'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { format } from 'date-fns';

import { 
  SafeListing, 
  SafeReservation, 
  SafeUser 
} from "@/types";

import Button from "../Button";
import ClientOnly from "../ClientOnly";
import useCountries from "@/hooks/useCountries";
import HeartButton from "../HeartButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  userId?: string;
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  userId,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  
  const location = getByValue(data.locationValue);
  
  // Check if image is available
  const hasValidImage = data.imageSrc && data.imageSrc.trim() !== '';
  const placeholderImage = "/images/placeholder.jpg";
  
  const handleClick = () => {
    // Log the path and listing ID for debugging
    const path = `/coaching/listings/${data.id}`;
    console.log('Navigating to listing page:', { id: data.id, path });

    router.push(path);
  };

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId)
  }, [disabled, onAction, actionId]);

  const price = useMemo(() => {
    // For reservations, try to use totalPrice first
    if (reservation) {
      // If totalPrice exists and is a number, use it
      if (typeof reservation.totalPrice === 'number' && !isNaN(reservation.totalPrice)) {
        return reservation.totalPrice;
      }
      
      // If we can't get totalPrice from reservation, fall back to the listing price
      // This shouldn't happen with proper data, but provides a safety net
      console.warn('Reservation missing totalPrice, using listing price instead');
      return data.price;
    }

    // For listings, just use the listing price
    return data.price;
  }, [reservation, data.price]);

  // Format price with proper decimal places - ensure it's always a number
  const formattedPrice = useMemo(() => {
    // Since price is an Int in the schema, we can safely convert it to a number
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  }, [price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }
  
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  // Format session time for reservations
  const sessionTime = useMemo(() => {
    if (!reservation) return null;
    
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  }, [reservation]);

  // Create truncated description for the card
  const truncatedDescription = data.description && data.description.length > 100 
    ? `${data.description.substring(0, 100)}...` 
    : data.description;

  // Determine if price is hourly or total
  const isPriceHourly = useMemo(() => {
    return !reservation;
  }, [reservation]);

  // Create a user-friendly price label
  const priceLabel = useMemo(() => {
    return isPriceHourly ? '/ hour' : 'total';
  }, [isPriceHourly]);

  return (
    <Card 
      onClick={handleClick}
      className="overflow-hidden hover:shadow-md transition cursor-pointer dark:bg-neutral-800"
    >
      <div className="relative w-full h-[220px]">
        {!hasValidImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-200 dark:bg-neutral-800">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mb-2 text-neutral-400 dark:text-neutral-500"
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
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No Image Available</p>
          </div>
        ) : (
          <Image
            fill
            className="object-cover w-full"
            src={data.imageSrc}
            alt={data.title}
            unoptimized={!data.imageSrc.startsWith('https://')}
          />
        )}
        {userId && (
          <div className="absolute top-3 right-3 z-10">
            <HeartButton 
              listingId={data.id}
              userId={userId}
            />
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {location && (
          <div className="text-sm mb-2 flex items-center">
            <span className="font-medium mr-1">Location:</span> 
            <span className="text-neutral-500 dark:text-neutral-300">{location.label}</span>
          </div>
        )}
        
        <div className="text-sm mb-2 flex items-center">
          <span className="font-medium mr-1">Specialty:</span>
          <span className="text-neutral-500 dark:text-neutral-300 capitalize">{data.category}</span>
        </div>
        
        {/* Coach experience stats */}
        <div className="flex flex-row gap-2 mt-2 mb-3">
          <div className="py-1 px-2 bg-neutral-100 dark:bg-neutral-700 rounded-md text-center text-xs">
            <span className="font-semibold">{data.guestCount}+</span> clients
          </div>
          <div className="py-1 px-2 bg-neutral-100 dark:bg-neutral-700 rounded-md text-center text-xs">
            <span className="font-semibold">{data.roomCount}+</span> years
          </div>
        </div>
        
        {/* About This Coach - Abbreviated */}
        {data.description && (
          <div className="mt-2 mb-3">
            <h4 className="text-sm font-medium mb-1">About</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {truncatedDescription}
            </p>
          </div>
        )}
        
        {reservationDate && (
          <div className="font-light text-neutral-500 dark:text-neutral-300 mb-2">
            <div>{reservationDate}</div>
            {sessionTime && (
              <div className="text-sm text-primary font-medium mt-1">
                {sessionTime}
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-row items-center gap-1 mt-2">
          {reservation ? (
            <>
              <div className="flex items-center">
                <div className="font-semibold text-lg">
                  ${formattedPrice}
                </div>
                <div className="font-light text-neutral-500 dark:text-neutral-400 ml-1">{priceLabel}</div>
              </div>
              <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                Booked
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold text-lg">
                ${formattedPrice}
              </div>
              <div className="font-light text-neutral-500 dark:text-neutral-400">{priceLabel}</div>
            </>
          )}
        </div>
      </CardContent>
      {onAction && actionLabel && (
        <CardFooter className="p-4 pt-0">
          <Button
            disabled={disabled}
            small
            label={actionLabel} 
            onClick={handleCancel}
          />
        </CardFooter>
      )}
    </Card>
  );
}
 
export default ListingCard;
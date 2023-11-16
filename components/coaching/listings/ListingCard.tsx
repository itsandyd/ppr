'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
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

  const handleClick = () => {
    // Log the path to see if it's correct
    const path = `/coaching/listings/${data.id}`;
    console.log(path);

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
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }
  
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  return (
    <Card onClick={handleClick}>
      <CardHeader>
        <CardTitle>{location?.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          width="200"
          height="200"
          className="object-cover h-full w-full group-hover:scale-110 transition"
          src={data.imageSrc}
          alt="Listing"
        />
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          {!reservation && (
            <div className="font-light">/ hour</div>
          )}
        </div>
      </CardContent>
      {onAction && actionLabel && (
        <CardFooter>
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
'use client';

import { Range } from "react-date-range";
import { useState } from "react";
import Button from "../Button";
import Calendar from "../inputs/Calendar";

interface ListingReservationProps {
  price: number;
  dateRange: Range,
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
  selectedTime: string | null;
  onTimeSelect: (time: string | null) => void;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", 
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

const ListingReservation: React.FC<
  ListingReservationProps
> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  selectedTime,
  onTimeSelect
}) => {
  const handleSubmit = () => {
    if (!selectedTime) {
      // Optionally show an error message here
      return;
    }
    onSubmit();
  };

  return ( 
    <div 
      className="
        bg-white 
        dark:bg-neutral-800
        rounded-xl 
        border
        border-neutral-200 
        dark:border-neutral-700
        overflow-hidden
      "
    >
      <div className="
        flex flex-row items-center gap-1 p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="text-2xl font-semibold dark:text-white">
          ${price}
        </div>
        <div className="font-light text-neutral-600 dark:text-neutral-400">
          / hour
        </div>
      </div>
      <hr />
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Select Session Date</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Choose when you&apos;d like to schedule your coaching session. Each session is 1 hour long.
        </p>
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => 
            onChangeDate(value.selection)}
        />
      </div>
      
      {/* Time slot selector */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Select Time</h3>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className={`
                py-2 px-1 text-sm rounded-md transition
                ${selectedTime === time 
                  ? 'bg-black dark:bg-white text-white dark:text-black font-medium' 
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:opacity-80'}
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <Button 
          disabled={disabled || !selectedTime} 
          label="Reserve Session" 
          onClick={handleSubmit}
        />
        {!selectedTime && (
          <p className="text-xs text-rose-500 mt-2">
            Please select a time slot for your session
          </p>
        )}
      </div>
      <div 
        className="
          p-4 
          flex 
          flex-row 
          items-center 
          justify-between
          font-semibold
          text-lg
          dark:text-white
        "
      >
        <div>
          Total
        </div>
        <div>
          ${totalPrice}
        </div>
      </div>
    </div>
   );
}
 
export default ListingReservation;
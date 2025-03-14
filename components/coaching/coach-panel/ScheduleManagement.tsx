'use client';

import { useState, useEffect } from 'react';
import { User } from "@clerk/nextjs/server";
import Calendar from '@/components/coaching/inputs/Calendar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Button from '@/components/coaching/Button';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Range } from 'react-date-range';
import { AiOutlinePlus } from 'react-icons/ai';

interface ScheduleManagementProps {
  currentUser: User;
}

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface TimeSlotFormData {
  startTime: string;
  endTime: string;
}

// Format time from 24h format (14:00) to 12h format with AM/PM (2:00 PM)
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return time;
  }
  
  const period = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  // If minutes are 0, don't show them
  return minutes === 0 
    ? `${formattedHours}${period}`
    : `${formattedHours}:${minutes.toString().padStart(2, '0')}${period}`;
};

const ScheduleManagement: React.FC<ScheduleManagementProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlotFormData>({
    startTime: "09:00",
    endTime: "10:00"
  });
  
  // Setup date range for calendar
  const [dateRange, setDateRange] = useState<Range>({
    startDate: selectedDate,
    endDate: selectedDate,
    key: 'selection'
  });
  
  // Mock time slots for demonstration
  const mockTimeSlots: TimeSlot[] = [
    { id: '1', date: new Date(), startTime: '09:00', endTime: '10:00', isAvailable: true },
    { id: '2', date: new Date(), startTime: '10:00', endTime: '11:00', isAvailable: false },
    { id: '3', date: new Date(), startTime: '11:00', endTime: '12:00', isAvailable: true },
    { id: '4', date: new Date(), startTime: '14:00', endTime: '15:00', isAvailable: true },
    { id: '5', date: new Date(), startTime: '15:00', endTime: '16:00', isAvailable: false },
    { id: '6', date: new Date(), startTime: '16:00', endTime: '17:00', isAvailable: true },
  ];

  useEffect(() => {
    // In a real app, you would fetch the coach's available time slots from the server
    // For this demo, we'll use the mock data
    setAvailableTimeSlots(mockTimeSlots);
  }, []);
  
  const toggleTimeSlotAvailability = (slotId: string) => {
    setAvailableTimeSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId 
          ? { ...slot, isAvailable: !slot.isAvailable } 
          : slot
      )
    );
  };

  const handleAddTimeSlot = () => {
    setShowTimeSlotForm(true);
  };

  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTimeSlot(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTimeSlot = () => {
    const { startTime, endTime } = newTimeSlot;
    
    // Validate time format and range
    if (!startTime || !endTime) {
      toast.error('Please enter both start and end times');
      return;
    }
    
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }
    
    // Create new time slot
    const newSlot: TimeSlot = {
      id: `new-${Date.now()}`,
      date: selectedDate,
      startTime,
      endTime,
      isAvailable: true
    };
    
    setAvailableTimeSlots(prev => [...prev, newSlot]);
    setShowTimeSlotForm(false);
    
    // Reset form
    setNewTimeSlot({
      startTime: "09:00",
      endTime: "10:00"
    });
    
    toast.success('New time slot added');
  };

  const saveAvailability = async () => {
    setIsLoading(true);
    
    try {
      // Here you would make an API call to save the coach's availability
      // For demo purposes, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Availability updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalendarChange = (value: any) => {
    if (value.selection.startDate) {
      setSelectedDate(value.selection.startDate);
      setDateRange({
        startDate: value.selection.startDate,
        endDate: value.selection.startDate,
        key: 'selection'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="bg-neutral-800 border-neutral-700 md:col-span-1 shadow-lg">
        <CardHeader className="border-b border-neutral-700">
          <CardTitle className="text-white text-xl">Select Date</CardTitle>
          <CardDescription className="text-neutral-400">
            Choose dates to manage your availability
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Calendar
            value={dateRange}
            onChange={handleCalendarChange}
            disabledDates={[]}
          />
        </CardContent>
        <CardFooter className="border-t border-neutral-700 pt-4 flex justify-center">
          <Button
            small
            outline
            onClick={() => {
              const newDate = new Date(selectedDate);
              const nextWeek = [...Array(7)].map((_, i) => {
                const date = new Date(newDate);
                date.setDate(date.getDate() + i);
                return date;
              });
              
              toast.success('Added availability for the next 7 days');
            }}
            label="Add Weekly Availability"
            icon={AiOutlinePlus}
            className="max-w-[220px]"
          />
        </CardFooter>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700 md:col-span-2 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-700 pb-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle className="text-white text-lg">Time Slots</CardTitle>
              {selectedDate && (
                <CardDescription className="text-neutral-400 text-sm mt-0.5">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              small
              onClick={handleAddTimeSlot}
              disabled={isLoading}
              label="Add Slot"
              className="max-w-[100px] py-1.5 bg-blue-500"
            />
            <Button 
              small
              onClick={saveAvailability}
              disabled={isLoading}
              label="Save"
              className="max-w-[100px] py-1.5"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {/* Time Slot Form */}
          {showTimeSlotForm && (
            <div className="mb-6 p-4 bg-neutral-900 rounded-md border border-neutral-700">
              <h3 className="text-white text-sm font-medium mb-3">Add New Time Slot</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={newTimeSlot.startTime}
                    onChange={handleTimeSlotChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={newTimeSlot.endTime}
                    onChange={handleTimeSlotChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowTimeSlotForm(false)}
                  className="px-3 py-1.5 text-sm text-neutral-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTimeSlot}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                >
                  Add Time Slot
                </button>
              </div>
            </div>
          )}
        
          {availableTimeSlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTimeSlots.map((slot) => (
                <div 
                  key={slot.id}
                  onClick={() => toggleTimeSlotAvailability(slot.id)}
                  className={`
                    flex items-center p-3 rounded-md border cursor-pointer transition-all duration-200 hover:scale-105
                    ${slot.isAvailable 
                      ? 'bg-blue-900/20 border-blue-600 text-white border-2' 
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 border'
                    }
                  `}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="font-medium">
                        {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                      </span>
                    </div>
                  </div>
                  <div>
                    {slot.isAvailable ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-neutral-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 bg-neutral-900/50 rounded-lg border border-neutral-700">
              <p className="mb-3">No time slots available for this date.</p>
              <Button 
                small
                outline
                label="Add Time Slot"
                onClick={handleAddTimeSlot}
                icon={AiOutlinePlus}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagement; 
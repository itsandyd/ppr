'use client';

import { useState, useEffect } from 'react';
import { User } from "@clerk/nextjs/server";
import Calendar from '@/components/coaching/inputs/Calendar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { Range } from 'react-date-range';
import { AiOutlinePlus } from 'react-icons/ai';
import { format } from 'date-fns';

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
  const [showWeeklyAvailabilityForm, setShowWeeklyAvailabilityForm] = useState(false);
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
  
  // Fetch coach's available time slots
  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      
      // Format the date for API request
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      console.log(`Fetching time slots for date: ${formattedDate}`);
      
      const response = await axios.get(`/api/availability?date=${formattedDate}`);
      
      console.log('API response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform API response to our TimeSlot interface
        const slots = response.data.map((slot: any) => ({
          id: slot.id,
          date: new Date(slot.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable
        }));
        
        console.log(`Loaded ${slots.length} time slots`);
        setAvailableTimeSlots(slots);
      } else {
        console.log('No time slots returned from API or invalid format');
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots', error);
      toast.error('Failed to load availability');
      
      // Fallback to empty array if API fails
      setAvailableTimeSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, [selectedDate]);
  
  const toggleTimeSlotAvailability = async (slotId: string) => {
    try {
      const slot = availableTimeSlots.find(s => s.id === slotId);
      
      if (!slot) return;
      
      setIsLoading(true);
      
      // Optimistically update UI
      setAvailableTimeSlots(prevSlots => 
        prevSlots.map(s => 
          s.id === slotId 
            ? { ...s, isAvailable: !s.isAvailable } 
            : s
        )
      );
      
      // Update in database
      await axios.patch(`/api/availability/${slotId}`, {
        isAvailable: !slot.isAvailable
      });
      
      toast.success('Availability updated');
    } catch (error) {
      console.error('Error updating availability', error);
      toast.error('Failed to update availability');
      
      // Revert optimistic update on error
      fetchTimeSlots();
    } finally {
      setIsLoading(false);
    }
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

  const handleCreateTimeSlot = async () => {
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
    
    try {
      setIsLoading(true);
      
      // Create new time slot in the database
      const response = await axios.post('/api/availability', {
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        isAvailable: true
      });
      
      // Add the new slot to the local state
      const newSlot: TimeSlot = {
        id: response.data.id,
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
    } catch (error) {
      console.error('Error creating time slot', error);
      toast.error('Failed to create time slot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeeklyAvailability = () => {
    setShowWeeklyAvailabilityForm(true);
  };

  const applyWeeklyAvailability = async () => {
    try {
      setIsLoading(true);
      
      // Create time slots for the next 7 days
      const startDate = new Date(selectedDate);
      const weekDates = [...Array(7)].map((_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      });
      
      // Send request to create weekly availability
      await axios.post('/api/availability/weekly', {
        dates: weekDates,
        startTime: newTimeSlot.startTime,
        endTime: newTimeSlot.endTime
      });
      
      setShowWeeklyAvailabilityForm(false);
      toast.success('Weekly availability has been added for the next 7 days');
      
      // Refresh the current view
      fetchTimeSlots();
    } catch (error) {
      console.error('Error creating weekly availability', error);
      toast.error('Failed to create weekly availability');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAvailability = async () => {
    setIsLoading(true);
    
    try {
      // Save all time slots for the selected date
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Send all available time slots to be saved
      await axios.post('/api/availability/save-all', {
        date: formattedDate,
        timeSlots: availableTimeSlots
      });
      
      toast.success('Availability updated successfully');
      
      // Refresh the data
      fetchTimeSlots();
    } catch (error) {
      console.error('Error saving time slots', error);
      toast.error('Something went wrong while saving your availability');
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

  const handleDeleteTimeSlot = async (e: React.MouseEvent, slotId: string) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        setIsLoading(true);
        
        await axios.delete(`/api/availability/${slotId}`);
        
        setAvailableTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
        
        toast.success('Time slot deleted successfully');
      } catch (error) {
        console.error('Error deleting time slot', error);
        toast.error('Failed to delete time slot');
      } finally {
        setIsLoading(false);
      }
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
            variant="outline"
            onClick={handleAddWeeklyAvailability}
            className="w-full justify-center py-2 border-neutral-600 hover:bg-neutral-700 dark:text-white text-neutral-800 hover:text-white bg-transparent dark:bg-transparent flex items-center gap-2"
          >
            <AiOutlinePlus />
            Add Weekly Availability
          </Button>
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
              size="sm"
              onClick={handleAddTimeSlot}
              disabled={isLoading}
              className="max-w-[100px] py-1.5 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Slot
            </Button>
            <Button 
              size="sm"
              onClick={saveAvailability}
              disabled={isLoading}
              className="max-w-[100px] py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {/* Weekly Availability Form */}
          {showWeeklyAvailabilityForm && (
            <div className="mb-6 p-4 bg-neutral-900 rounded-md border border-neutral-700">
              <h3 className="text-white text-sm font-medium mb-3">Add Weekly Availability</h3>
              <p className="text-neutral-400 text-sm mb-4">
                This will create the same time slots for the next 7 days.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Daily Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={newTimeSlot.startTime}
                    onChange={handleTimeSlotChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Daily End Time</label>
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
                  onClick={() => setShowWeeklyAvailabilityForm(false)}
                  className="px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  Cancel
                </button>
                <div className="mt-2">
                  <Button 
                    variant="outline"
                    onClick={applyWeeklyAvailability}
                    disabled={isLoading}
                    className="w-full bg-transparent border-neutral-600 hover:bg-neutral-700 dark:text-white text-neutral-800 hover:text-white"
                  >
                    Apply to Selected Day
                  </Button>
                </div>
              </div>
            </div>
          )}
          
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
                  className="px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
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
        
          {isLoading ? (
            <div className="py-12 text-center text-neutral-400">
              <p>Loading availability...</p>
            </div>
          ) : availableTimeSlots.length > 0 ? (
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
                  <div className="flex items-center space-x-2">
                    {slot.isAvailable ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-neutral-500" />
                    )}
                    <button
                      onClick={(e) => handleDeleteTimeSlot(e, slot.id)}
                      className="ml-2 p-1.5 rounded-full hover:bg-red-500/20 transition-colors"
                      title="Delete time slot"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 bg-neutral-900/50 rounded-lg border border-neutral-700">
              <p className="mb-3">No time slots available for this date.</p>
              <button 
                onClick={handleAddTimeSlot}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Time Slot
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagement; 
'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  DateRange, 
  Range, 
  RangeKeyDict
} from 'react-date-range';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './calendar-styles.css';

interface DatePickerProps {
  value: Range,
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabledDates
}) => {
  const [mounted, setMounted] = useState(false);
  const dateRangeRef = useRef<any>(null);
  
  // Initialize with current date and update whenever value changes
  const [currentDate, setCurrentDate] = useState(() => {
    // Use the selected date if available, otherwise use today
    return value.startDate || new Date();
  });
  
  // Force a re-render of the calendar when the month changes
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Update currentDate whenever value.startDate changes
  useEffect(() => {
    if (value.startDate) {
      setCurrentDate(new Date(value.startDate));
    }
  }, [value.startDate]);
  
  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    
    // Clean up function to force re-initialization on unmount
    return () => {
      // This helps ensure the calendar is properly reinitialized
      if (dateRangeRef.current) {
        dateRangeRef.current = null;
      }
    };
  }, []);
  
  // Add effect to ensure day alignment when month changes
  useEffect(() => {
    // Force the calendar to rebuild with the correct date
    const timeoutId = setTimeout(() => {
      setForceUpdate(prevState => prevState + 1);
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [currentDate]);
  
  if (!mounted) {
    return null;
  }

  // Handle custom navigation and ensure calendar updates
  const navigateToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(1); // Go to first day of month
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const navigateToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(1); // Go to first day of month
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Create a custom handler for the date range onChange
  const handleDateRangeChange = (rangeChanges: RangeKeyDict) => {
    onChange(rangeChanges);
    
    // Update currentDate to match the new selection
    if (rangeChanges.selection.startDate) {
      setCurrentDate(new Date(rangeChanges.selection.startDate));
    }
  };

  // Format month and year for display
  const formattedMonthYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  // Split into separate month and year components
  const [month, year] = formattedMonthYear.split(' ');
  
  return (
    <div className="calendar-wrapper">
      {/* Custom month/year navigation */}
      <div className="month-year-navigation">
        <div className="month-selection">
          <button 
            onClick={navigateToPreviousMonth}
            className="nav-arrow prev-arrow"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="month-year-display">
            <span className="month">{month}</span>
            <span className="year">{year}</span>
          </div>
          <button 
            onClick={navigateToNextMonth}
            className="nav-arrow next-arrow"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <DateRange
        ref={dateRangeRef}
        key={`date-range-${currentDate.getMonth()}-${currentDate.getFullYear()}-${forceUpdate}`}
        rangeColors={['#3b82f6']}
        ranges={[value]}
        date={currentDate}
        onChange={handleDateRangeChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
        color="#3b82f6"
        months={1}
        weekdayDisplayFormat="EEE"
        dayDisplayFormat="d"
        showMonthAndYearPickers={false}
        shownDate={currentDate}
        preventSnapRefocus={true}
        className="dark-theme-calendar"
      />
    </div>
  );
}
 
export default DatePicker;
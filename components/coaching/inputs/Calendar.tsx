'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  DateRange, 
  Range, 
  RangeKeyDict
} from 'react-date-range';
import { useTheme } from 'next-themes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './calendar-styles.css'; // We'll create this for custom styles

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const isDarkMode = resolvedTheme === 'dark';

  // Handle navigation
  const navigateToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const navigateToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Format month and year for display
  const formattedMonthYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  // Split into separate month and year components
  const [month, year] = formattedMonthYear.split(' ');
  
  return (
    <div className={`calendar-wrapper ${isDarkMode ? 'dark-calendar' : ''}`}>
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
        rangeColors={[isDarkMode ? '#3b82f6' : '#262626']}
        ranges={[value]}
        date={currentDate}
        onChange={onChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
        color={isDarkMode ? '#3b82f6' : '#262626'}
        months={1}
        weekdayDisplayFormat="EEEEE"
        dayDisplayFormat="d"
        monthDisplayFormat="MMM yyyy"
        fixedHeight
        className={isDarkMode ? 'dark-calendar-inner' : ''}
        showMonthAndYearPickers={false} // Hide default pickers since we're using custom ones
      />
    </div>
  );
}
 
export default DatePicker;
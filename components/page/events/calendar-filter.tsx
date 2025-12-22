"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ABBREVIATED_MONTH_NAMES, CUSTOM_EVENTS } from "@/utils/constants";

interface ICalendarFilter {
  selectedYear: number;
  selectedMonth: string;
  calendarData?: Record<string, number[]>;
  onDateSelect?: (date: string, month: string, year: number) => void;
}

const CalendarFilter = (props: ICalendarFilter) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(props.selectedYear);
  const [selectedMonth, setSelectedMonth] = useState(props.selectedMonth);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Get available years
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 2 },
    (_, i) => currentYear + i
  );

  // Reset when props change
  useEffect(() => {
    setSelectedYear(props.selectedYear);
    setSelectedMonth(props.selectedMonth);
  }, [props.selectedYear, props.selectedMonth]);



  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Listen to scroll events to update the calendar filter when user scrolls
  useEffect(() => {
    const handler = (e: any) => {
      const activeMonth = e.detail.activeEventId;
      if (activeMonth && activeMonth !== selectedMonth) {
        setSelectedMonth(activeMonth);
      }
    };

    document.addEventListener(CUSTOM_EVENTS.UPDATE_SELECTED_DATE, handler);

    return () => {
      document.removeEventListener(CUSTOM_EVENTS.UPDATE_SELECTED_DATE, handler);
    };
  }, [selectedMonth]);

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const updateFilter = (year: number, month: string, shouldClose: boolean = true) => {
    setSelectedYear(year);
    setSelectedMonth(month);

    const monthIndex = ABBREVIATED_MONTH_NAMES.indexOf(month);
    const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;

    if (props.onDateSelect) {
      props.onDateSelect(date, month, year);
    }

    // Update URL params
    const params = new URLSearchParams(
      typeof searchParams === 'string' ? searchParams : new URLSearchParams(searchParams).toString()
    );
    params.set("year", year.toString());
    params.set("date", date);
    const pathname = window.location.pathname;
    
    // Use scroll: false to prevent Next.js from handling scroll, avoiding double-scroll
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    // Dispatch event to trigger scroll
    document.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.UPDATE_EVENTS_OBSERVER, {
        detail: { month },
      })
    );

    if (shouldClose) {
      setIsOpen(false);
    }
  };

  const handleYearSelect = (year: number) => {
    const currentYear = new Date().getFullYear();

    // If switching to current year, reset to default behavior (clear date param)
    // This allows the page/ListView to determine the best default month (Today/Upcoming)
    // instead of forcing the previously selected month from another year.
    if (year === currentYear) {
       setSelectedYear(year);
       
       const params = new URLSearchParams(
         typeof searchParams === 'string' ? searchParams : new URLSearchParams(searchParams).toString()
       );
       params.set("year", year.toString());
       params.delete("date"); 

       const pathname = window.location.pathname;
       router.push(`${pathname}?${params.toString()}`, { scroll: false });
       
       // Do not close dropdown on year select, per user request
       // setIsOpen(false); 
       return;
    }

    const monthsIndicesForYear = (props.calendarData || {})[year.toString()] || [];
    let targetMonth = selectedMonth;

    const currentMonthIndex = ABBREVIATED_MONTH_NAMES.indexOf(selectedMonth);

    // If the current month is not available in the new year, switch to the first available month
    if (!monthsIndicesForYear.includes(currentMonthIndex) && monthsIndicesForYear.length > 0) {
      const sortedIndices = [...monthsIndicesForYear].sort((a, b) => a - b);
      targetMonth = ABBREVIATED_MONTH_NAMES[sortedIndices[0]];
    }

    // Pass false to keep dropdown open
    updateFilter(year, targetMonth, false);
  };

  const handleMonthSelect = (month: string) => {
    // Pass true (or default) to close dropdown
    updateFilter(selectedYear, month, true);
  };

  // Get display text for button
  const getButtonText = () => {
    return `${selectedYear} ${selectedMonth}`;
  };

  return (
    <div className="calendar-filter__wrapper" ref={calendarRef}>
      <button className="calendar-filter__button" onClick={toggleCalendar}>
        <span>{getButtonText()}</span>
        <img src="/icons/down_arrow_filled.svg" alt="down arrow" />
      </button>
      {isOpen && (
        <div className="calendar-filter__dropdown">
          <div className="calendar-filter__year-section">
            <div className="calendar-filter__year-label">Year</div>
            <div className="calendar-filter__year-list">
              {availableYears.map((year: number) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`calendar-filter__year-item ${selectedYear === year ? 'active' : ''}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
            <div className="calendar-filter__month-section">
              <div className="calendar-filter__month-label">Month</div>
              <div className="calendar-filter__month-list">
                {ABBREVIATED_MONTH_NAMES.map((month: string, index: number) => {
                  // Get months with events for the selected year
                  const monthsForYear = (props.calendarData || {})[selectedYear.toString()] || [];
                  const hasEvents = monthsForYear.includes(index);
                  const isDisabled = !hasEvents;
                  
                  return (
                    <button
                      key={month}
                      onClick={() => !isDisabled && handleMonthSelect(month)}
                      className={`calendar-filter__month-item ${selectedMonth === month ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      disabled={isDisabled}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
        </div>
      )}
      <style jsx>{`
        .calendar-filter__wrapper {
          position: relative;
        }

        .calendar-filter__button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 32px;
          border: none;
          border-radius: 9px;
          padding: 4px 12px;
          background-color: #ffffff;
          color: #156ff7;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          width: auto;
          min-width: 100px;
          gap: 8px;
        }

        .calendar-filter__button span {
          white-space: nowrap;
        }

        .calendar-filter__dropdown {
          position: absolute;
          top: 40px;
          left: 0;
          border-radius: 8px;
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
          background-color: #ffffff;
          z-index: 10;
          padding: 16px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .calendar-filter__year-section,
        .calendar-filter__month-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .calendar-filter__year-label,
        .calendar-filter__month-label {
          font-size: 12px;
          font-weight: 600;
          color: #156ff7;
        }

        .calendar-filter__year-list,
        .calendar-filter__month-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .calendar-filter__year-item,
        .calendar-filter__month-item {
          padding: 6px 12px;
          border: 1px solid #156ff7;
          border-radius: 100px;
          background-color: #ffffff;
          color: #156ff7;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .calendar-filter__year-item:hover,
        .calendar-filter__month-item:hover:not(.disabled) {
          background-color: #f0f7ff;
        }

        .calendar-filter__year-item.active,
        .calendar-filter__month-item.active {
          background-color: #156ff7;
          color: #ffffff;
        }

        .calendar-filter__month-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .calendar-filter__month-item.disabled:hover {
          background-color: #ffffff;
        }

        @media (min-width: 1024px) {
          .calendar-filter__wrapper {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarFilter;

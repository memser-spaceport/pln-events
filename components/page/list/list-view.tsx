"use client";

import EventCard from "./event-card";
import SideBar from "./side-bar";
import EventsNoResults from "@/components/ui/events-no-results";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import { groupByStartDate } from "@/utils/helper";
import { useRouter, useSearchParams } from "next/navigation";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ABBREVIATED_MONTH_NAMES } from "@/utils/constants";

const ListView = (props: any) => {
  const events = props.events ?? [];
  const allEvents = props.allEvents ?? [];
  const viewType = props?.viewType;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onEventClicked, onBackToThisMonthClicked } = useSchedulePageAnalytics();

  // Get current year from URL or default to current year
  const currentYear = useMemo(() => {
    const yearParam = searchParams.get("year");
    if (yearParam) {
      return parseInt(yearParam, 10);
    }
    return new Date().getFullYear();
  }, [searchParams]);

  // Events are already sorted server-side (consistent with filtering pattern)
  const groupedEvents = useMemo(() => groupByStartDate(events), [events]);

  useEffect(() => {
    if (!groupedEvents || Object.keys(groupedEvents).length === 0) return;
    
    const now = new Date();
    const currentYearInCalendar = now.getFullYear();
    let targetedMonth = null;
    
    // If viewing current year, scroll to today's month (or next available)
    if (currentYear === currentYearInCalendar) {
      const currentMonth = now.getMonth();
      for (let i = 0; i < ABBREVIATED_MONTH_NAMES.length; i++) {
        const idx = (currentMonth + i) % 12;
        const key = ABBREVIATED_MONTH_NAMES[idx];
        if (key in groupedEvents) {
          targetedMonth = key;
          break;
        }
      }
    } else {
      // If viewing a different year, scroll to the first event (first month)
      const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
        const indexA = ABBREVIATED_MONTH_NAMES.indexOf(a);
        const indexB = ABBREVIATED_MONTH_NAMES.indexOf(b);
        return indexA - indexB;
      });
      targetedMonth = sortedMonths.length > 0 ? sortedMonths[0] : null;
    }
    
    if (targetedMonth) {
      const el = document.getElementById(targetedMonth);
      if (el) {
        const headerOffset = 140;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        // Dispatch event to update sidebar highlight
        document.dispatchEvent(
          new CustomEvent(CUSTOM_EVENTS.UPDATE_EVENTS_OBSERVER, {
            detail: { month: targetedMonth },
          })
        );
      }
    }
  }, [groupedEvents, currentYear]);

  const [showBackToThisMonthButton, setShowBackToThisMonthButton] = useState(false);
  const [isBelowCurrentMonth, setIsBelowCurrentMonth] = useState(false);

  const onOpenDetailPopup = (event: any) => {
    onEventClicked(viewType, event?.id, event?.name);

    if (event.slug) {
      document.dispatchEvent(
        new CustomEvent(CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL, {
          detail: { isOpen: true, event },
        })
      );
      router.push(`${window.location.pathname}${window.location.search}#${event.slug}`, { scroll: false });
    }
  };


  const handleBackToCurrentMonth = () => {
    const now = new Date();
    const currentYearInCalendar = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentMonthKey = ABBREVIATED_MONTH_NAMES[currentMonth];

    // Only proceed if viewing current year
    if (currentYear !== currentYearInCalendar) {
      return;
    }

    let targetMonth = null;

    // Check if current month has events
    if (currentMonthKey in groupedEvents) {
      targetMonth = currentMonthKey;
    } else {
      for (let i = 1; i <= 11 - currentMonth; i++) {
        const idx = currentMonth + i;
        const key = ABBREVIATED_MONTH_NAMES[idx];
        if (key in groupedEvents) {
          targetMonth = key;
          break;
        }
      }
      
      if (!targetMonth) {
        for (let i = currentMonth - 1; i >= 0; i--) {
          const key = ABBREVIATED_MONTH_NAMES[i];
          if (key in groupedEvents) {
            targetMonth = key;
            break;
          }
        }
      }
    }

    if (targetMonth) {
      onBackToThisMonthClicked(viewType, currentYear, currentMonthKey, targetMonth);

      const el = document.getElementById(targetMonth);
      if (el) {
        const headerOffset = 140;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        // Dispatch event to update sidebar highlight
        document.dispatchEvent(
          new CustomEvent(CUSTOM_EVENTS.UPDATE_EVENTS_OBSERVER, {
            detail: { month: targetMonth },
          })
        );
      }
    }
  };

  // Ref to track scheduled animation frame (prevents multiple RAF calls)
  const scrollRafIdRef = useRef<number | null>(null);
  // Ref to track previous button visibility state to avoid unnecessary updates
  const prevButtonVisibilityRef = useRef<boolean | null>(null);

  // Memoized function to check button visibility and update state only when needed
  const checkButtonVisibility = useCallback(() => {
    const now = new Date();
    const currentYearInCalendar = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentMonthKey = ABBREVIATED_MONTH_NAMES[currentMonth];

    // Only show button if viewing current year and events exist
    if (currentYear !== currentYearInCalendar || Object.keys(groupedEvents).length === 0) {
      // Hide button when not viewing current year or no events
      if (prevButtonVisibilityRef.current !== false) {
        setShowBackToThisMonthButton(false);
        prevButtonVisibilityRef.current = false;
      }
      setIsBelowCurrentMonth(false);
      return;
    }


    let targetMonthKey = currentMonthKey;
    const currentMonthEl = document.getElementById(currentMonthKey);
    
    if (!currentMonthEl) {
      let nearestMonth = null;
      
      for (let i = 1; i <= 11 - currentMonth; i++) {
        const idx = currentMonth + i;
        const key = ABBREVIATED_MONTH_NAMES[idx];
        if (key in groupedEvents) {
          nearestMonth = key;
          break;
        }
      }
      
      if (!nearestMonth) {
        for (let i = currentMonth - 1; i >= 0; i--) {
          const key = ABBREVIATED_MONTH_NAMES[i];
          if (key in groupedEvents) {
            nearestMonth = key;
            break;
          }
        }
      }
      
      if (!nearestMonth) {
        if (prevButtonVisibilityRef.current !== false) {
          setShowBackToThisMonthButton(false);
          prevButtonVisibilityRef.current = false;
        }
        setIsBelowCurrentMonth(false);
        return;
      }
      
      targetMonthKey = nearestMonth;
    }


    const targetMonthEl = document.getElementById(targetMonthKey);
    if (!targetMonthEl) {
      if (prevButtonVisibilityRef.current !== false) {
        setShowBackToThisMonthButton(false);
        prevButtonVisibilityRef.current = false;
      }
      setIsBelowCurrentMonth(false);
      return;
    }

    // Calculate viewport and element positions
    const headerOffset = 140;
    const elementRect = targetMonthEl.getBoundingClientRect();
    const elementTop = elementRect.top + window.scrollY;
    const elementBottom = elementTop + elementRect.height;
    const viewportTop = window.scrollY + headerOffset;
    const viewportBottom = window.scrollY + window.innerHeight;

    const tolerance = 100; // pixels of tolerance
    const isTargetMonthVisible = 
      (elementTop <= viewportBottom + tolerance && elementBottom >= viewportTop - tolerance);

    const isBelow = viewportTop > elementBottom;

    const shouldShowButton = !isTargetMonthVisible;
    if (prevButtonVisibilityRef.current !== shouldShowButton) {
      setShowBackToThisMonthButton(shouldShowButton);
      prevButtonVisibilityRef.current = shouldShowButton;
    }
    
    // Update scroll direction state
    setIsBelowCurrentMonth(isBelow);
  }, [currentYear, groupedEvents]);

  // Optimized scroll handler using requestAnimationFrame to batch scroll events
  const handleScroll = useCallback(() => {
    // Cancel any pending animation frame
    if (scrollRafIdRef.current !== null) {
      cancelAnimationFrame(scrollRafIdRef.current);
    }
    
    // Schedule check for next animation frame (batches scroll events)
    scrollRafIdRef.current = requestAnimationFrame(() => {
      scrollRafIdRef.current = null;
      checkButtonVisibility();
    });
  }, [checkButtonVisibility]);

  // Hide/show button based on whether user is at current month
  useEffect(() => {
    // Reset previous state when dependencies change
    prevButtonVisibilityRef.current = null;

    // Check immediately when year or events change
    checkButtonVisibility();

    // Listen to scroll events (will catch auto-scroll animation)
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Clean up animation frame if pending
      if (scrollRafIdRef.current !== null) {
        cancelAnimationFrame(scrollRafIdRef.current);
        scrollRafIdRef.current = null;
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [groupedEvents, currentYear, checkButtonVisibility, handleScroll]);

  return (
    <>
      <div className="listView__wrpr">
        <div className="listview__cn">
          <div className="listView">
            {Object.entries(groupedEvents)?.length > 0 && (
              <>
                {Object.entries(groupedEvents)?.map(([key, value]: [string, any]) => {
                    return (
                    <div id={key} key={key} className="listView__events__wrpr">
                        <div className="listView__agenda__header">
                        <h6 className="listView__agenda__header__text">{key}{`-${currentYear}`}</h6>
                        </div>
                        <div className="listView__events">
                          {value?.map((event: any, index: number) => {
                            return (
                              !event.isHidden && (
                                <div
                                  className="listView__events__event"
                                  onClick={() => onOpenDetailPopup(event)}
                                  key={`list-view-event-${index}`}
                                >
                                  <EventCard event={event} />
                                </div>
                              )
                            );
                          })}
                        </div>
                      </div>
                    );
                })}
                <div className="listView__es"></div>
              </>
            )}
            {Object.entries(groupedEvents)?.length === 0 && <EventsNoResults />}
          </div>
        </div>
        {Object.entries(groupedEvents)?.length > 0 && showBackToThisMonthButton && (
          <button
            className="listView__back-to-this-month"
            onClick={handleBackToCurrentMonth}
            aria-label="Back to this month"
          >
            <img 
              src="/icons/back-to-icon.svg" 
              alt="Current month" 
              style={{ transform: isBelowCurrentMonth ? 'rotate(180deg)' : 'none' }}
            />
            <span className="listView__back-to-this-month__text">View Current Month</span>
          </button>
        )}
        <div className="listView__sidebar">
          <SideBar 
            events={groupedEvents} 
            allEvents={allEvents}
          />
        </div>
      </div>
      <style jsx>{`
        .listView__wrpr {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr)) 160px;
        }

        .listview__cn {
          width: 100%;
          display: flex;
          justify-content: center;
          grid-column: 1 / -1;
        }

        .listView {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px 10px 20px 10px;
          width: 100%;
        }

        .listView__sidebar {
          display: none;
          grid-column: auto;
        }

        .listView__custom-card-bg {
          position: relative;
          cursor: pointer;
        }

        .listView__events__wrpr {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 24px;
        }

        .listView__events {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .listView__events__event {
          cursor: pointer;
        }

        .listView__agenda__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 1px;
          background-color: #156ff7;
          margin-bottom: 20px;
          background-image: linear-gradient(to left, white 2%, #156ff7 50%, white 98%);
          background-image: -o-linear-gradient(to left, white 2%, #156ff7 50%, white 98%);
          background-image: -moz-linear-gradient(to left, white 2%, #156ff7 50%, white 98%);
          background-image: -webkit-linear-gradient(to left, white 2%, #156ff7 50%, white 98%);
          background-image: -ms-linear-gradient(to left, white 2%, #156ff7 50%, white 98%);
          background-image: linear-gradient(to left, white 2%, #156ff7 50%, white 98%);
        }

        .listView__agenda__header__text {
          position: relative;
          z-index: 1;
          background-color: white;
          padding: 0 10px;
          color: #156ff7;
          font-weight: 600;
          font-size: 14px;
        }

        .listView__es {
          display: none;
          height: 500px;
        }

        .listView__back-to-this-month {
          position: fixed;
          bottom: 24px;
          right: 24px;
          min-width: 125px;
          height: 40px;
          background-color: #ffffff;
          color: #156ff7;
          border: 1px solid #156ff7;
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-sizing: border-box;
          white-space: nowrap;
        }

        .listView__back-to-this-month img {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .listView__back-to-this-month:hover {
          background-color: #f0f7ff;
        }

        .listView__back-to-this-month:active {
          background-color: #e0efff;
        }

        .listView__back-to-this-month__text {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #156ff7;
        }

        @media (min-width: 1024px) {
          .listView__sidebar {
            display: block;
          }
          .listview__cn {
            grid-column: span 1 / span 1;
          }
          .listView {
            width: 60%;
            padding: 30px 10px 30px 10px;
          }

          .listView__es {
            display: block;
          }

          .listView__back-to-this-month {
            right: calc(160px + 24px);
          }
        }
      `}</style>
    </>
  );
};

export default ListView;
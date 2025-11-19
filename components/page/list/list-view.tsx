"use client";

import EventCard from "./event-card";
import SideBar from "./side-bar";
import EventsNoResults from "@/components/ui/events-no-results";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import { formatDateTime, groupByStartDate, sortEventsByStartDate } from "@/utils/helper";
import { useRouter, useSearchParams } from "next/navigation";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useEffect, useMemo } from "react";
import { ABBREVIATED_MONTH_NAMES } from "@/utils/constants";

const ListView = (props: any) => {
  const allEvents = props.allEvents ?? [];
  const viewType = props?.viewType;
  const dateFrom = props?.dateFrom;
  const dateTo = props?.dateTo;
  const eventTimezone = props?.eventTimezone;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onEventClicked } = useSchedulePageAnalytics();

  // Get current year from URL or default to current year
  const currentYear = useMemo(() => {
    const yearParam = searchParams.get("year");
    if (yearParam) {
      return parseInt(yearParam, 10);
    }
    return new Date().getFullYear();
  }, [searchParams]);

  // Filter events client-side by year for instant updates
  const filteredEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];
    
    return allEvents.filter((event: any) => {
      // Filter out hidden events for list view
      if (event.isHidden) {
        return false;
      }
      
      // Filter by year
      if (event.startDate) {
        const eventYear = new Date(event.startDate).getFullYear();
        return eventYear === currentYear;
      }
      return false;
    });
  }, [allEvents, currentYear]);

  const sortedEvents = useMemo(() => sortEventsByStartDate(filteredEvents), [filteredEvents]);
  const groupedEvents = useMemo(() => groupByStartDate(sortedEvents), [sortedEvents]);
  const year = formatDateTime(sortedEvents[0]?.startDate, sortedEvents[0]?.timezone, "YYYY")

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

  const onOpenDetailPopup = (event: any) => {
    onEventClicked(viewType, event?.id, event?.name);

    if (event.slug) {
      document.dispatchEvent(
        new CustomEvent(CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL, {
          detail: { isOpen: true, event },
        })
      );
      router.push(`${window.location.pathname}${window.location.search}#${event.slug}`, { scroll: false });
      // window.location.href = `${window.location.pathname}${window.location.search}#${event.slug}`
    }
  };

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
                        <h6 className="listView__agenda__header__text">{key}{`-${year}`}</h6>
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
        <div className="listView__sidebar">
          <SideBar 
            events={groupedEvents} 
            allEvents={allEvents}
            dateFrom={dateFrom} 
            dateTo={dateTo} 
            eventTimezone={eventTimezone} 
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
        }
      `}</style>
    </>
  );
};

export default ListView;
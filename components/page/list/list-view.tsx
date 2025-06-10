"use client";

import EventCard from "./event-card";
import SideBar from "./side-bar";
import EventsNoResults from "@/components/ui/events-no-results";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import { formatDateTime, groupByStartDate, sortEventsByStartDate } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useEffect } from "react";
import { ABBREVIATED_MONTH_NAMES } from "@/utils/constants";

const ListView = (props: any) => {
  const events = props.events ?? [];
  const viewType = props?.viewType;
  const dateFrom = props?.dateFrom;
  const dateTo = props?.dateTo;
  const eventTimezone = props?.eventTimezone;
  const router = useRouter();
  const { onEventClicked } = useSchedulePageAnalytics();

  const sortedEvents = sortEventsByStartDate(events);
  const groupedEvents = groupByStartDate(sortedEvents);
  const year = formatDateTime(sortedEvents[0]?.startDate, sortedEvents[0]?.timezone, "YYYY")

  useEffect(() => {
    if (!groupedEvents || Object.keys(groupedEvents).length === 0) return;
    const now = new Date();
    const currentMonth = now.getMonth();
    let targetedMonth = null;
    for (let i = 0; i < ABBREVIATED_MONTH_NAMES.length; i++) {
      const idx = (currentMonth + i) % 12;
      const key = ABBREVIATED_MONTH_NAMES[idx];
      if (key in groupedEvents) {
        targetedMonth = key;
        break;
      }
    }
    if (targetedMonth) {
      const el = document.getElementById(targetedMonth);
      if (el) {
        const headerOffset = 120;
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
  }, [groupedEvents]);

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
          <SideBar events={groupedEvents} dateFrom={dateFrom} dateTo={dateTo} eventTimezone={eventTimezone} />
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